import { object, string, z } from "zod";
export const stageSchema = z.object({
  body: object({
    title: string({
      required_error: "Title is required",
    }).min(2, "Title must be at least 2 characters"),
  }),
});
