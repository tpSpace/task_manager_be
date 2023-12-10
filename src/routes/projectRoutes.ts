import express from "express";
import { validate } from "../middleware/validate";
import { projectSchema } from "../schemas";
import { validateAndAuthorizeToken } from "../middleware/jwt";
import {
  createProjectHandler,
  getAllProjectHandler,
  getSingleProjectHandler,
  getAllProjectWithIdHandler,
} from "../controllers";

const projectRouter = express.Router();

projectRouter.post(
  "/create",
  validate(projectSchema),
  validateAndAuthorizeToken,
  createProjectHandler
);

// Will be used when front end is ready with jwt implementation
projectRouter.get("/get", validateAndAuthorizeToken, getAllProjectHandler);

// Will be used when front end is ready with jwt implementation
projectRouter.get(
  "/get/:id",
  validateAndAuthorizeToken,
  getSingleProjectHandler
);

// To be removed
projectRouter.get("/get/:userId", getAllProjectWithIdHandler);

export default projectRouter;
