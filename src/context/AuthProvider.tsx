import { ReactNode, createContext, useEffect, useState } from 'react';
import { User } from '@/types/db';
import { User as FirebaseUser } from 'firebase/auth';
import { getCurrentUser } from '@/lib/firebase/auth';
import { getData } from '@/lib/firebase/firestore';
import { addCircles } from '@/redux/cacheReducer';
import { useAppDispatch, useAppSelector } from '@/hook/reduxHooks';

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
  const circleCache = useAppSelector((state) => state.cache.circles);
  const dispatch = useAppDispatch();

  const handleUserData = async (userAuth: FirebaseUser | null) => {
    if (userAuth) {
      const userData = await getData('user', userAuth.uid);
      if (userData) {
        setUser(userData);
        userData.circle.forEach((circleId) => {
          if (!Object.keys(circleCache).includes(circleId)) {
            getData('circle', circleId)
              .then((circle) => {
                if (circle) {
                  dispatch(addCircles([circle]));
                } else throw new Error('user not found');
              })
              .catch((e) => {
                throw e;
              });
          }
        });
      }
    }
  };

  useEffect(() => {
    getCurrentUser()
      .then(handleUserData)
      .catch((e) => {
        throw e;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
