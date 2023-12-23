import { logout, register, login } from '@/lib/firebase/auth';
import { AuthContext } from '@/context/AuthProvider';
import { useContext } from 'react';

export default function useAuth() {
  const { user, setUser } = useContext(AuthContext);

  async function registerUser(
    username: string,
    email: string,
    password: string
  ) {
    const userData = await register(username, email, password);

    if (userData) {
      setUser(userData);
    } else {
      throw new Error('register failed');
    }
  }

  async function loginUser(email: string, password: string) {
    const userData = await login(email, password);

    if (userData) {
      setUser(userData);
    } else {
      throw new Error('login failed');
    }
  }

  function logoutUser() {
    try {
      logout().catch((e) => {
        throw e;
      });
      setUser(null);
    } catch (error) {
      throw new Error('logout failed');
    }
    return;
  }

  return {
    user,
    setUser,
    register: registerUser,
    login: loginUser,
    logout: logoutUser,
  };
}
