import { Request, Response } from 'express';
import { Tag } from '../models/tag';
import {
  createTag,
  getAllTagFromProjectId,
} from '../services/tagService';
import { findProjectById } from '../services/projectService';
import { StatusCode } from './abstraction';

export const createTagHandler = async (req: Request, res: Response) => {
  try {
    const tag: Tag = req.body;
    const projectId: string = req.params.projectId;
    const project = await findProjectById(projectId);

    if (!project) {
      return res.status(StatusCode.NOTFOUND).json({
        status: 'not found',
        error: 'project not found',
      });
    }

    const newTagId = await createTag(tag, projectId);

    return res.status(StatusCode.SUCCESS).json({
      status: 'success',
      tagId: newTagId,
    });
  } catch (error) {
    console.error('Error creating tag:', error);
    return res.status(StatusCode.SERVERERROR).json({
      status: 'server error',
      error: 'failed to create tag',
    });
  }
};

export const getTagFromProjectHandler = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.projectId;
    const project = await findProjectById(projectId);

    if (!project) {
      return res.status(StatusCode.NOTFOUND).json({
        status: 'not found',
        error: 'project not found',
      });
    }

    const tag = await getAllTagFromProjectId(projectId);

    return res.status(StatusCode.SUCCESS).json({
      status: 'success',
      tag,
    });
  } catch (error) {
    console.error('Error getting tag:', error);
    return res.status(StatusCode.SERVERERROR).json({
      status: 'server error',
      error: 'failed to get tag',
    });
  }
};
