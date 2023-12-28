import { ReactNode, createContext, useEffect, useState } from 'react';
import { User } from '@/types/db';
import { User as FirebaseUser } from 'firebase/auth';
import { getCurrentUser } from '@/lib/firebase/auth';
import { getData } from '@/lib/firebase/firestore';

interface AuthContext {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContext>({
  user: null,
  setUser: () => {
    return;
  },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const handleUserData = async (userAuth: FirebaseUser | null) => {
    if (userAuth) {
      const userData = await getData('user', userAuth.uid);
      if (userData) {
        setUser(userData);
      }
    }
  };

  useEffect(() => {
    getCurrentUser()
      .then(handleUserData)
      .catch((e) => {
        throw e;
      });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
