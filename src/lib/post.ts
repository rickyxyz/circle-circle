import { db } from '@/lib/firebase/config';
import { uploadFile } from '@/lib/firebase/storage';
import { Post } from '@/types/db';
import {
  FirestoreError,
  Timestamp,
  addDoc,
  collection,
} from 'firebase/firestore';

interface CreateNewPostParams {
  circleName: string;
  userId: string;
  post: { title: string; description?: string };
  files: File[];
  onSuccess?: (postId: string) => void;
  onFail?: (error: FirestoreError) => void;
}

export function createNewPost({
  circleName,
  userId,
  post,
  files,
  onSuccess,
  onFail,
}: CreateNewPostParams) {
  const newPost: Post = {
    ...post,
    description: post.description ?? '',
    author: userId,
    postDate: Timestamp.now(),
    hasImage: files.length > 0,
  };

  addDoc(collection(db, `/circle/${circleName}/post`), newPost)
    .then((docRef) => {
      addDoc(collection(db, '/feed'), {
        postId: docRef.id,
        postDate: Timestamp.now(),
        circleId: circleName,
      }).catch((e) => {
        throw e;
      });

      Promise.all(
        files.map((file, idx) =>
          uploadFile(`c/${circleName}/p/${docRef.id}`, `${idx}`, file).catch(
            (e) => {
              throw e;
            }
          )
        )
      ).catch((e) => {
        throw e;
      });
      onSuccess && onSuccess(docRef.id);
    })
    .catch((e: FirestoreError) => {
      onFail && onFail(e);
    });
}
