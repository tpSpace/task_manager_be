import { TagSchema } from "../schemas/tagSchema";
import { validate } from "../middleware/validate";
import {createTagHandler, getTagFromProjectHandler} from "../controllers/tagController";
import express from 'express';

const router = express.Router();

router.post(
  '/create/:id',
  validate(TagSchema),
  createTagHandler,
);

router.get(
  '/get/:id',
  getTagFromProjectHandler
);

export default router;

