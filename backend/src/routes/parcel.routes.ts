import { Router } from 'express';
import { getParcelData, ensureParcel, getParcelGeoData, getParcelsAround } from '../controllers/parcel.controller';

const router = Router();

// GET /parcelData/:parcelNo
router.get('/:parcelNo', (req, res, next) => {
  getParcelData(req, res).catch(next);
});

// GET /parcelData/ensure/:parcelNo (if you want a sub-route for ensuring)
router.get('/ensure/:parcelNo', (req, res, next) => {
    ensureParcel(req, res).catch(next);
});

router.get('/geo/:parcelNo', (req, res, next) => {
  getParcelGeoData(req, res).catch(next);
});

router.get("/around/:parcelNo", (req, res, next) => {
  getParcelsAround(req, res).catch(next);
});

export default router;
