/* eslint-disable no-console */
import { FormEvent } from 'react';
import { AuthProvider } from './context/AuthProvider';
import useAuth from './hook/useAuth';

function Username() {
  const { user } = useAuth();
  return <h1>{user?.username ?? 'NULL'}</h1>;
}

function LogoutButton() {
  const { logout } = useAuth();

  function handleLogout() {
    logout();
  }

  return <button onClick={handleLogout}>logout</button>;
}

function RegisterForm() {
  const { register } = useAuth();

  function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const username = (e.target as HTMLFormElement).elements.namedItem(
      'username'
    ) as HTMLInputElement;
    const email = (e.target as HTMLFormElement).elements.namedItem(
      'email'
    ) as HTMLInputElement;
    const password = (e.target as HTMLFormElement).elements.namedItem(
      'password'
    ) as HTMLInputElement;
    register(username.value, email.value, password.value).catch((e) =>
      console.log(e)
    );
  }

  return (
    <form onSubmit={handleRegister}>
      <label htmlFor="register username">
        register username
        <input type="text" name="username" id="register username" />
      </label>
      <label htmlFor="register email">
        register email
        <input type="text" name="email" id="register email" />
      </label>
      <label htmlFor="register password">
        register password
        <input type="text" name="password" id="register password" />
      </label>
      <button type="submit">register</button>
    </form>
  );
}

function LoginForm() {
  const { login } = useAuth();

  function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = (e.target as HTMLFormElement).elements.namedItem(
      'email'
    ) as HTMLInputElement;
    const password = (e.target as HTMLFormElement).elements.namedItem(
      'password'
    ) as HTMLInputElement;
    login(email.value, password.value).catch((e) => console.log(e));
  }

  return (
    <form onSubmit={handleLogin}>
      <label htmlFor="login email">
        login email
        <input type="text" name="email" id="login email" />
      </label>
      <label htmlFor="login password">
        login password
        <input type="text" name="password" id="login password" />
      </label>
      <button type="submit">login</button>
    </form>
  );
}

function App() {
  return (
    <AuthProvider>
      <Username />
      <RegisterForm />
      <LoginForm />
      <LogoutButton />
    </AuthProvider>
  );
}

export default App;
