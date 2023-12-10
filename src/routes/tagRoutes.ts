import { TagSchema } from "../schemas";
import { validate } from "../middleware/validate";
import {
  createTagHandler,
  getTagFromProjectHandler,
} from "../controllers/tagController";
import express from "express";

const tagRouter = express.Router();

tagRouter.post(
  "/create/:id",
  // validate(TagSchema),
  createTagHandler
);

tagRouter.get("/get/:id", getTagFromProjectHandler);

export default tagRouter;
