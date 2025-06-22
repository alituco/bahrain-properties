import { Router } from 'express';
import {
  createHouseProperty,
  deleteHouseProperty,
  getFirmHouseProperties,
  getHouseAmenityOptions,
  getHouseProperty,
  updateHouseProperty
} from '../../controllers/house/house.controller';
import { requireAuth } from '../../middleware/requireAuth';

const router = Router();

router.post   ('/',        requireAuth, createHouseProperty);
router.get    ('/',        requireAuth, getFirmHouseProperties);
router.get    ('/amenities',requireAuth, getHouseAmenityOptions);

router.get    ('/:id',     requireAuth, getHouseProperty);
router.patch  ('/:id',     requireAuth, updateHouseProperty);
router.delete ('/:id',     requireAuth, deleteHouseProperty);

export default router;
