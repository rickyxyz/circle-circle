import {
  getFirestore,
  addDoc,
  collection,
  connectFirestoreEmulator,
  getDoc,
  doc,
} from 'firebase/firestore';
import { app } from './config';
import { FirestoreCollection } from '@/@types/db';

const MODE = import.meta.env.MODE;

const db = getFirestore(app);
if (MODE !== 'production') {
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
}

async function getData<T extends keyof FirestoreCollection>(
  collectionName: T,
  id: string
): Promise<FirestoreCollection[T] | undefined> {
  return getDoc(doc(db, collectionName, id)).then(
    (docSnap) => docSnap.data() as FirestoreCollection[T]
  );
}

async function writeData<T extends keyof FirestoreCollection>(
  collectionName: T,
  data: FirestoreCollection[T]
) {
  return addDoc(collection(db, collectionName), data).then(
    (docRef) => docRef.id
  );
}

export { db, writeData, getData };
