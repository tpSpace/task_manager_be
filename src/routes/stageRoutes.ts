import { stageSchema } from '../schemas';
import { validate } from '../middleware/validate';
import { validateAndAuthorizeToken } from '../middleware/jwt';
import {
  createStageHandler,
  getAllStageFromProjectHandler,
  updateStageHandler,
  deleteStageHandler,
} from '../controllers';

import express from 'express';

const stageRouter = express.Router();

stageRouter.post(
  '/create/:projectId',
  validate(stageSchema),
  validateAndAuthorizeToken,
  createStageHandler,
);

stageRouter.get(
  '/getProject/:projectId',
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
