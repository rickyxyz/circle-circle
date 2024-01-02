import useAuth from '@/hook/useAuth';
import { db } from '@/lib/firebase/config';
import { Post } from '@/types/db';
import { zodResolver } from '@hookform/resolvers/zod';
import { FirebaseError } from 'firebase/app';
import { FirestoreError, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';

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

function PagePost() {
  const { user } = useAuth();
  const { circleId, postId } = useParams();
  const [post, setPost] = useState<Post>(useLoaderData() as Post);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const navigate = useNavigate();

  function onDelete() {
    deleteDoc(doc(db, `/circle/${circleId}/post/${postId}`))
      .then(() => {
        navigate('/circle/${circleId}', { replace: true });
      })
      .catch((e: FirebaseError) => setDeleteError(e.code));
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
    </div>
  );
}

export default PagePost;
