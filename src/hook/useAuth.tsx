import { AuthContext } from '@/context/AuthProvider';
import { useContext } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { FirebaseError } from '@firebase/util';
import { setDoc, doc } from 'firebase/firestore';
import { getData } from '@/lib/firebase/firestore';
import { auth, db } from '@/lib/firebase/config';

export default function useAuth() {
  const { user, setUser } = useContext(AuthContext);

  async function register(username: string, email: string, password: string) {
    const userData = await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => userCredential.user.uid)
      .then(async (uid) => {
        await setDoc(doc(db, 'user', uid), {
          username: username,
          uid: uid,
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
    } else {
      throw new Error('cannot find user document');
    }
  }

  function logout() {
    signOut(auth).catch((error) => {
      throw error as FirebaseError;
    });
    setUser(null);
  }

  return {
    user,
    setUser,
    register,
    login,
    logout,
  };
}
