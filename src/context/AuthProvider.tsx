import { ReactNode, createContext, useEffect, useState } from 'react';
import { User } from '@/types/db';
import { auth } from '@/lib/firebase/config';
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
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
