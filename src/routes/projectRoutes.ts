import express from 'express';
import { validate } from "../middleware/validate";
import { projectSchema } from "../schemas/projectSchema";
import { validateAndAuthorizeToken } from '../middleware/jwt';
import { createProjectHandler } from '../controllers/projectController';

const router = express.Router();

// POST /projects
router.post(
  '/create', 
  validate(projectSchema),
  validateAndAuthorizeToken,
  createProjectHandler
);

export default router;
