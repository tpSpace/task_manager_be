import { Request, Response } from "express";
import { Tag } from "../models";
import {
  createTag,
  getAllTagFromProjectId,
  findProjectById,
} from "../services";
import ApiResponseBuilder, { HttpStatusCode } from "./abstraction";
import FastResponse from "./abstraction";

export const createTagHandler = async (req: Request, res: Response) => {
  const fr = new FastResponse(res, "Tag");
  try {
    const tag: Tag = req.body;
    const projectId: string = req.params.id;
    const project = await findProjectById(projectId);

    if (!project) {
      return fr.buildError(HttpStatusCode.NOTFOUND);
    }

    const newTagId = await createTag(tag, projectId);
    return fr.buildSuccess(newTagId);
  } catch (error) {
    console.error("Error creating tag:", error);
    return fr.buildError(HttpStatusCode.SERVERERROR);
  }
};

export const getTagFromProjectHandler = async (req: Request, res: Response) => {
  const fr = new FastResponse(res, "Tag");
  try {
    const projectId = req.params.id;
    const project = await findProjectById(projectId);
    if (!project) {
      return fr.buildError(HttpStatusCode.NOTFOUND);
    }
    const tag = await getAllTagFromProjectId(projectId);

    return fr.buildSuccess({ status: "success", tag });
  } catch (error) {
    console.error("Error getting tag:", error);
    return fr.buildError(HttpStatusCode.SERVERERROR);
  }
};
