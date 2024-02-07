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
import { Comment } from '@/types/db';
import Button from '@/component/common/Button';
import TextEditor from '@/component/common/TextEditor';
import { CommentSchema, commentSchema } from '@/lib/schemas/commentSchema';

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
  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
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
      author: user.username,
      postDate: Timestamp.now(),
    };
    addDoc(collection(db, basePath), newComment)
      .then((docref) => {
        reset();
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
        <TextEditor<CommentSchema>
          control={control}
          name="comment"
          id="post-comment"
        />
        <p className="text-xs italic text-red-500">{errors.comment?.message}</p>
      </div>

      <div className="flex w-full flex-row justify-end gap-2">
        {cancelable && <Button onClick={onCancel}>cancel</Button>}
        <Button type="submit">post</Button>
      </div>

      {commentError && <p className="text-red-500">{commentError}</p>}
    </form>
  );
}
