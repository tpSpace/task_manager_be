import express from "express";
import { validate } from "../middleware/validate";
import { projectSchema } from "../schemas";
import { validateAndAuthorizeToken } from "../middleware/jwt";
import {
  createProjectHandler,
  getAllProjectHandler,
  getSingleProjectHandler,
} from "../controllers";

const projectRouter = express.Router();

projectRouter.post(
  "/create",
  validate(projectSchema),
  validateAndAuthorizeToken,
  createProjectHandler
);

projectRouter.get("/get", validateAndAuthorizeToken, getAllProjectHandler);

// Will be used when front end is ready with jwt implementation
projectRouter.get(
  "/get/:id",
  validateAndAuthorizeToken,
  getSingleProjectHandler
);
export default projectRouter;
