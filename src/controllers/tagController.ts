import { Request, Response } from 'express';
import { Tag } from '../models/tag';
import {
  createTag,
  findTagById,
  getAllTagFromProjectId,
  updateTag,
  deleteTag,
} from '../services/tagService';
import {
  findProjectById,
  findProjectByTagId,
} from '../services/projectService';
import { StatusCode } from './abstraction';
import { returnUserIdFromToken } from '../middleware/jwt';

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

export const updateTagHandler = async (req: Request, res: Response) => {
  try {
    const userId = returnUserIdFromToken(req);
    const tagId = req.params.tagId;
    const tag = await findTagById(tagId);
    const project = await findProjectByTagId(tagId);

    if (!project) {
      return res.status(StatusCode.NOTFOUND).json({
        status: 'not found',
        error: 'project not found',
      });
    } else if (!tag) {
      return res.status(StatusCode.NOTFOUND).json({
        status: 'not found',
        error: 'tag not found',
      });
    } else if (userId !== project.adminId) {
      return res.status(401).json({
        status: 'unauthorized',
        error: 'user not authorized',
      });
    }
    if (project.tagIds.includes(tagId)) {
      await updateTag(tagId, req.body);
      return res.status(StatusCode.SUCCESS).json({
        status: 'success',
      });
    }
  } catch (error) {
    console.error('Error getting tag:', error);
    return res.status(StatusCode.SERVERERROR).json({
      status: 'server error',
      error: 'failed to get tag',
    });
  }
};

export const deleteTagHandler = async (req: Request, res: Response) => {
  try {
    const userId = returnUserIdFromToken(req);
    const tagId = req.params.tagId;
    const tag = await findTagById(tagId);
    const project = await findProjectByTagId(tagId);

    if (!project) {
      return res.status(StatusCode.NOTFOUND).json({
        status: 'not found',
        error: 'project not found',
      });
    } else if (!tag) {
      return res.status(StatusCode.NOTFOUND).json({
        status: 'not found',
        error: 'tag not found',
      });
    } else if (userId !== project.adminId) {
      return res.status(401).json({
        status: 'unauthorized',
        error: 'user not authorized',
      });
    }
    if (project.tagIds.includes(tagId)) {
      await deleteTag(tagId);
      return res.status(StatusCode.SUCCESS).json({
        status: 'success',
      });
    }
  } catch (error) {
    console.error('Error getting tag:', error);
    return res.status(StatusCode.SERVERERROR).json({
      status: 'server error',
      error: 'failed to get tag',
    });
  }
};
