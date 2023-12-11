import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import {
  HttpStatusCode,
  Action,
  FastResponse,
} from "../controllers/abstraction";
export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const fr = new FastResponse(res);
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      console.error("Error validating:", error);
      return fr.buildError(HttpStatusCode.BADREQUEST, undefined, `${error}`);
    }
  };
