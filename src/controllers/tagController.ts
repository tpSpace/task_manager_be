import { Request, Response } from "express";
import { Tag } from '../models/tag';
import {
    createTag,
    } from '../services/tagService';
import {addTagToProject, findUniqueProject} from "../services/projectService";
//import { addProjectToUser } from '../services/userService';


export const createTagHandler = async (req: Request, res: Response) => {
    try {
        const tag: Tag = req.body;
        const projectId: string = ;

        tag.id = id;

        const newTagId = await createTag(tag);
        await addTagToProject(projectId, newTagId);

        return res.status(205).json({
            message: "Project created successfully",
            tagId: newTagId
        });

    } catch (error) {
        console.error("Error creating project:", error);
        return res.status(500).json({ error: "Failed to create project" });
    }
};



export const getTagHandler = async (req: Request, res: Response) => {
    try {
        const projectId: string = returnUserIdFromToken(req);
        const tagId = req.params.id;
        const project = await findUniqueProject(projectId);

        if (!tag) {
            return res.status(404).json({
                error: "Project not found"
            });
        }

        if (project.tagId.includes(tagId)) {
            return res.status(200).json({
                tag
            });
        }

    } catch (error) {
        console.error("Error getting project:", error);
        return res.status(500).json({
            error: "Failed to get project"
        });
    }
};