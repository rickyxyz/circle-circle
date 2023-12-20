/* eslint-disable no-console */
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { app } from './config';

const db = getFirestore(app);

async function connectionTest() {
  const docRef = doc(db, 'test', 'test1');
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log('Document data:', docSnap.data());
  } else {
    console.log('No such document!');
  }
}

export { connectionTest };
