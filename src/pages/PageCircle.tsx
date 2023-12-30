import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { db, getData } from '@/lib/firebase/firestore';
import {
  FirestoreError,
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { customError } from '@/lib/error';
import { Circle } from '@/types/db';
import { FirebaseError } from 'firebase/app';
import useAuth from '@/hook/useAuth';
import { useLoaderData } from 'react-router-dom';

function CreateForm({
  onSuccessCallback,
}: {
  onSuccessCallback?: (newCircle: Circle) => void;
}) {
  const circleCreateSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }).max(100),
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
  });
  const [createError, setCreateError] = useState<string | null>(null);

  function onSubmit(data: CircleCreateSchema) {
    if (!user) {
      throw new customError('unauthorize', 'you are not authorized to do this');
    }

    const newCircle: Circle = {
      ...data,
      member: {
        [user.uid]: {
          role: 'admin',
        },
      },
    };

    getData('circle', data.name)
      .then((data) => {
        if (data !== undefined) {
          throw new customError(
            'already exists',
            'circle with that name already exists'
          );
        }
      })
      .then(() => {
        setDoc(doc(db, 'circle', data.name), newCircle)
          .then(() => {
            if (onSuccessCallback) {
              onSuccessCallback(newCircle);
            }
          })
          .catch((e: FirestoreError) => {
            setCreateError(e.code);
          });
      })
      .catch((e: FirestoreError) => setCreateError(e.code));
  }

  return (
    <form
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto mt-8 max-w-md bg-white p-4 shadow-md"
    >
      <h2 className="mb-4 text-2xl font-bold">Circle Page</h2>

      <div className="mb-4">
        <label
          htmlFor="circle-name"
          className="mb-2 block text-sm font-bold text-gray-700"
        >
          Circle Name
        </label>
        <input
          type="text"
          id="circle-name"
          {...register('name')}
          className="w-full rounded-md border border-gray-300 p-2"
        />
        <p className="text-xs italic text-red-500">{errors.name?.message}</p>
      </div>

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
        Create
      </button>
    </form>
  );
}

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

    const newCircle = { ...circleData, ...data };

    updateDoc(doc(db, 'circle', circleData.name), newCircle)
      .then(() => {
        if (onSuccessCallback) {
          onSuccessCallback(newCircle);
        }
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
        Edit
      </button>
    </form>
  );
}

function PageCircle() {
  const circleData = useLoaderData() as Circle | null;
  const [getError, setGetError] = useState<string | null>(null);
  const [circles, setCircles] = useState<Circle[]>([]);

  function onSuccessCreate(newCircle: Circle) {
    setCircles((prev) => [...prev, newCircle]);
  }

  useEffect(() => {
    async function fetchData() {
      return getDocs(collection(db, 'circle'));
    }

    fetchData()
      .then((queryCollection) => {
        const dataArray: Circle[] = [];
        queryCollection.forEach((doc) => dataArray.push(doc.data() as Circle));
        setCircles(dataArray);
      })
      .catch((e: FirebaseError) => {
        setGetError(e.code);
      });
  }, []);

  return (
    <div>
      {circles.map((circle, idx) => {
        return <p key={`circle-${circle.name}-${idx}`}>{circle.name}</p>;
      })}
      {getError && <p className="text-red-500">{getError}</p>}
      {circleData ? (
        <UpdateForm
          circleData={circleData}
          onSuccessCallback={onSuccessCreate}
        />
      ) : (
        <CreateForm onSuccessCallback={onSuccessCreate} />
      )}
    </div>
  );
}

export default PageCircle;
