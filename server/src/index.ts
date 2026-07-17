import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

export const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for testing/dev ease, adjust for production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Import and use routes (stubbed for now, will create next)
import authRouter from './routes/auth.js';
import propertiesRouter from './routes/properties.js';
import franchisesRouter from './routes/franchises.js';
import dealersRouter from './routes/dealers.js';
import enquiriesRouter from './routes/enquiries.js';
import settingsRouter from './routes/settings.js';
import analyticsRouter from './routes/analytics.js';
import businessesRouter from './routes/businesses.js';

app.use('/api/auth', authRouter);
app.use('/api/properties', propertiesRouter);
app.use('/api/franchises', franchisesRouter);
app.use('/api/dealers', dealersRouter);
app.use('/api/enquiries', enquiriesRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/businesses', businessesRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
