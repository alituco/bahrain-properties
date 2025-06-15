import { Router } from 'express';
import { getListedLand } from '../../controllers/marketplace/listedLands.controller';

const router = Router();

router.get('/', getListedLand);

export default router;
