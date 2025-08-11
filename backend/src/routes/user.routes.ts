import { Router }  from 'express';
import multer      from 'multer';

import {
  getProfile,
  getUsersByFirm,
  deleteUser,
  updateFirmRegistrationCode,
  updateFirmLogo,              // ← NEW
  requestEmailChange,
  verifyEmailChangeOTP,
  changePassword,
} from '../controllers/user.controller';

import { requireAuth } from '../middleware/requireAuth';
import { ensureAdmin } from '../middleware/ensureAdmin';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

/* ---------- profile ------------------------------------------- */
router.get('/me', requireAuth, getProfile);

/* ---------- firm staff ---------------------------------------- */
router.get('/firms/:firmId/users', requireAuth, getUsersByFirm);

/* ---------- firm registration code (admin) -------------------- */
router.put(
  '/firms/:firmId/registration-code',
  requireAuth,
  ensureAdmin,
  updateFirmRegistrationCode
);

/* ---------- firm logo upload (admin) -------------------------- */
router.put(
  '/firms/:firmId/logo',
  requireAuth,
  ensureAdmin,
  upload.single('file'),        // expects field name "file"
  updateFirmLogo
);

/* ---------- email change -------------------------------------- */
router.post('/email-change/request', requireAuth, requestEmailChange);
router.post('/email-change/verify',  requireAuth, verifyEmailChangeOTP);

/* ---------- password ------------------------------------------ */
router.post('/change-password', requireAuth, changePassword);

/* ---------- delete user (admin) ------------------------------- */
router.delete(
  '/users/:userId',
  requireAuth,
  ensureAdmin,
  deleteUser
);

export default router;
