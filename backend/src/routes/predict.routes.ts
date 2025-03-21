import { Router } from 'express';
import { predictParcel } from '../controllers/predict.controller';

const router = Router();

// POST /predict
router.post('/', predictParcel);

export default router;
