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
  '/get/project/:projectId',
  validateAndAuthorizeToken,
  getTagFromProjectHandler,
);

tagRouter.put(
  '/update/:tagId',
  validate(TagSchema),
  validateAndAuthorizeToken, 
  updateTagHandler
);

tagRouter.delete('/delete/:tagId', validateAndAuthorizeToken, deleteTagHandler);

export default tagRouter;
