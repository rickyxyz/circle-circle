import { storage } from '@/lib/firebase/config';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

/**
 * @returns Returns the download url of the uploaded file.
 */
export async function uploadFile(
  collection: string,
  filename: string,
  file: File
): Promise<string> {
  const storageRef = ref(storage, `${collection}/${filename}`);
  return uploadBytes(storageRef, file).then((snapshot) =>
    getDownloadURL(snapshot.ref)
  );
}

export async function getDownloadUrl(
  collection: string,
  filename: string
): Promise<string> {
  const storageRef = ref(storage, `${collection}/${filename}`);
  return getDownloadURL(storageRef);
}
