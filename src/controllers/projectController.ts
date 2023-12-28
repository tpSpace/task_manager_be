import { Request, Response } from 'express';
import { Project } from '../models/project';
import {
  createProject,
  findProjectByUserId,
  findProjectById,
  deleteProject,
  updateProjectTitle,
  updateProjectAdmin,
  removeUserFromProject,
} from '../services/projectService';
import { ProjectDocument } from '../models/projectModel';
import { createProjectMongoose } from '../services/projectServiceMongoose';
import { addUserToProject } from '../services/projectService';
import { returnUserIdFromToken } from '../middleware/jwt';
import { findUserById } from '../services/userService';

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

export const joinProjectHandler = async (req: Request, res: Response) => {
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
      return res.status(409).json({
        status: 'error',
        error: 'user already in project',
      });
    }

    await addUserToProject(projectId, userId);

    return res.status(200).json({
      status: 'success',
    });
  } catch (error) {
    console.error('Error joining project:', error);
    return res.status(500).json({
      status: 'server error',
      error: 'failed to join project',
    });
  }
};

export const leaveProjectHandler = async (req: Request, res: Response) => {
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

    if (!project.userIds.includes(userId)) {
      return res.status(409).json({
        status: 'error',
        error: 'user is not in project',
      });
    }

    if (project.adminId === userId) {
      return res.status(408).json({
        status: 'error',
        error: 'user is admin of project',
      });
    }

    await removeUserFromProject(projectId, userId);

    return res.status(200).json({
      status: 'success',
    });
  } catch (error) {
    console.error('Error leaving project:', error);
    return res.status(500).json({
      status: 'server error',
      error: 'failed to leave project',
    });
  }
};

export const getAllProjectHandler = async (req: Request, res: Response) => {
  try {
    const userId: string = returnUserIdFromToken(req);
    const projects = await findProjectByUserId(userId);

    if (projects.length === 0) {
      return res.status(404).json({
        status: 'not found',
        error: 'projects not found',
      });
    }

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

    if (!project.userIds.includes(userId)) {
      return res.status(403).json({
        status: 'forriben',
        error: 'user is not part of project',
      });
    }

    return res.status(200).json({
      status: 'success',
      project,
    });
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
      const updatedProject = await updateProjectTitle(projectId, req.body);
      return res.status(200).json({
        status: 'success',
        updatedProject,
      });
    } else {
      return res.status(401).json({
        status: 'unauthorized',
        error: 'user is not part of project',
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

export const addMemberHandler = async (req: Request, res: Response) => {
  try {
    const userId: string = returnUserIdFromToken(req);

    const newUserId: string = req.params.userId;
    const newMember = await findUserById(newUserId);

    const projectId = req.params.projectId;
    const project = await findProjectById(projectId);

    if (!newMember) {
      return res.status(404).json({
        status: 'not found',
        error: 'user not found',
      });
    }

    if (!project) {
      return res.status(404).json({
        status: 'not found',
        error: 'project not found',
      });
    }

    if (project.userIds.includes(newUserId)) {
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
    const newAdmin = await findUserById(newAdminId);

    if (!newAdmin) {
      return res.status(404).json({
        status: 'not found',
        error: 'user not found',
      });
    }

    const projectId = req.params.projectId;
    const project = await findProjectById(projectId);

    if (!project) {
      return res.status(404).json({
        status: 'not found',
        error: 'project not found',
      });
    }

    if (!project.userIds.includes(userId)) {
      return res.status(401).json({
        status: 'unauthorized',
        error: 'user is not a member of this project',
      });
    }

    if (newAdminId === project.adminId) {
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

export const createProjectHandlerMongoose = async (req: Request, res: Response) => {
  try {
    const project: ProjectDocument = req.body;
    project.adminId = returnUserIdFromToken(req);
    project.memberIds = [project.adminId];

    const newProject = await createProjectMongoose(project);

    return res.status(200).json({
      status: 'success',
      projectId: newProject.projectId,
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return res.status(500).json({
      status: 'server error',
      error: 'failed to create project',
    });
  }
};