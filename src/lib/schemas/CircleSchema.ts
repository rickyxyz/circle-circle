import { z } from 'zod';

enum TopicOption {
  Sports = 'sports',
  Entertainment = 'entertainment',
  Travel = 'travel',
  Gaming = 'gaming',
  Social = 'social',
  Culinary = 'culinary',
}

const urlSafeCharsRegExp = /^[a-zA-Z0-9_-]+$/;

const circleSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(100)
    .refine(
      (s) => urlSafeCharsRegExp.test(s),
      'You can only use (a-z, A-Z, 0-9, _, -)'
    ),
  description: z.string().max(300),
  topic: z.nativeEnum(TopicOption, { required_error: 'Please select a topic' }),
});

type CircleSchema = z.infer<typeof circleSchema>;

export { circleSchema, TopicOption };

export type { CircleSchema };
