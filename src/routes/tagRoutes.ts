import express from 'express';
import {
  createTagHandler,
  getTagFromProjectHandler,
} from '../controllers/tagController';
import { validateAndAuthorizeToken } from '../middleware/jwt';
import { validate } from '../middleware/validate';
import { TagSchema } from '../schemas/tagSchema';

const tagRouter = express.Router();

tagRouter.post(
  '/create/:projectId',
  validate(TagSchema),
  validateAndAuthorizeToken,
  createTagHandler,
);

tagRouter.get(
  '/get/:projectId',
  validateAndAuthorizeToken,
  getTagFromProjectHandler,
);

export default tagRouter;
