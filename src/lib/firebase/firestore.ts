import { addDoc, collection, getDoc, doc } from 'firebase/firestore';
import { FirestoreCollection } from '@/@types/db';
import { db } from './config';

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
