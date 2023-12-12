import { object, string, z } from "zod";
export const stageSchema = z.object({
  body: object({
    title: string({
      required_error: "Title is required",
    })
  }),
});
