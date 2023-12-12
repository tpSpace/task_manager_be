import express from 'express';
import { validate } from '../middleware/validate';
import { projectSchema } from '../schemas';
import { validateAndAuthorizeToken } from '../middleware/jwt';
import {
  createProjectHandler,
  getAllProjectHandler,
  getSingleProjectHandler,
  updateTitleProjectHandler,
  deleteProjectHandler,
} from '../controllers';

const projectRouter = express.Router();

projectRouter.post(
  '/create',
  validate(projectSchema),
  validateAndAuthorizeToken,
  createProjectHandler,
);

projectRouter.get('/get', validateAndAuthorizeToken, getAllProjectHandler);

projectRouter.get(
  '/get/:projectId',
  validateAndAuthorizeToken,
  getSingleProjectHandler,
);

projectRouter.put(
  '/updateTitle/:projectId',
  validateAndAuthorizeToken,
  updateTitleProjectHandler,
);

projectRouter.delete(
  '/delete/:projectId',
  validateAndAuthorizeToken,
  deleteProjectHandler,
);

export default projectRouter;
