import { AuthContext } from '@/context/AuthProvider';
import { useContext, useMemo } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { FirebaseError } from '@firebase/util';
import { setDoc, doc } from 'firebase/firestore';
import { getData } from '@/lib/firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { useAppDispatch, useAppSelector } from '@/hook/reduxHooks';
import { addCircles } from '@/redux/cacheReducer';

export default function useAuth() {
  const { user, setUser } = useContext(AuthContext);
  const isLoggedIn = useMemo(() => {
    return Boolean(user);
  }, [user]);
  const circleCache = useAppSelector((state) => state.cache.circles);
  const dispatch = useAppDispatch();

  async function register(username: string, email: string, password: string) {
    const userData = await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => userCredential.user.uid)
      .then(async (uid) => {
        await setDoc(doc(db, 'user', uid), {
          username: username,
          uid: uid,
          circle: [],
        });
        return uid;
      })
      .then((uid) => getData('user', uid));
    if (userData) {
      setUser(userData);
    } else {
      throw new Error('cannot find user document');
    }
  }

  async function login(email: string, password: string) {
    const userData = await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => userCredential.user.uid)
      .then((uid) => getData('user', uid));

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
    } else {
      throw new Error('cannot find user document');
    }
  }

  function logout() {
    signOut(auth)
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        throw error as FirebaseError;
      });
  }

  return {
    isLoggedIn,
    user,
    setUser,
    register,
    login,
    logout,
  };
}
