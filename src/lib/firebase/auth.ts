import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  connectAuthEmulator,
} from 'firebase/auth';
import { FirebaseError } from '@firebase/util';
import { setDoc, doc } from 'firebase/firestore';
import { db, getData } from './firestore';

const MODE = import.meta.env.MODE;

const auth = getAuth();
if (MODE !== 'production') {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099');
}

async function register(username: string, email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => userCredential.user.uid)
    .then(async (uid) => {
      await setDoc(doc(db, 'user', uid), {
        username: username,
        uid: uid,
      });
      return uid;
    });
}

async function login(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => userCredential.user.uid)
    .then((uid) => getData('user', uid));
}

async function logout() {
  return signOut(auth).catch((error) => {
    throw error as FirebaseError;
  });
}

export { register, login, logout };
