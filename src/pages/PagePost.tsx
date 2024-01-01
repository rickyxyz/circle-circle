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
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={handleSubmit(onEdit)}>
      <h2>edit form</h2>
      <label htmlFor="post-title">Edit Post Title</label>
      <input type="text" id="post-title" {...register('title')} />
      <p>{errors.title?.message}</p>

      <label htmlFor="post-description">Edit Post description</label>
      <input type="text" id="post-description" {...register('description')} />
      <button type="submit">update post</button>
      <p>{errors.description?.message}</p>

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
        <button onClick={() => setIsEditMode(true)}>edit post</button>
      )}
      {isEditMode && (
        <>
          <button onClick={onDelete}>delete post</button>
          {deleteError}
          <EditForm post={post} onSuccessCallback={setPost} />
        </>
      )}
    </div>
  );
}

export default PagePost;
