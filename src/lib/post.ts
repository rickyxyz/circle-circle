import { db, storage } from '@/lib/firebase/config';
import { uploadFile } from '@/lib/firebase/storage';
import { Post } from '@/types/db';
import { FirebaseError } from 'firebase/app';
import {
  FirestoreError,
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { ref, listAll, getDownloadURL } from 'firebase/storage';

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

export function deletePost({
  circleId,
  postId,
  onSuccess,
  onFail,
}: {
  circleId: string;
  postId: string;
  onSuccess?: (postId?: string) => void;
  onFail?: (e: FirebaseError) => void;
}) {
  deleteDoc(doc(db, `/circle/${circleId}/post/${postId}`))
    .then(() => {
      onSuccess && onSuccess();
    })
    .catch((e: FirebaseError) => {
      onFail && onFail(e);
    });
}

export function likePost({
  userId,
  circleId,
  postId,
  onLikeSuccess,
  onDislikeSuccess,
}: {
  userId: string;
  circleId: string;
  postId: string;
  onLikeSuccess?: () => void;
  onDislikeSuccess?: () => void;
}) {
  const docRef = doc(db, `circle/${circleId}/post/${postId}/like/${userId}`);
  getDoc(docRef)
    .then((doc) => {
      if (doc.exists()) {
        deleteDoc(docRef)
          .then(() => {
            onLikeSuccess && onLikeSuccess();
          })
          .catch((e) => {
            throw e;
          });
      } else {
        setDoc(docRef, {
          uid: userId,
        })
          .then(() => {
            onDislikeSuccess && onDislikeSuccess();
          })
          .catch((e) => {
            throw e;
          });
      }
    })
    .catch((e) => {
      throw e;
    });
}

export async function getImageUrls(circleId: string, postId: string) {
  const imagesRef = ref(storage, `c/${circleId}/p/${postId}`);

  const imageList = await listAll(imagesRef);

  const downloadPromises = imageList.items.map(async (item) => {
    const url = await getDownloadURL(item);
    return url;
  });

  const fetchedImageUrls = await Promise.all(downloadPromises);

  return fetchedImageUrls;
}

export async function getCommentCount(circleId: string, postId: string) {
  const colRef = collection(db, `circle/${circleId}/post/${postId}/comment`);
  const snapshot = await getCountFromServer(colRef);
  return snapshot.data().count;
}

export async function getLikeCount(circleId: string, postId: string) {
  const colRef = collection(db, `circle/${circleId}/post/${postId}/like`);
  const snapshot = await getCountFromServer(colRef);
  return snapshot.data().count;
}

export async function getLikeStatus(
  userId: string,
  circleId: string,
  postId: string
) {
  const docRef = doc(db, `circle/${circleId}/post/${postId}/like/${userId}`);
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
}
