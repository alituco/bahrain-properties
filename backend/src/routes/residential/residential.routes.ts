// /residential

import { Router } from "express";
import {
  createResidentialProperty,
  getFirmResidentialProperties,
  getAmenityOptions,
} from "../../controllers/residential/residential.controller";
import { requireAuth } from "../../middleware/requireAuth";

const router = Router();

router.post("/", requireAuth, createResidentialProperty);
router.get("/", requireAuth, getFirmResidentialProperties);
router.get("/amenities", requireAuth, getAmenityOptions);


export default router;
