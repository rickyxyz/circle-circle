import { ReactNode, createContext, useEffect, useState } from 'react';
import { User } from '@/types/db';
import { auth } from '@/lib/firebase/config';
import { getData } from '@/lib/firebase/firestore';

interface AuthContext {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContext>({
  user: null,
  setUser: () => {
    return;
  },
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(() => {
      if (auth.currentUser) {
        getData('user', auth.currentUser.uid)
          .then((userData) => {
            if (userData) setUser(userData);
          })
          .catch((e) => {
            throw e;
          });
      }
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
