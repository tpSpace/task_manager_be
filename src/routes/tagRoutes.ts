import { createTagHandler, getTagFromProjectHandler } from "../controllers";
import express from "express";
import { validateAndAuthorizeToken } from "../middleware/jwt";
import { validate } from "../middleware/validate";
import { TagSchema } from "../schemas";

const tagRouter = express.Router();

tagRouter.post(
  "/create/:projectId",
  validate(TagSchema), 
  validateAndAuthorizeToken, 
  createTagHandler
);

tagRouter.get(
  "/get/:projectId", 
  validateAndAuthorizeToken, 
  getTagFromProjectHandler
);

export default tagRouter;
