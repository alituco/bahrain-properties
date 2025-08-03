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
import propertyNotesRoutes from './routes/propertyNotes.routes';
import firmPropertiesRouter from './routes/firmProperties.controller';
import propertyFiltersRoutes from './routes/propertyFilters.routes';

import firmSpecificDataRoutes from './routes/firmSpecificData.routes';
import apartmentRoutes from './routes/apartment/apartment.routes'
import houseRoutes from './routes/house/house.routes'

import listedLandRoutes from './routes/marketplace/land.routes';
import apartmentMarketplaceRoutes from './routes/marketplace/apartments.routes'
import housesMarketplaceRoutes from './routes/marketplace/house.routes'
import residentialMarketplaceRoutes from './routes/marketplace/listedResidential.routes';

const app = express();

// CORS
app.use(cors({
  credentials: true,
  origin: [
    'http://147.182.185.158:3002',
    'https://www.manzil.bh',
    'https://manzil.bh',
    process.env.ORIGIN1 || 'http://localhost:3000',
    process.env.ORIGIN2 || 'http://localhost:3001',
    process.env.ORIGIN3 || 'http://192.168.100.147:3001',
    process.env.ORIGIN4 || 'http://147.182.185.158:3002',
  ],
}));

app.use(express.json());
app.use(cookieParser());

app.use('/coordinates', coordinatesRoutes);
app.use('/parcelData', parcelRoutes);
app.use('/predict', predictRoutes);
app.use('/valuation', valuationRoutes);
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/property-notes', propertyNotesRoutes);
app.use('/firm-properties', firmPropertiesRouter);
app.use('/propertyFilters', propertyFiltersRoutes);

// Firm-related calls
app.use('/firmSpecificData', firmSpecificDataRoutes);
app.use('/apartment', apartmentRoutes);
app.use('/house', houseRoutes)

app.use('/marketplace/residential', residentialMarketplaceRoutes);

// Marketplace-related calls
app.use('/land', listedLandRoutes);
app.use('/marketplace/apartments', apartmentMarketplaceRoutes)
app.use('/marketplace/houses', housesMarketplaceRoutes)

app.listen(Number(config.port), '0.0.0.0', () => {
  console.log(`Server running on port ${config.port}`);
});
