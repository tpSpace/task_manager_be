import express from 'express';
import { validate } from '../middleware/validate';
import { projectSchema } from '../schemas/projectSchema';
import { validateAndAuthorizeToken } from '../middleware/jwt';
import {
  createProjectHandler,
  getAllProjectHandler,
  getSingleProjectHandler,
  updateTitleProjectHandler,
  deleteProjectHandler,
  addMemberHandler,
  setAdminHandler,
} from '../controllers/projectController';

const projectRouter = express.Router();

projectRouter.post(
  '/create',
  validate(projectSchema),
  validateAndAuthorizeToken,
  createProjectHandler,
);

// Get all projects of a user
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

projectRouter.post(
  '/addMember/:projectId',
  validateAndAuthorizeToken,
  addMemberHandler,
);
projectRouter.post(
  '/setAdmin/:projectId',
  validateAndAuthorizeToken,
  setAdminHandler,
);

export default projectRouter;
