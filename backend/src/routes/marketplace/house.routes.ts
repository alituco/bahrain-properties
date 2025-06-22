import { Router } from 'express';
import { 
    getListedHouses,
    getHouseById
} from '../../controllers/marketplace/listedHouses.controller';

const router = Router();

router.get('/house',     getListedHouses);
router.get('/house/:id', getHouseById);

export default router;