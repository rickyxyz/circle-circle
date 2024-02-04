import { db } from '@/lib/firebase/config';
import { Circle } from '@/types/db';
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function searchCircle(searchQuery: string) {
  const circleColRef = collection(db, 'circle');
  const q = query(
    circleColRef,
    where('name', '>=', searchQuery),
    where('name', '<=', searchQuery + '\uf8ff')
  );

  const querySnapshot = await getDocs(q);

  const dataObject: Record<string, Circle> = {};

  querySnapshot.docs.forEach((doc) => {
    dataObject[doc.id] = doc.data() as Circle;
  });

  return dataObject;
}
