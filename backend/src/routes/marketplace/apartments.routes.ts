import { Router } from 'express';
import {
  getListedApartments,
  getApartmentById,
} from '../../controllers/marketplace/listedApartments.controller';

const router = Router();

router.get('/',     getListedApartments);
router.get('/:id',  getApartmentById);

export default router;
