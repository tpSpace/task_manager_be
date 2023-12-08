import { object, string, number, z } from "zod";

export const TagSchema = z.object({
    body: object({
        title: z.string({
            required_error: "Title is required",
        }).min(2, "Title must be at least 2 characters"),
        priority: number({
            required_error: "Priority is required",
        }).lte(-1, "Syntax error"),
        colour: string({
            required_error: "Password is required",
        }).max(8, "Colour hex-code must be at least 8 characters").regex(/^(?=.*#)/, "Colour hex-code must contain #"),
    }),
});
