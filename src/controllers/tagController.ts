import { Request, Response } from "express";
import { Tag } from '../models/tag';
import {
    createTag, getAllTagOfProjectId,
} from '../services/tagService';
import {Project} from "../models";



export const createTagHandler = async (req: Request, res: Response) => {
    try {
        const tag: Tag = req.body;
        const project: Project = req.body;

        const newTagId = await createTag(tag);
        project.tagId.push(tag.id);

        return res.status(205).json({
            message: "Tag created successfully",
            tagId: newTagId
        });

    } catch (error) {
        console.error("Error creating tag:", error);
        return res.status(500).json({ error: "Failed to create tag" });
    }
};



export const getTagFromProjectHandler = async (req: Request, res: Response) => {
    try {
        const projectId = req.params.projectId;
        const tag = await getAllTagOfProjectId(projectId);
        return res.status(200).json(tag);
    } catch (error) {
        console.error("Error getting tag:", error);
        return res.status(500).json({ error: "Failed to get tag" });
    }
};