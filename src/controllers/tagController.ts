import { Request, Response } from "express";
import { Tag } from "../models";
import {
  createTag,
  getAllTagFromProjectId,
  findProjectById,
} from "../services";
import ApiResponseBuilder, { HttpStatusCode } from "./abstraction";
export const createTagHandler = async (req: Request, res: Response) => {
  try {
    const tag: Tag = req.body;
    const projectId: string = req.params.id;
    const project = await findProjectById(projectId);

    if (!project) {
      const response = ApiResponseBuilder.buildErrorResponse<Tag>(
        HttpStatusCode.NOTFOUND,
        "project not found"
      );
      return res.status(response.statusCode!).json(response);
    }

    const newTagId = await createTag(tag, projectId);
    const response = ApiResponseBuilder.buildSuccessResponse<string>(newTagId);
    return res.status(HttpStatusCode.SUCCESS).json(response);
  } catch (error) {
    console.error("Error creating tag:", error);
    const response = ApiResponseBuilder.buildErrorResponse<string>(
      HttpStatusCode.SERVERERROR,
      "failed to create tag"
    );
    return res.status(HttpStatusCode.SERVERERROR).json(response);
  }
};

export const getTagFromProjectHandler = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.id;
    const project = await findProjectById(projectId);
    if (!project) {
      const response = ApiResponseBuilder.buildErrorResponse<Tag>(
        HttpStatusCode.NOTFOUND,
        "project not found"
      );
      return res.status(response.statusCode!).json(response);
    }
    const tag = await getAllTagFromProjectId(projectId);

    return res.status(200).json({
      status: "success",
      tag,
    });
  } catch (error) {
    console.error("Error getting tag:", error);
    const response = ApiResponseBuilder.buildErrorResponse<Tag>(
      HttpStatusCode.SERVERERROR,
      "failed to get tag"
    );
    return res.status(response.statusCode!).json(response);
  }
};
