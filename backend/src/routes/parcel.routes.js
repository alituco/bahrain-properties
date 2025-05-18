"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const parcel_controller_1 = require("../controllers/parcel.controller");
const router = (0, express_1.Router)();
// GET /parcelData/:parcelNo
router.get('/:parcelNo', (req, res, next) => {
    (0, parcel_controller_1.getParcelData)(req, res).catch(next);
});
// GET /parcelData/ensure/:parcelNo (if you want a sub-route for ensuring)
router.get('/ensure/:parcelNo', (req, res, next) => {
    (0, parcel_controller_1.ensureParcel)(req, res).catch(next);
});
exports.default = router;
