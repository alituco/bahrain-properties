import { Router } from 'express';
import { getListedLand } from '../controllers/land.controller';

const router = Router();

router.get('/',  getListedLand);          
export default router;
