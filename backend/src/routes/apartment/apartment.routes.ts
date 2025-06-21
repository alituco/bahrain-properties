import { Router } from 'express';
import {
  createApartmentProperty,
  deleteApartmentProperty,
  getApartmentProperty,
  updateApartmentProperty,
  getFirmApartmentProperties,
  getAmenityOptions,
} from '../../controllers/apartment/apartment.controller';
import { requireAuth } from '../../middleware/requireAuth';

const router = Router();

router.post   ('/',        requireAuth, createApartmentProperty);
router.get    ('/',        requireAuth, getFirmApartmentProperties);
router.get    ('/amenities', requireAuth, getAmenityOptions);

router.get    ('/:id',     requireAuth, getApartmentProperty);
router.patch  ('/:id',     requireAuth, updateApartmentProperty);
router.delete ('/:id',     requireAuth, deleteApartmentProperty);

export default router;
