import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { config } from './config/env';
import coordinatesRoutes from './routes/coordinates.routes';
import parcelRoutes from './routes/parcel.routes';
import predictRoutes from './routes/predict.routes';
import valuationRoutes from './routes/valuation.routes';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';

const app = express();

// CORS
app.use(cors({
  credentials: true,
  origin: [
    'http://147.182.185.158:3002',
    process.env.ORIGIN1 || 'http://localhost:3000',
    process.env.ORIGIN2 || 'http://localhost:3001',
    process.env.ORIGIN3 || 'http://192.168.100.147:3001',
    process.env.ORIGIN4 || 'http://147.182.185.158:3002',
  ],
}));

app.use(express.json());
app.use(cookieParser());

// Mount route handlers
app.use('/coordinates', coordinatesRoutes);
app.use('/parcelData', parcelRoutes);
app.use('/predict', predictRoutes);
app.use('/valuation', valuationRoutes);
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

// Start the Server
app.listen(Number(config.port), '0.0.0.0', () => {
  console.log(`Server running on port ${config.port}`);
});
