import { Router } from 'express';
import {
  getProfile,
  getUsersByFirm,
  deleteUser,
  updateFirmRegistrationCode,
  requestEmailChange,
  verifyEmailChangeOTP,
  changePassword,
} from '../controllers/user.controller';

import { requireAuth }  from '../middleware/requireAuth';
import { ensureAdmin }  from '../middleware/ensureAdmin';

const router = Router();

router.get('/me', requireAuth, getProfile);
router.get('/firms/:firmId/users', requireAuth, getUsersByFirm);

router.put(
  '/firms/:firmId/registration-code',
  requireAuth,
  ensureAdmin,
  updateFirmRegistrationCode
);

router.post('/email-change/request', requireAuth, requestEmailChange);
router.post('/email-change/verify',  requireAuth, verifyEmailChangeOTP);
router.post('/change-password',      requireAuth, changePassword);

router.delete(
  '/users/:userId',
  requireAuth,
  ensureAdmin,
  deleteUser
);

export default router;
