import useAuth from '@/hook/useAuth';
import { customError } from '@/lib/error';
import { db } from '@/lib/firebase/config';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FirestoreError,
  Timestamp,
  addDoc,
  collection,
} from 'firebase/firestore';
import { FormHTMLAttributes, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Comment } from '@/types/db';
import Button from '@/component/common/Button';

interface CommentFormProps extends FormHTMLAttributes<HTMLFormElement> {
  onSuccessCallback?: (newComment: Comment, commentId: string) => void;
  onCancel?: () => void;
  basePath: string;
  label?: string;
  cancelable?: boolean;
}

export function CommentForm({
  onSuccessCallback,
  onCancel,
  basePath,
  className,
  label,
  cancelable = false,
  ...props
}: CommentFormProps) {
  const commentSchema = z.object({
    comment: z.string().min(1, { message: "comment can't be empty" }),
  });
  type CommentSchema = z.infer<typeof commentSchema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CommentSchema>({
    resolver: zodResolver(commentSchema),
  });
  const [commentError, setCommentError] = useState<string | null>(null);
  const { user } = useAuth();

  function onSubmit(data: CommentSchema) {
    if (!user) {
      throw new customError('unauthorize', 'you are not authorized to do this');
    }

    const newComment: Comment = {
      text: data.comment,
      author: user.uid,
      postDate: Timestamp.now(),
    };
    addDoc(collection(db, basePath), newComment)
      .then((docref) => {
        onSuccessCallback && onSuccessCallback(newComment, docref.id);
      })
      .catch((e: FirestoreError) => {
        setCommentError(e.code);
      });
  }

  return (
    <form // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={handleSubmit(onSubmit)}
      className={className}
      {...props}
    >
      <div className="mb-4">
        <label
          htmlFor="post-comment"
          className="mb-1 block text-sm text-gray-700"
        >
          {label ?? 'Put your comment here'}
        </label>
        <input
          type="text"
          id="post-comment"
          {...register('comment')}
          className="w-full rounded-md border border-gray-300 p-2"
        />
        <p className="text-xs italic text-red-500">{errors.comment?.message}</p>
      </div>

      <div className="flex w-full flex-row justify-end gap-2">
        {cancelable && (
          <button
            type="button"
            className="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-700"
            onClick={onCancel}
          >
            cancel
          </button>
        )}
        <Button type="submit">post</Button>
      </div>

      {commentError && <p className="text-red-500">{commentError}</p>}
    </form>
  );
}
