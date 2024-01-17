import { db } from '@/lib/firebase/config';
import { Post } from '@/types/db';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateDoc, doc, FirestoreError } from 'firebase/firestore';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { PostSchema, postSchema } from '@/lib/schemas/postSchema';
import Button from '@/component/common/Button';
import TextEditor from '@/component/common/TextEditor';

export default function PostEditForm({
  post,
  onSuccessCallback,
  onCancel,
}: {
  post: Post;
  onSuccessCallback?: (newPost: Post) => void;
  onCancel?: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<PostSchema>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post.title,
      description: post.description,
    },
  });
  const { circleId, postId } = useParams();
  const [editError, setEditError] = useState<string | null>(null);

  function onEdit(data: PostSchema) {
    updateDoc(doc(db, `/circle/${circleId}/post/${postId}`), {
      ...post,
      ...data,
    })
      .then(() => {
        if (onSuccessCallback) {
          onSuccessCallback({
            ...post,
            ...data,
          });
        }
      })
      .catch((e: FirestoreError) => {
        setEditError(e.code);
      });
  }

  return (
    <form
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={handleSubmit(onEdit)}
      className="flex w-full flex-col"
    >
      <div className="mb-4">
        <label
          htmlFor="title"
          className="mb-2 block text-sm font-bold text-gray-700"
        >
          Edit Post Title
        </label>
        <input
          type="text"
          id="title"
          {...register('title')}
          className="w-full rounded-md border border-gray-300 p-2"
        />
        <p className="text-xs italic text-red-500">{errors.title?.message}</p>
      </div>

      <div className="mb-4">
        <label
          htmlFor="description"
          className="mb-2 block text-sm font-bold text-gray-700"
        >
          Edit Post Description
        </label>
        <TextEditor name="description" control={control} id="description" />
        <p className="text-xs italic text-red-500">
          {errors.description?.message}
        </p>
      </div>

      <div className="flex w-full flex-row justify-end gap-2">
        <Button
          type="button"
          className="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-700"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-700"
        >
          Update Post
        </Button>
      </div>

      {editError && <p className="text-red-500">{editError}</p>}
    </form>
  );
}
