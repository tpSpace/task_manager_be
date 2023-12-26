import { stageSchema } from '../schemas/stageSchema';
import { validate } from '../middleware/validate';
import { validateAndAuthorizeToken } from '../middleware/jwt';
import {
  createStageHandler,
  getAllStageFromProjectHandler,
  updateStageHandler,
  deleteStageHandler,
  getStageByStageId,
} from '../controllers/stageController';

import express from 'express';

const stageRouter = express.Router();

stageRouter.post(
  '/create/:projectId',
  validate(stageSchema),
  validateAndAuthorizeToken,
  createStageHandler,
);

stageRouter.get(
  '/get/stage/:stageId',
  validateAndAuthorizeToken,
  getStageByStageId,
);

stageRouter.get(
  '/get/project/:projectId',
  validateAndAuthorizeToken,
  getAllStageFromProjectHandler,
);

stageRouter.put(
  '/updateTitle/:stageId',
  validateAndAuthorizeToken,
  updateStageHandler,
);

stageRouter.delete(
  '/delete/:stageId',
  validateAndAuthorizeToken,
  deleteStageHandler,
);

export default stageRouter;
