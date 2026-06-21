import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import tripRoutes from './routes/tripRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean) as string[];

app.use(cors({
  origin: allowedOrigins.length > 0 ? (origin, callback) => {
    // Allow if origin is undefined (e.g. server-to-server or Postman) or matched
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  } : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'API Route Not Found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
