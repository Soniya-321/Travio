import { Request, Response } from 'express';
import { Trip } from '../models/Trip';

// Helper for exponential backoff retries on Gemini API
const callGeminiWithBackoff = async (prompt: string, apiKey: string): Promise<any> => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  const payload = {
    contents: [
      {
        parts: [
          {
            text: prompt
          }
        ]
      }
    ],
    generationConfig: {
      responseMimeType: "application/json"
    }
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  const retries = [1000, 2000, 4000, 8000, 16000]; // 1s, 2s, 4s, 8s, 16s

  for (let i = 0; i <= retries.length; i++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.status === 429) {
        if (i < retries.length) {
          const waitTime = retries[i];
          console.warn(`Gemini API returned 429 Rate Limit. Retrying in ${waitTime}ms (Attempt ${i + 1}/5)...`);
          await delay(waitTime);
          continue;
        } else {
          throw new Error('Gemini API rate limit exceeded after maximum retries.');
        }
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error (Status ${response.status}): ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      if (i === retries.length) {
        throw error;
      }
      const waitTime = retries[i];
      console.warn(`Gemini API call failed: ${error.message}. Retrying in ${waitTime}ms (Attempt ${i + 1}/5)...`);
      await delay(waitTime);
    }
  }
};

export const generateTrip = async (req: Request, res: Response) => {
  try {
    const { destination, durationDays, budgetTier, interests } = req.body;
    const userId = (req as any).user?.id;

    if (!destination || !durationDays || !budgetTier || !interests || !Array.isArray(interests)) {
      return res.status(400).json({ message: 'Please provide destination, durationDays (1-30), budgetTier and interests array.' });
    }

    const days = Number(durationDays);
    if (isNaN(days) || days < 1 || days > 30) {
      return res.status(400).json({ message: 'Duration must be a number between 1 and 30 days.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        message: 'Gemini API Key is not configured on the server. Please set GEMINI_API_KEY in backend .env' 
      });
    }

    const prompt = `Generate a detailed travel itinerary for a trip to ${destination}.
Duration: ${durationDays} days.
Budget Tier: ${budgetTier} (keep the hotel costs, activities cost consistent with this budget tier).
Interests: ${interests.join(', ')}.

Ensure you suggest hotel recommendations matching the ${budgetTier} budget.
Generate a weather-aware smart packing checklist divided into categories:
- Documents
- Clothing (climate-appropriate based on destination weather)
- Gear (activity-specific, e.g. hiking boots if trekking is planned)
- Toiletries & Health

Return ONLY a JSON object that adheres strictly to the following schema:
{
  "itinerary": [
    {
      "dayNumber": 1,
      "activities": [
        {
          "title": "Activity name",
          "description": "2-3 sentence description detailing what to do",
          "estimatedCostUSD": 20,
          "timeOfDay": "Morning"
        }
      ]
    }
  ],
  "hotels": [
    {
      "name": "Hotel Name",
      "tier": "${budgetTier}",
      "estimatedCostNightUSD": 85,
      "rating": "4.5/5",
      "highlights": "Key highlights of the hotel"
    }
  ],
  "estimatedBudget": {
    "flights": 400,
    "accommodation": 300,
    "food": 150,
    "activities": 100,
    "total": 950
  },
  "packingList": [
    { "item": "Passport", "category": "Documents", "isPacked": false },
    { "item": "Sunscreen SPF 50", "category": "Clothing", "isPacked": false }
  ]
}

Only use these exact categories for packing items: 'Documents', 'Clothing', 'Gear', 'Toiletries & Health'.
Return valid JSON without any markdown code blocks, backticks, or preamble.`;

    const geminiResponse = await callGeminiWithBackoff(prompt, apiKey);
    
    let text = geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error('Invalid response structure from Gemini API');
    }

    // Clean markdown styling if Gemini outputted it despite instructions
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let parsedResult;
    try {
      parsedResult = JSON.parse(text);
    } catch (parseError: any) {
      console.error('Failed to parse Gemini response text as JSON:', text);
      return res.status(500).json({ 
        message: 'AI returned invalid JSON formatting. Please try again.',
        error: parseError.message 
      });
    }

    // Save trip details in MongoDB
    const trip = await Trip.create({
      userId,
      destination,
      durationDays: days,
      budgetTier,
      interests,
      itinerary: parsedResult.itinerary,
      hotels: parsedResult.hotels,
      estimatedBudget: parsedResult.estimatedBudget,
      packingList: parsedResult.packingList
    });

    return res.status(201).json(trip);
  } catch (error: any) {
    console.error('Error generating trip:', error);
    return res.status(500).json({ message: 'Server error generating trip.', error: error.message });
  }
};

