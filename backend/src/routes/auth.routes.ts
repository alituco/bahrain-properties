// auth.routes.ts
import { Router } from 'express';
import { login, verifyOTP, register, verifyRegisterOTP, resendOTP, logout,  } from '../controllers/auth.controller';

const router = Router();

// Step 1: email, password -> send OTP
router.post('/login', login);

// Step 2: user_id, otp -> verify, issue JWT
router.post('/verify-otp', verifyOTP);

router.post('/register', register);

router.post('/register', register);

router.post('/resend-otp', resendOTP);

router.post('/verify-register-otp', verifyRegisterOTP);

router.post('/logout', logout);

export default router;
