import customErrorMap from '@/lib/schemas/errorMap';
import { z } from 'zod';

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const postSchema = z.object({
  title: z
    .string({ errorMap: customErrorMap })
    .min(1, { message: 'Title cannot be empty' }),
  description: z.string().max(300).optional(),
  image_urls: z
    .custom<FileList>()
    .refine((files) => {
      return files[0].size <= MAX_FILE_SIZE;
    }, `Max image size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files[0].type),
      'Only .jpg, .jpeg, .png and .webp formats are supported.'
    )
    .optional(),
});

type PostSchema = z.infer<typeof postSchema>;

export { postSchema };
export type { PostSchema };
