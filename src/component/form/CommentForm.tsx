import useAuth from '@/hook/useAuth';
import { customError } from '@/lib/error';
import { db } from '@/lib/firebase/config';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FirestoreError,
  addDoc,
  collection,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { z } from 'zod';
import { Comment } from '@/types/db';

export function CommentForm({
  onSuccessCallback,
  basePath,
}: {
  onSuccessCallback?: (newComment: Comment, commentId: string) => void;
  basePath: string;
}) {
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

    const newComment: Comment = { text: data.comment, author: user.uid };
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
    >
      <div className="mb-4">
        <label
          htmlFor="post-comment"
          className="mb-2 block text-sm font-bold text-gray-700"
        >
          Post a comment
        </label>
        <input
          type="text"
          id="post-comment"
          {...register('comment')}
          className="w-full rounded-md border border-gray-300 p-2"
        />
        <p className="text-xs italic text-red-500">{errors.comment?.message}</p>
      </div>

      <button
        type="submit"
        className="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-700"
      >
        post
      </button>

      {commentError && <p className="text-red-500">{commentError}</p>}
    </form>
  );
}

export function CommentEditForm({
  comment,
  commentId,
  onSuccessCallback,
}: {
  comment: Comment;
  commentId: string;
  onSuccessCallback?: (newComment: Comment) => void;
}) {
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
    defaultValues: { comment: comment.text },
  });
  const { circleId, postId } = useParams();
  const [commentError, setCommentError] = useState<string | null>(null);
  const { user } = useAuth();

  function onSubmit(data: CommentSchema) {
    if (!user) {
      throw new customError('unauthorize', 'you are not authorized to do this');
    }

    const newComment: Comment = { text: data.comment, author: user.uid };
    updateDoc(
      doc(db, `/circle/${circleId}/post/${postId}/comment/${commentId}`),
      { ...newComment }
    )
      .then(() => {
        onSuccessCallback && onSuccessCallback(newComment);
      })
      .catch((e: FirestoreError) => {
        setCommentError(e.code);
      });
  }

  return (
    <form // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="mb-4">
        <label
          htmlFor="edit-comment"
          className="mb-2 block text-sm font-bold text-gray-700"
        >
          edit this comment
        </label>
        <input
          type="text"
          id="edit-comment"
          {...register('comment')}
          className="w-full rounded-md border border-gray-300 p-2"
        />
        <p className="text-xs italic text-red-500">{errors.comment?.message}</p>
      </div>

      <button
        type="submit"
        className="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-700"
      >
        save
      </button>

      {commentError && <p className="text-red-500">{commentError}</p>}
    </form>
  );
}
