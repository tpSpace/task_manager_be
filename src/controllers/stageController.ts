import { Request, Response } from 'express';
import { Stage } from '../models/stage';
import {
  createStage,
  findAllStageFromProjectId,
  findStageById,
  updateStage,
  deleteStage,
} from '../services/stageService';
import { findProjectById } from '../services/projectService';
import { StatusCode } from './abstraction';

export const createStageHandler = async (req: Request, res: Response) => {
  try {
    const stage: Stage = req.body;
    const projectId: string = req.params.projectId;

    const project = await findProjectById(projectId);

    if (!project) {
      return res.status(StatusCode.NOTFOUND).json({
        status: 'not found',
        error: 'project not found',
      });
    }

    const newStageId = await createStage(stage, projectId);

    return res.status(StatusCode.SUCCESS).json({
      status: 'success',
      stageId: newStageId,
    });
  } catch (error) {
    console.error('Error creating stage:', error);
    return res.status(StatusCode.SERVERERROR).json({
      status: 'server error',
      error: 'failed to create stage',
    });
  }
};

export const getAllStageFromProjectHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const projectId = req.params.projectId;
    const project = await findProjectById(projectId);

    if (!project) {
      return res.status(StatusCode.NOTFOUND).json({
        status: 'not found',
        error: 'project not found',
      });
    }

    const stages = await findAllStageFromProjectId(projectId);

    return res.status(StatusCode.SUCCESS).json({
      status: 'success',
      stages,
    });
  } catch (error) {
    console.error('Error getting stages:', error);
    return res.status(StatusCode.SERVERERROR).json({
      status: 'server error',
      error: 'failed to get stage',
    });
  }
};

export const updateStageHandler = async (req: Request, res: Response) => {
  try {
    const stageId = req.params.stageId;
    const updatedTitle: Stage = req.body;

    const existingStage = await findStageById(stageId);

    if (!existingStage) {
      return res.status(StatusCode.NOTFOUND).json({
        status: 'not found',
        error: 'stage not found',
      });
    }

    const updatedStage = await updateStage(stageId, updatedTitle);

    return res.status(StatusCode.SUCCESS).json({
      status: 'success',
    });
  } catch (error) {
    console.error('Error updating stage:', error);
    return res.status(StatusCode.SERVERERROR).json({
      status: 'server error',
      error: 'failed to edit stage',
    });
  }
};

export const deleteStageHandler = async (req: Request, res: Response) => {
  try {
    const stageId = req.params.stageId;

    const existingStage = await findStageById(stageId);

    if (!existingStage) {
      return res.status(StatusCode.NOTFOUND).json({
        status: 'not found',
        error: 'stage not found',
      });
    }

    await deleteStage(stageId);

    return res.status(StatusCode.SUCCESS).json({
      status: 'success',
    });
  } catch (error) {
    console.error('Error deleting stage:', error);
    return res.status(StatusCode.SERVERERROR).json({
      status: 'server error',
      error: 'failed to delete stage',
    });
  }
};
