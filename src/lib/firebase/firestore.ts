import {
  collection,
  getDoc,
  doc,
  updateDoc,
  DocumentData,
  getDocs,
  DocumentSnapshot,
} from 'firebase/firestore';
import { FirestoreCollection } from '@/types/db';
import { db } from './config';

export async function getData<T extends keyof FirestoreCollection>(
  collectionName: T,
  id: string
): Promise<FirestoreCollection[T] | undefined> {
  return getDoc(doc(db, collectionName, id)).then(
    (docSnap) => docSnap.data() as FirestoreCollection[T]
  );
}

export async function updateData<T extends keyof FirestoreCollection>(
  collectionName: T,
  id: string,
  data: Partial<FirestoreCollection[T]>
): Promise<void> {
  return updateDoc(doc(db, collectionName, id), data as DocumentData);
}

export async function getCollection<T extends keyof FirestoreCollection>(
  collectionName: T
): Promise<FirestoreCollection[T][]> {
  const querySnapshot = await getDocs(collection(db, collectionName));

  const dataArray: FirestoreCollection[T][] = querySnapshot.docs.map(
    (doc: DocumentSnapshot) => doc.data() as FirestoreCollection[T]
  );

  return dataArray;
}
