import {z} from 'zod';

export const ticketSchema = z.object({
    body: z.object({
        title: z.string({
            required_error: "Title is required"
        }).max(200, "Title must not exceed 200 characters"),
        description: z.string()
        .max(300,"Description must not exceed 200 characters"),
    }),
})