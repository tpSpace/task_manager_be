import { object, string, number, z } from "zod";

export const TagSchema = z.object({
  body: object({
    title: string({
      required_error: "Title is required",
    }),
    priority: number({
      required_error: "Priority is required",
    }),
    colour: string({
      required_error: "Colour is required",
    })
  }),
});
