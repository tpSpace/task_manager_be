import express from 'express';
import {
  createTagHandler,
  getTagFromProjectHandler,
  updateTagHandler,
  deleteTagHandler,
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

tagRouter.put(
  '/update/:projectId/:tagId',
  validateAndAuthorizeToken,
  updateTagHandler,
);

tagRouter.delete(
  '/delete/:projectId/:tagId',
  validateAndAuthorizeToken,
  deleteTagHandler,
);

export default tagRouter;
