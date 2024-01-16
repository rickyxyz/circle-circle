import useAuth from '@/hook/useAuth';
import { createNewPost } from '@/lib/post';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormHTMLAttributes, useState } from 'react';
import { useForm } from 'react-hook-form';
import ReactQuill from 'react-quill';
import { z } from 'zod';
import 'react-quill/dist/quill.snow.css';

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
  const postCreateSchema = z.object({
    title: z.string().min(1, { message: 'Title is required' }),
    description: z.string(),
  });
  type PostCreateSchema = z.infer<typeof postCreateSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<PostCreateSchema>({ resolver: zodResolver(postCreateSchema) });
  const [createError, setCreateError] = useState<string | null>(null);

  function onQuillChange(editorState: string) {
    setValue('description', editorState);
  }

  const editorContent = watch('description');

  function onSubmit(data: PostCreateSchema) {
    if (!user) {
      throw new Error('Unauthorized');
    }
    createNewPost({
      circleName: circleId,
      post: { ...data, type: 'text' },
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
        <ReactQuill
          id="post-description"
          theme="snow"
          value={editorContent}
          modules={{
            toolbar: {
              container: [['bold', 'italic', 'underline', 'strike'], ['link']],
            },
          }}
          onChange={onQuillChange}
        />
        <p className="text-xs italic text-red-500">
          {errors.description?.message}
        </p>
      </div>

      <button
        type="submit"
        className="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-700"
      >
        Post
      </button>

      {createError && <p className="text-red-500">{createError}</p>}
    </form>
  );
}
