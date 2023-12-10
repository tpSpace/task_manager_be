import express from "express";
import { validate } from "../middleware/validate";
import { projectSchema } from "../schemas/projectSchema";
import { validateAndAuthorizeToken } from "../middleware/jwt";
import {
  createProjectHandler,
  getAllProjectHandler,
  getSingleProjectHandler,
  deleteProjectHandler,
  updateProjectHandler
} from "../controllers/projectController";

const router = express.Router();

router.post(
  "/create",
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
  '/get/:projectId',
  validateAndAuthorizeToken,
  getSingleProjectHandler
)

router.put(
    '/update/:projectId',
    validateAndAuthorizeToken,
    updateProjectHandler

)

router.delete(
    '/delete/:projectId',
    validateAndAuthorizeToken,
    deleteProjectHandler
)

export default router;
