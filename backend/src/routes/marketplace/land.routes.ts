import { Router } from 'express';
import { 
    getListedLand,
    getLandById
} from '../../controllers/marketplace/listedLands.controller';

const router = Router();

router.get('/', getListedLand);
router.get('/:id', getLandById);


export default router;
