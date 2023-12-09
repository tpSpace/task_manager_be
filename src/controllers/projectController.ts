import { Request, Response } from "express";
import { Project } from "../models/project";
import {
  createProject,
  findAllProjectOfUserWithId, findProjectById,
} from "../services/projectService";
import { returnUserIdFromToken } from "../middleware/jwt";

export const createProjectHandler = async (req: Request, res: Response) => {
  try {
    const project: Project = req.body;
    project.adminId = returnUserIdFromToken(req);

    const newProjectId = await createProject(project);

    return res.status(200).json({
      status: "success",
      projectId: newProjectId,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({
      status: "server error",
      error: "failed to create project",
    });
  }
};

export const getAllProjectHandler = async (req: Request, res: Response) => {
  try {
    const userId: string = returnUserIdFromToken(req);
    const projects = await findAllProjectOfUserWithId(userId);

    return res.status(200).json({
      status: "success",
      projects
    });

  } catch (error) {
    console.error("Error getting projects:", error);
    return res.status(500).json({
      status: "server error",
      error: "failed to get projects"
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
        status: "not found",
        error: "project not found",
      });
    }

    if (project.userIds.includes(userId)) {
      return res.status(200).json({
        status: "success",
        project,
      });
    }
  } catch (error) {
    console.error("Error getting project:", error);
    return res.status(500).json({
      status: "server error",
      error: "failed to get project",
    });
  }
};
