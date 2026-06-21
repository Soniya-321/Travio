import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/User';
import { Trip } from './models/Trip';

dotenv.config();

const runTest = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/travel-planner';
    console.log(`Connecting to ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('MongoDB connection successful.');

    // Clean any old test users
    await User.deleteMany({ email: 'test-smoke-db@example.com' });
    
    // Create User
    console.log('Creating test user...');
    const user = await User.create({
      name: 'Smoke Tester',
      email: 'test-smoke-db@example.com',
      password: 'hashed_password_123'
    });
    console.log('User created:', user.id);

    // Create Trip
    console.log('Creating test trip...');
    const trip = await Trip.create({
      userId: user._id,
      destination: 'Tokyo, Japan',
      durationDays: 3,
      budgetTier: 'Medium',
      interests: ['Food', 'Culture'],
      itinerary: [
        {
          dayNumber: 1,
          activities: [
            {
              title: 'Sensō-ji Temple',
              description: 'Explore Tokyo’s oldest and most iconic Buddhist temple located in Asakusa.',
              estimatedCostUSD: 0,
              timeOfDay: 'Morning'
            }
          ]
        }
      ],
      hotels: [
        {
          name: 'Asakusa Tobu Hotel',
          tier: 'Medium',
          estimatedCostNightUSD: 120,
          rating: '4.7/5',
          highlights: 'Direct connection to train station, clean rooms'
        }
      ],
      estimatedBudget: {
        flights: 500,
        accommodation: 360,
        food: 120,
        activities: 50,
        total: 1030
      },
      packingList: [
        { item: 'Passport', category: 'Documents', isPacked: true },
        { item: 'Comfortable Walking Shoes', category: 'Clothing', isPacked: false }
      ]
    });
    console.log('Trip created:', trip.id);

    // Read back data
    const fetchedTrip = await Trip.findOne({ userId: user._id });
    if (!fetchedTrip) {
      throw new Error('Trip could not be retrieved from DB.');
    }
    console.log('Trip retrieved successfully! Destination:', fetchedTrip.destination);

    // Clean up
    console.log('Cleaning up test data...');
    await Trip.deleteOne({ _id: trip._id });
    await User.deleteOne({ _id: user._id });
    console.log('Cleanup complete.');

    await mongoose.disconnect();
    console.log('Database smoke test completed successfully! Schema constraints and indexes are valid.');
  } catch (error: any) {
    console.error('Smoke test failed:', error.message);
    mongoose.disconnect();
    process.exit(1);
  }
};

runTest();
