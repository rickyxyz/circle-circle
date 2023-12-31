import useAuth from '@/hook/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { FirebaseError } from 'firebase/app';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
});
type LoginSchema = z.infer<typeof loginSchema>;

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) });
  const { login } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);

  function handleLogin(data: LoginSchema) {
    const { email, password } = data;
    login(email, password).catch((e: FirebaseError) => {
      if (
        e.code === 'auth/user-not-found' ||
        e.code === 'auth/wrong-password'
      ) {
        setLoginError('User not found or invalid credentials');
      } else {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    });
  }

  return (
    <form
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={handleSubmit(handleLogin)}
      className="mx-auto mt-8 max-w-md bg-white p-4 shadow-md"
    >
      <div className="mb-4">
        <label
          htmlFor="login-email"
          className="mb-2 block text-sm font-bold text-gray-700"
        >
          Login Email
        </label>
        <input
          type="text"
          id="login-email"
          {...register('email')}
          className="w-full rounded-md border border-gray-300 p-2"
        />
        <p className="text-xs italic text-red-500">{errors.email?.message}</p>
      </div>

      <div className="mb-4">
        <label
          htmlFor="login-password"
          className="mb-2 block text-sm font-bold text-gray-700"
        >
          Login Password
        </label>
        <input
          type="password"
          id="login-password"
          {...register('password')}
          className="w-full rounded-md border border-gray-300 p-2"
        />
        <p className="text-xs italic text-red-500">
          {errors.password?.message}
        </p>
      </div>

      {loginError && (
        <p className="mb-4 text-xs italic text-red-500">{loginError}</p>
      )}

      <button
        type="submit"
        className="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-700"
      >
        Login
      </button>
    </form>
  );
}

export default LoginForm;
