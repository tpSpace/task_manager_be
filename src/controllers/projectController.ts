import { Request, Response } from 'express';
import { Project } from '../models/project';
import {
  createProject,
  findAllProjectOfUserWithId,
  findProjectById,
  deleteProject,
  updateProject,
  addUserToProject,
  updateProjectAdmin,
} from '../services/projectService';
import { returnUserIdFromToken } from '../middleware/jwt';

export const createProjectHandler = async (req: Request, res: Response) => {
  try {
    const project: Project = req.body;
    project.adminId = returnUserIdFromToken(req);

    const newProjectId = await createProject(project);

    return res.status(200).json({
      status: 'success',
      projectId: newProjectId,
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return res.status(500).json({
      status: 'server error',
      error: 'failed to create project',
    });
  }
};

export const getAllProjectHandler = async (req: Request, res: Response) => {
  try {
    const userId: string = returnUserIdFromToken(req);
    const projects = await findAllProjectOfUserWithId(userId);

    return res.status(200).json({
      status: 'success',
      projects,
    });
  } catch (error) {
    console.error('Error getting projects:', error);
    return res.status(500).json({
      status: 'server error',
      error: 'failed to get projects',
    });
  }
};

export const getSingleProjectHandler = async (req: Request, res: Response) => {
  try {
    const userId: string = returnUserIdFromToken(req);
    const projectId = req.params.projectId;
    const project = await findProjectById(projectId);

    if (!project) {
      return res.status(404).json({
        status: 'not found',
        error: 'project not found',
      });
    }

    if (project.userIds.includes(userId)) {
      return res.status(200).json({
        status: 'success',
        project,
      });
    }
  } catch (error) {
    console.error('Error getting project:', error);
    return res.status(500).json({
      status: 'server error',
      error: 'failed to get project',
    });
  }
};

export const updateTitleProjectHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId: string = returnUserIdFromToken(req);
    const projectId = req.params.projectId;
    const project = await findProjectById(projectId);

    if (!project) {
      return res.status(404).json({
        status: 'not found',
        error: 'project not found',
      });
    }

    if (project.userIds.includes(userId)) {
      const updatedProject = await updateProject(projectId, req.body);
      return res.status(200).json({
        status: 'success',
        updatedProject,
      });
    } else {
      return res.status(500).json({
        status: 'server error',
        error: 'failed to get project',
      });
    }
  } catch (error) {
    console.error('Error updating project:', error);
    return res.status(500).json({
      status: 'server error',
      error: 'failed to update project',
    });
  }
};

export const deleteProjectHandler = async (req: Request, res: Response) => {
  try {
    const userId: string = returnUserIdFromToken(req);
    const projectId = req.params.projectId;

    const project = await findProjectById(projectId);

    if (!project) {
      return res.status(404).json({
        status: 'not found',
        error: 'project not found',
      });
    }

    if (project.adminId === userId) {
      await deleteProject(projectId);
      return res.status(200).json({
        status: 'success',
      });
    } else if (project.adminId !== userId) {
      return res.status(401).json({
        status: 'unauthorized',
        error: 'user is not authorized to delete project',
      });
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    return res.status(500).json({
      status: 'server error',
      error: 'failed to delete project',
    });
  }
};

export const addUserAsMemberHandler = async (req: Request, res: Response) => {
  try {
    const userId: string = returnUserIdFromToken(req);
    const newUserId: string = req.body.userId;
    const projectId = req.params.projectId;
    const project = await findProjectById(projectId);

    if (!project) {
      return res.status(404).json({
        status: 'not found',
        error: 'project not found',
      });
    } else if (project.userIds.includes(newUserId)) {
      return res.status(409).json({
        status: 'error',
        error: 'user already in project',
      });
    }

    if (project.adminId === userId) {
      await addUserToProject(projectId, newUserId);
      return res.status(200).json({
        status: 'success',
      });
    } else {
      return res.status(401).json({
        status: 'unauthorized',
        error: 'user is not authorized to add member to project',
      });
    }
  } catch (error) {
    console.error('Error adding member to project:', error);
    return res.status(500).json({
      status: 'server error',
      error: 'failed to add member to project',
    });
  }
};

export const setAdminHandler = async (req: Request, res: Response) => {
  try {
    const userId: string = returnUserIdFromToken(req);
    const newAdminId: string = req.body.userId;
    const projectId = req.params.projectId;
    const project = await findProjectById(projectId);

    if (!project) {
      return res.status(404).json({
        status: 'not found',
        error: 'project not found',
      });
    } else if (!project.userIds.includes(userId)) {
      return res.status(401).json({
        status: 'unauthorized',
        error: 'user is not a member of this project',
      });
    } else if (newAdminId === project.adminId) {
      return res.status(400).json({
        status: 'error',
        error: 'user is already admin of this project',
      });
    }

    if (userId === project.adminId) {
      await updateProjectAdmin(projectId, newAdminId);
      return res.status(200).json({
        status: 'success',
      });
    } else if (userId !== project.adminId) {
      return res.status(401).json({
        status: 'unauthorized',
        error: 'user is not authorized to set new admin',
      });
    }
  } catch (error) {
    console.error('Error setting new admin:', error);
    return res.status(500).json({
      status: 'server error',
      error: 'failed to set new admin',
    });
  }
};
