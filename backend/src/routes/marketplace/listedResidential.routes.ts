import { Router } from 'express';
import { 
    getListedResidential, 
    getResidentialById } from '../../controllers/marketplace/listedResidential.controller';

const router = Router();

router.get('/',     getListedResidential);
router.get('/:id',  getResidentialById);

export default router;
