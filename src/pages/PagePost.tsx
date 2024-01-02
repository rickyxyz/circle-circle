import useAuth from '@/hook/useAuth';
import { customError } from '@/lib/error';
import { db } from '@/lib/firebase/config';
import { Post } from '@/types/db';
import { zodResolver } from '@hookform/resolvers/zod';
import { FirebaseError } from 'firebase/app';
import {
  FirestoreError,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { Comment } from '@/types/db';

function EditForm({
  post,
  onSuccessCallback,
}: {
  post: Post;
  onSuccessCallback?: (newPost: Post) => void;
}) {
  const postEditSchema = z.object({
    title: z.string().min(1),
    description: z.string().max(300),
  });
  type PostEditSchema = z.infer<typeof postEditSchema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostEditSchema>({
    resolver: zodResolver(postEditSchema),
    defaultValues: {
      title: post.title,
      description: post.description,
    },
  });
  const { circleId, postId } = useParams();
  const [editError, setEditError] = useState<string | null>(null);

  function onEdit(data: PostEditSchema) {
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
      className="mx-auto mt-8 max-w-md bg-white p-4 shadow-md"
    >
      <h2 className="mb-4 text-2xl font-bold">Edit Form</h2>

      <div className="mb-4">
        <label
          htmlFor="post-title"
          className="mb-2 block text-sm font-bold text-gray-700"
        >
          Edit Post Title
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
          Edit Post Description
        </label>
        <input
          type="text"
          id="post-description"
          {...register('description')}
          className="w-full rounded-md border border-gray-300 p-2"
        />
        <p className="text-xs italic text-red-500">
          {errors.description?.message}
        </p>
      </div>

      <button
        type="submit"
        className="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-700"
      >
        Update Post
      </button>

      {editError && <p className="text-red-500">{editError}</p>}
    </form>
  );
}

function CreateCommentForm({
  onSuccessCallback,
}: {
  onSuccessCallback?: (newComment: Comment, commentId: string) => void;
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
  const { circleId, postId } = useParams();
  const [commentError, setCommentError] = useState<string | null>(null);
  const { user } = useAuth();

  function onSubmit(data: CommentSchema) {
    if (!user) {
      throw new customError('unauthorize', 'you are not authorized to do this');
    }

    const newComment: Comment = { text: data.comment, author: user.uid };
    addDoc(
      collection(db, `/circle/${circleId}/post/${postId}/comment`),
      newComment
    )
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

function CommentEditForm({
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

function CommentCard({
  commentData,
  commentId,
  onSuccessCallback,
  onDelete,
}: {
  commentData: Comment;
  commentId: string;
  onSuccessCallback?: (newComment: Comment) => void;
  onDelete?: () => void;
}) {
  const [isEditMode, setIsEditMode] = useState(false);
  const { user } = useAuth();

  return isEditMode ? (
    <div>
      <CommentEditForm
        comment={commentData}
        onSuccessCallback={(newComment) => {
          onSuccessCallback && onSuccessCallback(newComment);
          setIsEditMode(false);
        }}
        commentId={commentId}
      />
    </div>
  ) : (
    <div>
      {user && user.uid === commentData.author && (
        <>
          <button
            onClick={() => {
              setIsEditMode(true);
            }}
          >
            edit
          </button>
          <button
            onClick={() => {
              onDelete && onDelete();
            }}
          >
            delete
          </button>
        </>
      )}
      <p>{commentData.author}</p>
      <p>{commentData.text}</p>
    </div>
  );
}

function PagePost() {
  const { user } = useAuth();
  const { circleId, postId } = useParams();
  const [post, setPost] = useState<Post>(useLoaderData() as Post);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [commentDeleteError, setCommentDeleteError] = useState<string | null>(
    null
  );
  const navigate = useNavigate();
  const [comments, setComments] = useState<Record<string, Comment>>({});
  const [getError, setGetError] = useState<null | string>(null);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(
        collection(db, `circle/${circleId}/post/${postId}/comment`)
      );

      const dataObject: Record<string, Comment> = {};

      querySnapshot.forEach((doc) => {
        dataObject[doc.id] = doc.data() as Comment;
      });

      return dataObject;
    };

    fetchData()
      .then((comments) => setComments(comments))
      .catch((e: FirestoreError) => {
        setGetError(e.code);
      });
  }, [circleId, postId]);

  function onDelete() {
    deleteDoc(doc(db, `/circle/${circleId}/post/${postId}`))
      .then(() => {
        navigate('/circle/${circleId}', { replace: true });
      })
      .catch((e: FirebaseError) => setDeleteError(e.code));
  }

  function onComment(newComment: Comment, commentId: string) {
    setComments({
      ...comments,
      [commentId]: newComment,
    });
  }

  function onCommentDelete(commentId: string) {
    deleteDoc(
      doc(db, `/circle/${circleId}/post/${postId}/comment/${commentId}`)
    )
      .then(() => {
        setComments((prev) => {
          const updatedComments = { ...prev };
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete updatedComments[commentId];
          return updatedComments;
        });
      })
      .catch((e: FirestoreError) => {
        setCommentDeleteError(e.code);
      });
  }

  return (
    <div>
      <h2>{post.title}</h2>
      <h3>{post.description}</h3>
      {user && user.uid === post.author && (
        <button
          onClick={() => setIsEditMode(true)}
          className="mr-2 rounded-md bg-blue-500 p-2 text-white hover:bg-blue-700"
        >
          Edit Post
        </button>
      )}
      {isEditMode && (
        <>
          <button
            onClick={onDelete}
            className="rounded-md bg-red-500 p-2 text-white hover:bg-red-700"
          >
            Delete Post
          </button>
          {deleteError}
          <EditForm post={post} onSuccessCallback={setPost} />
        </>
      )}
      {user && <CreateCommentForm onSuccessCallback={onComment} />}
      {getError}
      {Object.keys(comments).map((commentId) => (
        <div key={`comment-${commentId}}`}>
          <CommentCard
            commentData={comments[commentId]}
            commentId={commentId}
            onSuccessCallback={(newComment) => {
              setComments(() => ({ ...comments, [commentId]: newComment }));
            }}
            onDelete={() => {
              onCommentDelete(commentId);
            }}
          />
          {commentDeleteError}
        </div>
      ))}
    </div>
  );
}

export default PagePost;
