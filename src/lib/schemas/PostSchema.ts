import customErrorMap from '@/lib/schemas/errorMap';
import { z } from 'zod';

const postSchema = z.object({
  title: z.string({ errorMap: customErrorMap }).min(1),
  description: z.string().max(300),
});

type PostSchema = z.infer<typeof postSchema>;

export { postSchema };
export type { PostSchema };
