import {
  addDoc,
  collection,
  getDoc,
  doc,
  updateDoc,
  DocumentData,
} from 'firebase/firestore';
import { FirestoreCollection } from '@/types/db';
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

async function updateData<T extends keyof FirestoreCollection>(
  collectionName: T,
  id: string,
  data: Partial<FirestoreCollection[T]>
): Promise<void> {
  return updateDoc(doc(db, collectionName, id), data as DocumentData);
}

export { db, writeData, getData, updateData };
