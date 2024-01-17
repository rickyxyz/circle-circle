import useAuth from '@/hook/useAuth';
import { createNewPost } from '@/lib/post';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormHTMLAttributes, useState } from 'react';
import { useForm } from 'react-hook-form';
import { PostSchema, postSchema } from '@/lib/schemas/postSchema';
import TextEditor from '@/component/common/TextEditor';
import { Post } from '@/types/db';
import Button from '@/component/common/Button';

interface PostCreateFormProps extends FormHTMLAttributes<HTMLFormElement> {
  circleId: string;
  onSuccessCallback?: (postId: string) => void;
}

export default function PostCreateForm({
  circleId,
  onSuccessCallback,
  className,
}: PostCreateFormProps) {
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<PostSchema>({ resolver: zodResolver(postSchema) });
  const [createError, setCreateError] = useState<string | null>(null);

  function onSubmit(data: PostSchema) {
    if (!user) {
      throw new Error('Unauthorized');
    }
    createNewPost({
      circleName: circleId,
      post: { ...data, type: 'text' } as Post,
      userId: user.uid,
      onSuccess: onSuccessCallback,
      onFail: (e) => {
        setCreateError(e.code);
      },
    });
  }

  return (
    <form
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={handleSubmit(onSubmit)}
      className={className}
    >
      <div className="mb-4">
        <label
          htmlFor="post-title"
          className="mb-2 block text-sm font-bold text-gray-700"
        >
          Post Title
        </label>
        <input
          type="text"
          id="post-title"
          {...register('title')}
          className="w-full rounded-md border border-gray-300 p-2"
        />
        <p className="text-xs italic text-red-500">{errors.title?.message}</p>
      </div>

      <div className="mb-4">
        <label
          htmlFor="post-description"
          className="mb-2 block text-sm font-bold text-gray-700"
        >
          Post Description
        </label>
        <TextEditor name="description" control={control} id="description" />
        <p className="text-xs italic text-red-500">
          {errors.description?.message}
        </p>
      </div>

      <Button type="submit">Post</Button>

      {createError && <p className="text-red-500">{createError}</p>}
    </form>
  );
}
