import { Router } from "express";
import {
  login,
  verifyOTP,
  register,
  verifyRegisterOTP,
  resendRegisterOTP,
  logout,
  resendLoginOTP,
} from "../controllers/auth.controller";

const router = Router();

router.post("/login", login);          
router.post("/resend-login-otp", resendLoginOTP)
router.post("/verify-otp", verifyOTP); 


router.post("/register", register);                       
router.post("/verify-register-otp", verifyRegisterOTP);   
router.post("/resend-register-otp", resendRegisterOTP);  

router.post("/logout", logout);

export default router;
