import { Router } from 'express';
import { getCoordinates } from '../controllers/coordinates.controller';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

router.get("/", requireAuth, getCoordinates);

export default router;
