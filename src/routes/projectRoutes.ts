import express from "express";
import { validate } from "../middleware/validate";
import { projectSchema } from "../schemas/projectSchema";
import { validateAndAuthorizeToken } from "../middleware/jwt";
import {
  createProjectHandler,
  getAllProjectHandler,
  getSingleProjectHandler,
  getAllProjectWithIdHandler,
} from "../controllers/projectController";

const router = express.Router();

router.post(
  "/create",
  validate(projectSchema),
  validateAndAuthorizeToken,
  createProjectHandler
);

// Will be used when front end is ready with jwt implementation
router.get(
  '/get',
  validateAndAuthorizeToken,
  getAllProjectHandler
)

// Will be used when front end is ready with jwt implementation
router.get(
  '/get/:id',
  validateAndAuthorizeToken,
  getSingleProjectHandler
)

// To be removed
router.get(
  "/get/:userId", 
  getAllProjectWithIdHandler
);

export default router;
