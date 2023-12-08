import { Request, Response } from "express";
import { Project } from '../models/project';
import { 
  createProject,
  findAllProjectOfUserWithId,
  findProjectById } from '../services/projectService';
import { addProjectToUser } from '../services/userService';
import { returnUserIdFromToken } from "../middleware/jwt";

export const createProjectHandler = async (req: Request, res: Response) => {
  try {
    const project: Project = req.body;
    const userId: string = returnUserIdFromToken(req);

    project.adminId = userId;
    project.userId = [];
    project.userId.push(project.adminId);
    
    const newProjectId = await createProject(project);
    await addProjectToUser(userId, newProjectId);

    return res.status(200).json({ 
      status: "success",
      projectId: newProjectId
    });

  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({ 
      status: "server error",
      error: "Failed to create project" 
    });
  }
};

// Will be used when front end is ready with jwt implementation
// export const getAllProjectHandler = async (req: Request, res: Response) => {
//   try {
//     const userId: string = returnUserIdFromToken(req);    
//     const projects = await findAllProjectOfUserWithId(userId);

//     return res.status(200).json({
//       status: "success", 
//       projects 
//     });

//   } catch (error) {
//     console.error("Error getting projects:", error);
//     return res.status(500).json({
//       status: "server error", 
//       error: "Failed to get projects" 
//     });
//   }
// };

export const getSingleProjectHandler = async (req: Request, res: Response) => {
  try {
    const userId: string = returnUserIdFromToken(req);
    const projectId = req.params.id;
    const project = await findProjectById(projectId);

    if (!project) {
      return res.status(404).json({ 
        status: "not found",
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

export const getAllProjectWithIdHandler = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const projects = await findAllProjectOfUserWithId(userId);

    return res.status(200).json({
      status: "success",  
      projects,
    });

  } catch (error) {
    console.error("Error getting projects:", error);
    return res.status(500).json({
      status: "server error",  
      error: "Failed to get projects" 
    });
  }
};

