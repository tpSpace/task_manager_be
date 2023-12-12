import { Request, Response } from "express";
import { Project } from "../models/project";
import {
  createProject,
  findAllProjectOfUserWithId,
  findProjectById,
  deleteProject,
  updateProject,
} from "../services/projectService";
import { returnUserIdFromToken } from "../middleware/jwt";
import { FastResponse, HttpStatusCode, Action } from "./abstraction";

export const createProjectHandler = async (req: Request, res: Response) => {
  const fr = new FastResponse(res, "Project");
  try {
    const project: Project = req.body;
    project.adminId = returnUserIdFromToken(req);

    const newProjectId = await createProject(project);

    return fr.buildSuccess({ projectId: newProjectId });
  } catch (error) {
    console.error("Error creating project:", error);
    return fr.buildError(HttpStatusCode.SERVERERROR, Action.CREATE);
  }
};

export const getAllProjectHandler = async (req: Request, res: Response) => {
  const fr = new FastResponse(res, "Project");
  try {
    const userId: string = returnUserIdFromToken(req);
    const projects = await findAllProjectOfUserWithId(userId);
    return fr.buildSuccess({ projects });
  } catch (error) {
    console.error("Error getting projects:", error);
    return fr.buildError(HttpStatusCode.SERVERERROR, Action.GET);
  }
};

export const getSingleProjectHandler = async (req: Request, res: Response) => {
  const fr = new FastResponse(res, "Project");
  try {
    const userId: string = returnUserIdFromToken(req);
    const projectId = req.params.projectId;
    const project = await findProjectById(projectId);

    if (!project) {
      return fr.buildError(HttpStatusCode.NOTFOUND);
    }

    if (project.userIds.includes(userId)) {
      return fr.buildSuccess({ project });
    }
  } catch (error) {
    console.error("Error getting project:", error);
    return fr.buildError(HttpStatusCode.SERVERERROR, Action.GET);
  }
};

export const updateTitleProjectHandler = async (
  req: Request,
  res: Response
) => {
  const fr = new FastResponse(res, "Project");
  try {
    const userId: string = returnUserIdFromToken(req);
    const projectId = req.params.projectId;
    const project = await findProjectById(projectId);

    if (!project) {
      return fr.buildError(HttpStatusCode.NOTFOUND, Action.FIND);
    }

    if (project.userIds.includes(userId)) {
      const updatedProject = await updateProject(projectId, req.body);
      return fr.buildSuccess({ updatedProject });
    } else {
      return fr.buildError(HttpStatusCode.UNAUTHORIZED, Action.UPDATE);
    }
  } catch (error) {
    console.error("Error updating project:", error);
    return fr.buildError(HttpStatusCode.SERVERERROR, Action.UPDATE);
  }
};

export const deleteProjectHandler = async (req: Request, res: Response) => {
  const fr = new FastResponse(res, "Project");
  try {
    const userId: string = returnUserIdFromToken(req);
    const projectId = req.params.projectId;

    const project = await findProjectById(projectId);

    if (!project) {
      return fr.buildError(HttpStatusCode.NOTFOUND, Action.FIND);
    }

    if (project.userIds.includes(userId)) {
      return fr.buildSuccess({ project });
    } else {
      return fr.buildError(HttpStatusCode.UNAUTHORIZED, Action.DELETE);
    }
  } catch (error) {
    console.error("Error getting project:", error);
    return fr.buildError(HttpStatusCode.SERVERERROR, Action.DELETE);
  }
};
