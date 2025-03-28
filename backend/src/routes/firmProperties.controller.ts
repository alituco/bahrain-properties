import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import {
  createFirmProperty,
  getFirmProperties,
  getFirmPropertyByParcel,
  updateFirmProperty,
  deleteFirmProperty,
  getFirmPropertiesGeojson
} from "../controllers/firmProperties.controller";

const firmPropertiesRouter = Router();

// Create a new firm_properties record
firmPropertiesRouter.post("/", requireAuth, createFirmProperty);

// Get all firm_properties records for the user's firm (optionally filter by ?status=xxx)
firmPropertiesRouter.get("/", requireAuth, getFirmProperties);

firmPropertiesRouter.get("/geojson", requireAuth, getFirmPropertiesGeojson);

// Get a single firm property record
firmPropertiesRouter.get("/:parcelNo", requireAuth, getFirmPropertyByParcel);

// Update a firm property record (status, asking_price, sold_price, etc.)
firmPropertiesRouter.patch("/:id", requireAuth, updateFirmProperty);

// Delete a firm property record
firmPropertiesRouter.delete("/:id", requireAuth, deleteFirmProperty);

export default firmPropertiesRouter;
