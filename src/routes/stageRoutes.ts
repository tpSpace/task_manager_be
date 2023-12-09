import { StageSchema } from "../schemas";
import { validate } from "../middleware/validate";
import {
  createStageHandler,
  getAllStageFromProjectHandler,
  updateStageHandler,
  deleteStageHandler,
} from "../controllers/stageController";
import express from "express";

const router = express.Router();

router.post("/create/:id", validate(StageSchema), createStageHandler);

router.get("/get/:id", getAllStageFromProjectHandler);

router.put("/update/:stageId", validate(StageSchema), updateStageHandler);

router.delete("/delete/:stageId", deleteStageHandler);

export default router;
