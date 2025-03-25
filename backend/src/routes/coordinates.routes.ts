import { Router } from 'express';
import { getCoordinates } from '../controllers/coordinates.controller';

const router = Router();

router.get('/', getCoordinates);

export default router;
