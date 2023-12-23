/* eslint-disable no-console */
import { AuthProvider } from './context/AuthProvider';
import useAuth from './hook/useAuth';

function Username() {
  const { user } = useAuth();
  return <h1>{user?.username ?? 'NULL'}</h1>;
}

function Buttons() {
  const { register, login, logout } = useAuth();
  const testUser = {
    username: `username`,
    email: `email@email.com`,
    password: 'password123',
  };

  function handleRegister() {
    register(testUser.username, testUser.email, testUser.password).catch((e) =>
      console.log(e)
    );
  }

  function handleLogin() {
    login(testUser.email, testUser.password).catch((e) => console.log(e));
  }

  function handleLogout() {
    logout();
  }

  return (
    <div>
      <button onClick={handleRegister}>register</button>
      <button onClick={handleLogout}>logout</button>
      <button onClick={handleLogin}>login</button>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Username />
      <Buttons />
    </AuthProvider>
  );
}

export default App;
