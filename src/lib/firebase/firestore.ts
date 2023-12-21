import {
  getFirestore,
  addDoc,
  collection,
  connectFirestoreEmulator,
} from 'firebase/firestore';
import { app } from './config';
import { FirestoreError } from 'firebase/firestore';
import { FirestoreCollection } from '@/@types/db';

const MODE = import.meta.env.MODE;

const db = getFirestore(app);
if (MODE === 'development') {
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
}

async function writeData<T extends keyof FirestoreCollection>(
  collectionName: T,
  data: FirestoreCollection[T]
) {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
  } catch (error) {
    return error as FirestoreError;
  }
}

export { db, writeData };
