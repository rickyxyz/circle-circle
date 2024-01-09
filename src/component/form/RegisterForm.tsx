import useAuth from '@/hook/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { FirebaseError } from 'firebase/app';
import { useNavigate } from 'react-router-dom';

const registerSchema = z
  .object({
    username: z
      .string()
      .min(1, { message: 'Username is required' })
      .max(63, { message: 'Username must be at most 63 characters' }),
    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
type RegisterSchema = z.infer<typeof registerSchema>;

function RegisterForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({ resolver: zodResolver(registerSchema) });
  const { register: registerUser } = useAuth();
  const [registerError, setRegisterError] = useState<string | null>(null);

  function handleRegister(data: RegisterSchema) {
    const { username, email, password } = data;
    registerUser(username, email, password)
      .then(() => {
        navigate('/');
      })
      .catch((e: FirebaseError) => {
        if (e.code === 'auth/email-already-in-use') {
          setRegisterError('Email is already in use');
        } else {
          // eslint-disable-next-line no-console
          console.error(e);
        }
      });
  }

  return (
    <form
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={handleSubmit(handleRegister)}
      className="container mx-auto mt-8 max-w-md bg-white p-4 shadow-md"
    >
      <h1 className="mb-4 text-2xl font-bold">Sign Up</h1>
      <div className="mb-4">
        <label
          htmlFor="username"
          className="mb-2 block text-sm font-bold text-gray-700"
        >
          Username
        </label>
        <input
          type="text"
          id="username"
          {...register('username')}
          className="w-full rounded-md border border-gray-300 p-2"
        />
        <p className="text-xs italic text-red-500">
          {errors.username?.message}
        </p>
      </div>

      <div className="mb-4">
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-bold text-gray-700"
        >
          Email
        </label>
        <input
          type="text"
          id="email"
          {...register('email')}
          className="w-full rounded-md border border-gray-300 p-2"
        />
        <p className="text-xs italic text-red-500">{errors.email?.message}</p>
      </div>

      <div className="mb-4">
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-bold text-gray-700"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          {...register('password')}
          className="w-full rounded-md border border-gray-300 p-2"
        />
        <p className="text-xs italic text-red-500">
          {errors.password?.message}
        </p>
      </div>

      <div className="mb-4">
        <label
          htmlFor="confirm-password"
          className="mb-2 block text-sm font-bold text-gray-700"
        >
          Confirm Password
        </label>
        <input
          type="password"
          id="confirm-password"
          {...register('confirmPassword')}
          className="w-full rounded-md border border-gray-300 p-2"
        />
        <p className="text-xs italic text-red-500">
          {errors.confirmPassword?.message}
        </p>
      </div>

      {registerError && (
        <p className="mb-4 text-xs italic text-red-500">{registerError}</p>
      )}

      <button
        type="submit"
        className="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-700"
      >
        Register
      </button>
    </form>
  );
}

export default RegisterForm;
