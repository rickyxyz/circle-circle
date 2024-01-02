import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import {
  DocumentSnapshot,
  FirestoreError,
  addDoc,
  collection,
  getDocs,
} from 'firebase/firestore';
import { customError } from '@/lib/error';
import { Circle, Post } from '@/types/db';
import useAuth from '@/hook/useAuth';
import { useLoaderData } from 'react-router-dom';
import { db } from '@/lib/firebase/config';
import { editCircle } from '@/lib/circle';

function UpdateForm({
  circleData,
  onSuccessCallback,
}: {
  circleData: Circle;
  onSuccessCallback?: (newCircle: Circle) => void;
}) {
  const circleCreateSchema = z.object({
    description: z.string().max(300),
  });
  type CircleCreateSchema = z.infer<typeof circleCreateSchema>;

  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CircleCreateSchema>({
    resolver: zodResolver(circleCreateSchema),
    defaultValues: {
      description: circleData.description,
    },
  });
  const [createError, setCreateError] = useState<string | null>(null);

  function onSubmit(data: CircleCreateSchema) {
    if (!user) {
      throw new customError('unauthorize', 'you are not authorized to do this');
    }
    editCircle(
      { ...circleData, ...data },
      onSuccessCallback,
      (e: FirestoreError) => {
        setCreateError(e.code);
      }
    );
  }

  return (
    <form
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto mt-8 max-w-md bg-white p-4 shadow-md"
    >
      <h2 className="mb-4 text-2xl font-bold">
        you are editing {circleData.name}
      </h2>

      <div className="mb-4">
        <label
          htmlFor="circle-description"
          className="mb-2 block text-sm font-bold text-gray-700"
        >
          Circle Description
        </label>
        <input
          type="text"
          id="circle-description"
          {...register('description')}
          className="w-full rounded-md border border-gray-300 p-2"
        />
        <p className="text-xs italic text-red-500">
          {errors.description?.message}
        </p>
      </div>

      {createError && <p className="text-red-500">{createError}</p>}

      <button
        type="submit"
        className="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-700"
      >
        Update
      </button>
    </form>
  );
}

function CreatePostForm({
  circleId,
  onSuccessCallback,
}: {
  circleId: string;
  onSuccessCallback?: (newPost: Post) => void;
}) {
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
  } = useForm<PostCreateSchema>({ resolver: zodResolver(postCreateSchema) });
  const [createError, setCreateError] = useState<string | null>(null);

  function onSubmit(data: PostCreateSchema) {
    if (!user) {
      throw new Error('Unauthorized');
    }

    addDoc(collection(db, `/circle/${circleId}/post`), {
      ...data,
      author: user.uid,
    })
      .then(() => {
        onSuccessCallback && onSuccessCallback({ ...data, author: user.uid });
      })
      .catch((e: FirestoreError) => {
        setCreateError(e.code);
      });
  }

  return (
    <form
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto mt-8 max-w-md bg-white p-4 shadow-md"
    >
      <h2 className="mb-4 text-2xl font-bold">Create A New Post</h2>

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
        Post
      </button>

      {createError && <p className="text-red-500">{createError}</p>}
    </form>
  );
}

function PageCircleForms() {
  const loaderData = useLoaderData() as {
    circle: Circle;
    isMember: boolean;
  };

  const [circle, setCircle] = useState(loaderData.circle);
  const [posts, setPosts] = useState<Post[]>([]);
  const [getPostError, setGetPostError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(
        collection(db, `circle/${circle.name}/post`)
      );

      const dataArray: Post[] = querySnapshot.docs.map(
        (doc: DocumentSnapshot) => doc.data() as Post
      );

      return dataArray;
    };

    fetchData()
      .then((posts) => setPosts(posts))
      .catch((e: FirestoreError) => {
        setGetPostError(e.code);
      });
  }, [circle.name]);

  function onUpdateSuccess(updatedCircle: Circle) {
    setCircle(updatedCircle);
  }

  function onPostSuccess(newPost: Post) {
    setPosts(posts.concat(newPost));
  }

  return (
    <div>
      <h2>{circle.name}</h2>
      <p>{circle.description}</p>
      <UpdateForm circleData={circle} onSuccessCallback={onUpdateSuccess} />
      {loaderData.isMember && (
        <CreatePostForm
          circleId={circle.name}
          onSuccessCallback={onPostSuccess}
        />
      )}

      {getPostError}
      {posts.map((post, idx) => (
        <div key={`post-${idx}}`}>
          <p>{post.title}</p>
        </div>
      ))}
    </div>
  );
}

export default PageCircleForms;
