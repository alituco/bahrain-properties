import { Router } from "express";
import {
  getMedianAskingPricePerSqFt,
  getMedianSoldPricePerSqFt,
  getPipelineCounts,
} from "../controllers/firmSpecificData.controller";
import { requireAuth } from "../middleware/requireAuth";

const r = Router();

r.get("/firm/:firmId/median-asking-psqft", requireAuth, getMedianAskingPricePerSqFt );
r.get("/firm/:firmId/median-sold-psqft", requireAuth, getMedianSoldPricePerSqFt);
r.get("/firm/:firmId/pipeline-counts", requireAuth, getPipelineCounts);

export default r;
