import { Router } from 'express';
import { addValuation } from '../controllers/valuation.controller';

const router = Router();

router.post('/addValuation', addValuation);

export default router;
