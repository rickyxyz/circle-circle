import { db } from '@/lib/firebase/config';
import { Post, PostType } from '@/types/db';
import {
  FirestoreError,
  Timestamp,
  addDoc,
  collection,
} from 'firebase/firestore';

interface CreateNewPostParams {
  circleName: string;
  userId: string;
  post: { title: string; description: string; type: PostType };
  onSuccess?: (postId: string) => void;
  onFail?: (error: FirestoreError) => void;
}

export function createNewPost({
  circleName,
  userId,
  post,
  onSuccess,
  onFail,
}: CreateNewPostParams) {
  const newPost: Post = { ...post, author: userId, postDate: Timestamp.now() };

  addDoc(collection(db, `/circle/${circleName}/post`), newPost)
    .then((docRef) => {
      addDoc(collection(db, '/feed'), {
        postId: docRef.id,
        postDate: Timestamp.now(),
        circleId: circleName,
      }).catch((e) => {
        throw e;
      });
      onSuccess && onSuccess(docRef.id);
    })
    .catch((e: FirestoreError) => {
      onFail && onFail(e);
    });
}
