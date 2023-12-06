import { Request, Response } from "express";
import { Project } from '../models/project';
import { 
  createProject,
  findAllProjectOfUser,
  findUniqueProject } from '../services/projectService';
import { returnUserIdFromToken } from "../middleware/jwt";

export const createProjectHandler = async (req: Request, res: Response) => {
  try {
    const project: Project = req.body;
    const userId: string = returnUserIdFromToken(req);

    project.adminId = userId;
    project.userId = [];
    project.userId.push(project.adminId);
    
    const newProjectId = await createProject(project);

    return res.status(201).json({ 
      message: "Project created successfully",
      projectId: newProjectId
    });

  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({ error: "Failed to create project" });
  }
};

export const getAllProjectHandler = async (req: Request, res: Response) => {
  try {
    const userId: string = returnUserIdFromToken(req);    
    const projects = await findAllProjectOfUser(userId);

    return res.status(200).json({ 
      projects 
    });

  } catch (error) {
    console.error("Error getting projects:", error);
    return res.status(500).json({ error: "Failed to get projects" });
  }
};

export const getSingleProjectHandler = async (req: Request, res: Response) => {
  try {
    const userId: string = returnUserIdFromToken(req);
    const projectId = req.params.id;
    const project = await findUniqueProject(projectId);

    if (!project) {
      return res.status(404).json({ 
        error: "Project not found" 
      });
    }

    if (project.userId.includes(userId)) {
      return res.status(200).json({ 
        project 
      });
    }

  } catch (error) {
    console.error("Error getting project:", error);
    return res.status(500).json({ 
      error: "Failed to get project" 
    });
  }
};