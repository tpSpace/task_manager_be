import { object, string, z } from 'zod';

export const projectSchema = z.object({
  body: object({
    title: string({
      required_error: 'Title is required',
    }),
  }),
});
