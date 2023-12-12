import { Request, Response } from "express";
import { Tag } from "../models";
import {
  createTag,
  getAllTagFromProjectId,
  findProjectById,
} from "../services";
import { FastResponse, HttpStatusCode, Action } from "./abstraction";

export const createTagHandler = async (req: Request, res: Response) => {
  const fr = new FastResponse(res, "Tag");
  try {
    const tag: Tag = req.body;
    const projectId: string = req.params.projectId;
    const project = await findProjectById(projectId);

    if (!project) {
      return fr.buildError(HttpStatusCode.NOTFOUND);
    }

    const newTagId = await createTag(tag, projectId);

    return fr.buildSuccess({ tagId: newTagId });
  } catch (error) {
    console.error("Error creating tag:", error);
    return fr.buildError(HttpStatusCode.SERVERERROR, Action.CREATE);
  }
};

export const getTagFromProjectHandler = async (req: Request, res: Response) => {
  const fr = new FastResponse(res, "Tag");
  try {
    const projectId = req.params.projectId;
    const project = await findProjectById(projectId);

    if (!project) {
      return fr.buildError(HttpStatusCode.NOTFOUND, Action.FIND);
    }

    const tags = await getAllTagFromProjectId(projectId);

    return fr.buildSuccess({ tags });
  } catch (error) {
    console.error("Error getting tags:", error);
    return fr.buildError(HttpStatusCode.SERVERERROR, Action.READ);
  }
};
