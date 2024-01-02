import { customError } from '@/lib/error';
import { db } from '@/lib/firebase/config';
import { getData } from '@/lib/firebase/firestore';
import { Circle, User } from '@/types/db';
import {
  writeBatch,
  doc,
  arrayUnion,
  FirestoreError,
  arrayRemove,
  updateDoc,
} from 'firebase/firestore';

export function createNewCircle(
  creator: User,
  circle: Circle,
  onSuccess?: (circle: Circle) => void,
  onFail?: (error: FirestoreError) => void
) {
  getData('circle', circle.name)
    .then((data) => {
      if (data !== undefined) {
        throw new customError(
          'already exists',
          'circle with that name already exists'
        );
      }
    })
    .then(() => {
      const batch = writeBatch(db);

      batch.set(doc(db, `circle/${circle.name}`), circle);
      batch.update(doc(db, `user/${creator.uid}`), {
        circle: arrayUnion(circle.name),
      });
      batch.update(doc(db, `user/${creator.uid}`), {
        circle: arrayUnion(circle.name),
      });
      batch.set(doc(db, `circle/${circle.name}/member/${creator.uid}`), {
        role: 'admin',
      });

      batch
        .commit()
        .then(() => {
          onSuccess && onSuccess(circle);
        })
        .catch((e: FirestoreError) => {
          onFail && onFail(e);
        });
    })
    .catch((e: FirestoreError) => {
      onFail && onFail(e);
    });
}

export function editCircle(
  circle: Circle,
  onSuccess?: (circle: Circle) => void,
  onFail?: (error: FirestoreError) => void
) {
  updateDoc(doc(db, `circle/${circle.name}`), { ...circle })
    .then(() => {
      onSuccess && onSuccess(circle);
    })
    .catch((e: FirestoreError) => {
      onFail && onFail(e);
    });
}

export function joinCircle(
  user: User,
  circle: Circle,
  onSuccess?: () => void,
  onFail?: (e: FirestoreError) => void
) {
  const batch = writeBatch(db);

  batch.update(doc(db, `user/${user.uid}`), {
    circle: arrayUnion(circle.name),
  });
  batch.set(doc(db, `circle/${circle.name}/member/${user.uid}`), {
    role: 'member',
  });

  batch
    .commit()
    .then(() => {
      onSuccess && onSuccess();
    })
    .catch((e: FirestoreError) => {
      onFail && onFail(e);
    });
}

export function leaveCircle(
  user: User,
  circle: Circle,
  onSuccess?: () => void,
  onFail?: (e: FirestoreError) => void
) {
  const batch = writeBatch(db);

  batch.update(doc(db, `user/${user.uid}`), {
    circle: arrayRemove(circle.name),
  });
  batch.delete(doc(db, `circle/${circle.name}/member/${user.uid}`));

  batch
    .commit()
    .then(() => {
      onSuccess && onSuccess();
    })
    .catch((e: FirestoreError) => {
      onFail && onFail(e);
    });
}
