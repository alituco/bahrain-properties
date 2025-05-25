import { Router } from 'express';
import FirmSpecificDataController from '../controllers/firmSpecificData.controller';

const firmSpecificDataRouter = Router();

firmSpecificDataRouter.get('/firm/:firmId/median-asking-psqft',FirmSpecificDataController.medianAskingPricePerSqFt);
firmSpecificDataRouter.get('/firm/:firmId/median-sold-psqft',FirmSpecificDataController.medianSoldPricePerSqFt);
firmSpecificDataRouter.get( '/firm/:firmId/pipeline-counts', FirmSpecificDataController.pipelineCounts);

export default firmSpecificDataRouter;
