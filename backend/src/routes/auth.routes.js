"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// auth.routes.ts
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
// Step 1: email, password -> send OTP
router.post('/login', auth_controller_1.login);
// Step 2: user_id, otp -> verify, issue JWT
router.post('/verify-otp', auth_controller_1.verifyOTP);
router.post('/register', auth_controller_1.register);
router.post('/register', auth_controller_1.register);
router.post('/resend-otp', auth_controller_1.resendOTP);
router.post('/verify-register-otp', auth_controller_1.verifyRegisterOTP);
router.post('/logout', auth_controller_1.logout);
exports.default = router;
