import { createTagHandler, getTagFromProjectHandler } from "../controllers";
import express from "express";
import { validateAndAuthorizeToken } from "../middleware/jwt";

const tagRouter = express.Router();

tagRouter.post("/create/:id", validateAndAuthorizeToken, createTagHandler);

tagRouter.get("/get/:id", validateAndAuthorizeToken, getTagFromProjectHandler);

export default tagRouter;
