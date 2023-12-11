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
import ApiResponseBuilder, { HttpStatusCode } from "./abstraction";

export const createStageHandler = async (req: Request, res: Response) => {
  try {
    const stage: Stage = req.body;
    const projectId: string = req.params.id;

    // Assuming findProjectById function is available in your code
    const project = await findProjectById(projectId);

    if (!project) {
      const response = ApiResponseBuilder.buildErrorResponse<Stage>(
        HttpStatusCode.NOTFOUND,
        "project not found"
      );
      return res.status(response.statusCode!).json(response);
    }

    const newStageId = await createStage(stage, projectId);
    const response =
      ApiResponseBuilder.buildSuccessResponse<string>(newStageId);
    return res.status(HttpStatusCode.SUCCESS).json(response);
  } catch (error) {
    console.error("Error creating stage:", error);
    const response = ApiResponseBuilder.buildErrorResponse<string>(
      HttpStatusCode.SERVERERROR,
      "failed to create stage"
    );
    return res.status(HttpStatusCode.SERVERERROR).json(response);
  }
};

export const getAllStageFromProjectHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const projectId = req.params.id;

    // Assuming findProjectById function is available in your code
    const project = await findProjectById(projectId);

    if (!project) {
      const response = ApiResponseBuilder.buildErrorResponse<Stage>(
        HttpStatusCode.NOTFOUND,
        "project not found"
      );
      return res.status(response.statusCode!).json(response);
    }

    const stages = await findAllStageFromProjectId(projectId);

    return res.status(HttpStatusCode.SUCCESS).json({
      status: "success",
      stages,
    });
  } catch (error) {
    console.error("Error getting stages:", error);
    const response = ApiResponseBuilder.buildErrorResponse<Stage[]>(
      HttpStatusCode.SERVERERROR,
      "failed to get stages"
    );
    return res.status(response.statusCode!).json(response);
  }
};

export const updateStageHandler = async (req: Request, res: Response) => {
  try {
    const stageId = req.params.stageId;
    const updatedStage: Stage = req.body;

    const existingStage = await findStageById(stageId);

    if (!existingStage) {
      const response = ApiResponseBuilder.buildErrorResponse<Stage>(
        HttpStatusCode.NOTFOUND,
        "stage not found"
      );
      return res.status(response.statusCode!).json(response);
    }

    const updated = await updateStage(stageId, updatedStage);

    return res.status(HttpStatusCode.SUCCESS).json({
      status: "success",
      updated,
    });
  } catch (error) {
    console.error("Error updating stage:", error);
    const response = ApiResponseBuilder.buildErrorResponse<Stage>(
      HttpStatusCode.SERVERERROR,
      "failed to update stage"
    );
    return res.status(response.statusCode!).json(response);
  }
};

export const deleteStageHandler = async (req: Request, res: Response) => {
  try {
    const stageId = req.params.stageId;

    const existingStage = await findStageById(stageId);

    if (!existingStage) {
      const response = ApiResponseBuilder.buildErrorResponse<Stage>(
        HttpStatusCode.NOTFOUND,
        "stage not found"
      );
      return res.status(response.statusCode!).json(response);
    }

    const deletedStage = await deleteStage(stageId);

    return res.status(HttpStatusCode.SUCCESS).json({
      status: "success",
      deletedStage,
    });
  } catch (error) {
    console.error("Error deleting stage:", error);
    const response = ApiResponseBuilder.buildErrorResponse<Stage>(
      HttpStatusCode.SERVERERROR,
      "failed to delete stage"
    );
    return res.status(response.statusCode!).json(response);
  }
};
