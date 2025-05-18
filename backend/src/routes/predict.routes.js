"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const predict_controller_1 = require("../controllers/predict.controller");
const router = (0, express_1.Router)();
// POST /predict
router.post('/', async (req, res, next) => {
    try {
        await (0, predict_controller_1.predictParcel)(req, res);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
