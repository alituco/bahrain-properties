import { Router } from "express";
import {
  login,
  verifyOTP,
  register,
  verifyRegisterOTP,
  resendRegisterOTP,
  logout,
} from "../controllers/auth.controller";

const router = Router();

/* ---------- login flow ---------- */
router.post("/login", login);          // step‑1: email+password → OTP
router.post("/verify-otp", verifyOTP); // step‑2: otp verification

/* ---------- registration flow ---- */
router.post("/register", register);                       // create pending token → OTP
router.post("/verify-register-otp", verifyRegisterOTP);   // finish registration
router.post("/resend-register-otp", resendRegisterOTP);   // resend while pending

/* ---------- session -------------- */
router.post("/logout", logout);

export default router;
