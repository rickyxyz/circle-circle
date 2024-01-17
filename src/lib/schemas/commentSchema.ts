import customErrorMap from '@/lib/schemas/errorMap';
import { z } from 'zod';

const commentSchema = z.object({
  comment: z
    .string({ errorMap: customErrorMap })
    .refine((value: string) => value.replace(/<[^>]*>/g, ''), {
      message: 'Comment cannot be empty',
    }),
});
type CommentSchema = z.infer<typeof commentSchema>;

export { commentSchema };
export type { CommentSchema };
