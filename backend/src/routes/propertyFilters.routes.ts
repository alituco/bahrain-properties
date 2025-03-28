import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import {
  getDistinctAreas,
  getDistinctBlocks,
  getDistinctGovernorates
} from "../controllers/propertyFilters.controller";

const router = Router();


// returns all distinct areas in properties
router.get("/areas", requireAuth, getDistinctAreas);

//returns all distinct blocks in properties
router.get("/blocks", requireAuth, getDistinctBlocks);  

router.get("/governorates", requireAuth, getDistinctGovernorates);

export default router;