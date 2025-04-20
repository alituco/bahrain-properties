import { Router } from 'express';
import { getProfile, deleteUser, getUsersByFirm  } from '../controllers/user.controller';
import { requireAuth } from '../middleware/requireAuth';
import { ensureAdmin } from '../middleware/ensureAdmin';

const router = Router();

router.get('/me', getProfile);

router.get('/firms/:firmId/users',requireAuth, getUsersByFirm, );

router.delete('/users/:userId', requireAuth, ensureAdmin, deleteUser);

export default router;