export const getTrips = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    // Data isolation at query level
    const trips = await Trip.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json(trips);
  } catch (error: any) {
    console.error('Error fetching trips:', error);
    return res.status(500).json({ message: 'Server error fetching trips.', error: error.message });
  }
};

export const getTripById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const tripId = req.params.id;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    // Strict ownership enforcement
    if (trip.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied. You do not own this trip.' });
    }

    return res.status(200).json(trip);
  } catch (error: any) {
    console.error('Error fetching trip:', error);
    return res.status(500).json({ message: 'Server error fetching trip.', error: error.message });
  }
};

export const updateTrip = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const tripId = req.params.id;
    const { itinerary, packingList } = req.body;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    // Strict ownership enforcement
    if (trip.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied. You do not own this trip.' });
    }

    if (itinerary !== undefined) {
      trip.itinerary = itinerary;
    }
    if (packingList !== undefined) {
      trip.packingList = packingList;
    }

    await trip.save();
    return res.status(200).json(trip);
  } catch (error: any) {
    console.error('Error updating trip:', error);
    return res.status(500).json({ message: 'Server error updating trip.', error: error.message });
  }
};

export const deleteTrip = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const tripId = req.params.id;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    // Strict ownership enforcement
    if (trip.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied. You do not own this trip.' });
    }

    await Trip.deleteOne({ _id: tripId });
    return res.status(200).json({ message: 'Trip deleted successfully.' });
  } catch (error: any) {
    console.error('Error deleting trip:', error);
    return res.status(500).json({ message: 'Server error deleting trip.', error: error.message });
  }
};

export const regenerateDay = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const tripId = req.params.id;
    const { dayNumber, userFeedback } = req.body;

    if (dayNumber === undefined || !userFeedback) {
      return res.status(400).json({ message: 'Please provide dayNumber and userFeedback.' });
    }

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    // Strict ownership enforcement
    if (trip.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied. You do not own this trip.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        message: 'Gemini API Key is not configured on the server. Please set GEMINI_API_KEY in backend .env' 
      });
    }

    const targetPrompt = `Regenerate Day ${dayNumber} of the trip to ${trip.destination} with focus on ${userFeedback}. Return ONLY a JSON array of activity objects.
    Adhere strictly to this schema format for the activities array:
    [
      {
        "title": "Activity name",
        "description": "2-3 sentence description detailing what to do",
        "estimatedCostUSD": 20,
        "timeOfDay": "Morning"
      }
    ]
    Use timeOfDay values of 'Morning', 'Afternoon', or 'Evening'.
    Return valid JSON without any markdown code blocks, backticks, or preamble.`;

    const geminiResponse = await callGeminiWithBackoff(targetPrompt, apiKey);
    
    let text = geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error('Invalid response structure from Gemini API');
    }

    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    let newActivities;
    try {
      newActivities = JSON.parse(text);
    } catch (parseError: any) {
      console.error('Failed to parse Day activities JSON from Gemini:', text);
      return res.status(500).json({ 
        message: 'AI returned invalid JSON formatting for the activities. Please try again.',
        error: parseError.message 
      });
    }

    if (!Array.isArray(newActivities)) {
      return res.status(500).json({ message: 'AI did not return a JSON array of activities.' });
    }

    // Find the day and update its activities
    const dayIndex = trip.itinerary.findIndex(d => d.dayNumber === Number(dayNumber));
    if (dayIndex !== -1) {
      trip.itinerary[dayIndex].activities = newActivities as any;
    } else {
      // If it doesn't exist for some reason, create it
      trip.itinerary.push({
        dayNumber: Number(dayNumber),
        activities: newActivities as any
      });
      // Sort itinerary by dayNumber
      trip.itinerary.sort((a, b) => a.dayNumber - b.dayNumber);
    }

    await trip.save();
    return res.status(200).json(trip);
  } catch (error: any) {
    console.error('Error regenerating day:', error);
    return res.status(500).json({ message: 'Server error regenerating day.', error: error.message });
  }
};
