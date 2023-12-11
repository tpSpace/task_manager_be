import { Request, Response } from "express";
import { Stage } from "../models";
import {
  createStage,
  findAllStageFromProjectId,
  findStageById,
  updateStage,
  deleteStage,
  findProjectById,
} from "../services";
import FastResponse, { HttpStatusCode } from "./abstraction";

export const createStageHandler = async (req: Request, res: Response) => {
  const fr = new FastResponse(res, "Stage");
  try {
    const stage: Stage = req.body;
    const projectId: string = req.params.id;
    const project = await findProjectById(projectId);
    if (!project) {
      return fr.buildError(HttpStatusCode.NOTFOUND);
    }
    const newStageId = await createStage(stage, projectId);
    return fr.buildSuccess(newStageId);
  } catch (error) {
    console.error("Error creating stage:", error);
    return fr.buildError(HttpStatusCode.SERVERERROR);
  }
};

export const getAllStageFromProjectHandler = async (
  req: Request,
  res: Response
) => {
  const fr = new FastResponse(res, "Stage");
  try {
    const projectId = req.params.id;

    // Assuming findProjectById function is available in your code
    const project = await findProjectById(projectId);

    if (!project) {
      return fr.buildError(HttpStatusCode.NOTFOUND);
    }
    const stages = await findAllStageFromProjectId(projectId);
    return fr.buildSuccess(stages);
  } catch (error) {
    console.error("Error getting stages:", error);
    return fr.buildError(HttpStatusCode.SERVERERROR);
  }
};

export const updateStageHandler = async (req: Request, res: Response) => {
  const fr = new FastResponse(res, "Stage");
  try {
    const stageId = req.params.stageId;
    const updatedStage: Stage = req.body;

    const existingStage = await findStageById(stageId);

    if (!existingStage) {
      return fr.buildError(HttpStatusCode.NOTFOUND);
    }

    const updated = await updateStage(stageId, updatedStage);

    return fr.buildSuccess(updated);
  } catch (error) {
    console.error("Error updating stage:", error);
    return fr.buildError(HttpStatusCode.SERVERERROR);
  }
};

export const deleteStageHandler = async (req: Request, res: Response) => {
  const fr = new FastResponse(res, "Stage");
  try {
    const stageId = req.params.stageId;
    const existingStage = await findStageById(stageId);
    if (!existingStage) {
      return fr.buildError(HttpStatusCode.NOTFOUND);
    }
    const deletedStage = await deleteStage(stageId);
    return fr.buildSuccess(deletedStage);
  } catch (error) {
    console.error("Error deleting stage:", error);
    return fr.buildError(HttpStatusCode.SERVERERROR);
  }
};
