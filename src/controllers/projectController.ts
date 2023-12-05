import { Request, Response } from "express";
import { Project } from '../models/project';
import { createProject } from '../services/projectService';
import { returnUserIdFromToken } from "../middleware/jwt";

export const createProjectHandler = async (req: Request, res: Response) => {
  try {
    const project: Project = req.body;
    
    project.adminId = returnUserIdFromToken(req) as string;
    console.log(project);

    await createProject(project);

    return res.status(201).json({ message: "Project created successfully" });

  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({ error: "Failed to create project" });
  }
};