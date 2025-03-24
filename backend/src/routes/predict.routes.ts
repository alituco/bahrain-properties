import { Router } from 'express';
import { predictParcel } from '../controllers/predict.controller';

const router = Router();

// POST /predict
router.post('/', async (req, res, next) => {
  try {
	await predictParcel(req, res);
  } catch (error) {
	next(error);
  }
});

export default router;
