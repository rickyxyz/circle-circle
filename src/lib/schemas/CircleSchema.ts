import { z } from 'zod';

enum TopicOption {
  Sports = 'sports',
  Entertainment = 'entertainment',
  Travel = 'travel',
  Gaming = 'gaming',
  Social = 'social',
  Culinary = 'culinary',
}

const circleSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }).max(100),
  description: z.string().max(300),
  topic: z.nativeEnum(TopicOption, { required_error: 'Please select a topic' }),
});

type CircleSchema = z.infer<typeof circleSchema>;

export { circleSchema, TopicOption };

export type { CircleSchema };
