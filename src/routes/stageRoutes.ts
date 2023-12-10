import { stageSchema } from "../schemas";
import { validate } from "../middleware/validate";
import { validateAndAuthorizeToken } from "../middleware/jwt";
import {
  createStageHandler,
  getAllStageFromProjectHandler,
  updateStageHandler,
  deleteStageHandler,
} from "../controllers";

import express from "express";

const stageRouter = express.Router();

stageRouter.post(
  "/create",
  // validate(stageSchema),
  validateAndAuthorizeToken,
  createStageHandler
);

stageRouter.get("/get/:id", getAllStageFromProjectHandler);

stageRouter.put(
  "/update/:stageId",
  // validate(stageSchema),
  updateStageHandler
);

stageRouter.delete("/delete/:stageId", deleteStageHandler);

export default stageRouter;
