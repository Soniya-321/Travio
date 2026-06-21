import mongoose, { Schema } from 'mongoose';

const ActivitySchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  estimatedCostUSD: { type: Number, default: 0 },
  timeOfDay: { type: String, enum: ['Morning', 'Afternoon', 'Evening'], required: true }
});

const DaySchema = new Schema({
  dayNumber: { type: Number, required: true },
  activities: [ActivitySchema]
});

const HotelSchema = new Schema({
  name: { type: String, required: true },
  tier: { type: String, required: true },
  estimatedCostNightUSD: { type: Number, default: 0 },
  rating: { type: String, required: true },
  highlights: { type: String, required: true }
});

const PackingItemSchema = new Schema({
  item: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Documents', 'Clothing', 'Gear', 'Toiletries & Health'], 
    required: true 
  },
  isPacked: { type: Boolean, default: false }
});

const TripSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  destination: { type: String, required: true },
  durationDays: { type: Number, required: true },
  budgetTier: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
  interests: [{ type: String }],
  itinerary: [DaySchema],
  hotels: [HotelSchema],
  estimatedBudget: {
    flights: { type: Number, default: 0 },
    accommodation: { type: Number, default: 0 },
    food: { type: Number, default: 0 },
    activities: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  packingList: [PackingItemSchema]
}, {
  timestamps: true
});

export const Trip = mongoose.model('Trip', TripSchema);
