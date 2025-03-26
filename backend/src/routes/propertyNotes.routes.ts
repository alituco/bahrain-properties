import { Router } from 'express';
import {
  addNote,
  getNotesByFirm,
  deleteNote,
} from '../controllers/propertyNotes.controller';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();


router.post('/', requireAuth, addNote);
router.get('/', requireAuth, getNotesByFirm);
router.delete('/:noteId', requireAuth, deleteNote);

export default router;
