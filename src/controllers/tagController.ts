import { Request, Response } from "express";
import { Tag } from "../models";
import { createTag, getAllTagOfProjectId } from "../services/tagService";
import { addTagToProject } from "../services/projectService";
import { findProjectById } from "../services/projectService";

export const createTagHandler = async (req: Request, res: Response) => {
  try {
    const tag: Tag = req.body;
    const projectId: string = req.params.id;
    const project = await findProjectById(projectId);
    if (!project) {
      return res.status(404).json({
        status: "not found",
        error: "Project not found",
      });
    }

    const newTagId = await createTag(tag);
    await addTagToProject(projectId, newTagId);

    return res.status(200).json({
      status: "success",
      tagId: newTagId,
    });
  } catch (error) {
    console.error("Error creating tag:", error);
    return res.status(500).json({
      status: "server error",
      error: "Failed to create tag",
    });
  }
};

export const getTagFromProjectHandler = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.id;
    const project = await findProjectById(projectId);
    if (!project) {
      return res.status(404).json({
        status: "not found",
        error: "Project not found",
      });
    }
    const tag = await getAllTagOfProjectId(projectId);

    return res.status(200).json({
      status: "success",
      tag,
    });
  } catch (error) {
    console.error("Error getting tag:", error);
    return res.status(500).json({
      status: "server error",
      error: "Failed to get tag",
    });
  }
};
