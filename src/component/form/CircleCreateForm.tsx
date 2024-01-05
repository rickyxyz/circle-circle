import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { customError } from '@/lib/error';
import { Circle } from '@/types/db';
import useAuth from '@/hook/useAuth';
import { createNewCircle } from '@/lib/circle';

export default function CircleCreateForm({
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
    createNewCircle(
      user,
      { ...data, topic: 'culinary' },
      onSuccessCallback,
      (e) => {
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
