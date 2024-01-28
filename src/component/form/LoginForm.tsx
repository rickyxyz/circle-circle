import useAuth from '@/hook/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { FirebaseError } from 'firebase/app';
import { Link, useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) });
  const { login } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);

  function handleLogin(data: LoginSchema) {
    const { email, password } = data;
    login(email, password)
      .then(() => {
        navigate('/');
      })
      .catch((e: FirebaseError) => {
        setLoginError(e.code);
      });
  }

  return (
    <div className="container mx-auto mt-8 flex max-w-md flex-col gap-4 p-4 md:shadow-md">
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit(handleLogin)}
        className="flex flex-col"
      >
        <h1 className="mb-4 text-center text-2xl font-bold">Login</h1>
        <div className="mb-4">
          <label
            htmlFor="login-email"
            className="mb-2 block text-sm font-bold text-gray-700"
          >
            Email
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
            Password
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
      <hr />
      <Link
        to={'/account/register'}
        className="text-center text-blue-700 underline"
      >
        Sign up
      </Link>
    </div>
  );
}

export default LoginForm;
