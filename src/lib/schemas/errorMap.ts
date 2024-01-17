import { z } from 'zod';

const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (issue.code === z.ZodIssueCode.invalid_type) {
    if (issue.expected === 'string') {
      return { message: 'Comment cannot be empty' };
    }
  }
  return { message: ctx.defaultError };
};

export default customErrorMap;
