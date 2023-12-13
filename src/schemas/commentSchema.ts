import { object, string, z } from 'zod';

export const commentSchema = z.object({
  body: object({
    title: string({
      required_error: 'Title is required',
    }),
    content: string({
      required_error: 'Content is required',
    }),
  }),
});
