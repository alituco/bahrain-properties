"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.predictParcel = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../config/env");
const predictParcel = async (req, res) => {
    try {
        const inputData = req.body;
        const flaskPredictUrl = `${env_1.config.flaskBaseUrl}/predict`;
        const flaskResponse = await axios_1.default.post(flaskPredictUrl, inputData, { timeout: 10000 });
        return res.json({
            success: true,
            ...flaskResponse.data,
        });
    }
    catch (error) {
        console.error('Error in /predict:', error);
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};
exports.predictParcel = predictParcel;
