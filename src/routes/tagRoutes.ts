import {createTagHandler, 
  getTagFromProjectHandler
} from "../controllers/tagController";
import express from 'express';
import { validateAndAuthorizeToken } from "../middleware/jwt";

const router = express.Router();

router.post(
  '/create/:id',
  validateAndAuthorizeToken,
  createTagHandler,
);

router.get(
  '/get/:id',
  validateAndAuthorizeToken,
  getTagFromProjectHandler
);

export default router;

