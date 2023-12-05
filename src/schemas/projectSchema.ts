import { z } from 'zod';

export const projectSchema = z.object({
    body: z.object({
        title: z.string().max(200, "Title must not exceed 200 characters"),
    }),
});