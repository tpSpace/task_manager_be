import express from 'express';
import { validate } from "../middleware/validate";
import { projectSchema } from "../schemas/projectSchema";
import { validateAndAuthorizeToken } from '../middleware/jwt';
import { 
  createProjectHandler, 
  getAllProjectHandler,
  getSingleProjectHandler } from '../controllers/projectController';

const router = express.Router();

router.post(
  '/create', 
  validate(projectSchema),
  validateAndAuthorizeToken,
  createProjectHandler
);

router.get(
  '/get',
  validateAndAuthorizeToken,
  getAllProjectHandler
)

router.get(
  '/get/:id',
  validateAndAuthorizeToken,
  getSingleProjectHandler
)

export default router;
