"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../config/db");
const env_1 = require("../config/env");
const getProfile = async (req, res) => {
    try {
        // Retrieve token from HTTP-only cookie or Authorization header
        const token = req.cookies?.token ||
            (req.headers.authorization && req.headers.authorization.split(" ")[1]);
        if (!token) {
            res.status(401).json({ success: false, message: "Not authenticated" });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, env_1.config.jwtSecret);
        const userResult = await db_1.pool.query(`SELECT user_id, first_name, last_name, email, real_estate_firm FROM users WHERE user_id = $1`, [decoded.user_id]);
        if (userResult.rows.length === 0) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        res.json({ success: true, user: userResult.rows[0] });
        return;
    }
    catch (error) {
        console.error("Error in getProfile:", error);
        res.status(500).json({ success: false, message: "Server error" });
        return;
    }
};
exports.getProfile = getProfile;
