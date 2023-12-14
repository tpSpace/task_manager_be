import { object, string, z } from 'zod';

export const commentSchema = z.object({
  body: object({
    content: string({
      required_error: 'Content is required',
    }),
  }),
});
