import Router from 'express';
import {
    getFirms,
    getFirmPropertiesPublic
} from '../../../controllers/marketplace/firms/firms.controller';


const router = Router();

router.get('/', getFirms);
router.get('/:firmId/properties', getFirmPropertiesPublic);

export default router;