import { db, storage } from '@/lib/firebase/config';
import { Post } from '@/types/db';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateDoc, doc, FirestoreError } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { PostSchema, postSchema } from '@/lib/schemas/postSchema';
import Button from '@/component/common/Button';
import TextEditor from '@/component/common/TextEditor';
import ImageCarousel from '@/component/common/ImageCarousel';
import { useDropzone } from 'react-dropzone';
import {
  ref,
  listAll,
  getDownloadURL,
  StorageError,
  StorageReference,
  deleteObject,
} from 'firebase/storage';
import { uploadFile } from '@/lib/firebase/storage';

export default function PostEditForm({
  post,
  onSuccessCallback,
  onCancel,
}: {
  post: Post;
  onSuccessCallback?: (newPost: Post) => void;
  onCancel?: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<PostSchema>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post.title,
      description: post.description,
    },
  });
  const { circleId, postId } = useParams();
  const [editError, setEditError] = useState<string | null>(null);
  const [getImageError, setGetImageError] = useState<boolean>(false);
  const [imageRefs, setImageRefs] = useState<Record<string, StorageReference>>(
    {}
  );
  const [files, setFiles] = useState<File[]>([]);
  const [previewURL, setPreviewURL] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [largestImageIndex, setLargestImageIndex] = useState(0);

  const getImageUrls = useCallback(async () => {
    const imagesRef = ref(storage, `c/${circleId}/p/${postId}`);

    const imageList = await listAll(imagesRef);
    const linkToRefMap: Record<string, StorageReference> = {};

    const downloadPromises = imageList.items.map(async (item) => {
      const url = await getDownloadURL(item);
      linkToRefMap[url] = item;
      return url;
    });

    const fetchedImageUrls = await Promise.all(downloadPromises);

    setImageUrls(fetchedImageUrls);
    const lastItem = fetchedImageUrls[fetchedImageUrls.length - 1];
    const lastCharacter = lastItem[lastItem.length - 1];
    setLargestImageIndex(parseInt(lastCharacter));
    setImageRefs(linkToRefMap);

    return fetchedImageUrls;
  }, [circleId, postId]);

  useEffect(() => {
    if (!post.hasImage) return;

    getImageUrls()
      .then((fetchedImageUrls) => {
        setPreviewURL(fetchedImageUrls);
      })
      .catch(() => {
        setGetImageError(true);
      });
  }, [circleId, getImageUrls, post.hasImage, postId]);

  function handleImageUpdate() {
    // delete files
    Object.keys(imageRefs).forEach((url) => {
      if (!previewURL.includes(url)) {
        deleteObject(imageRefs[url]).catch((e: StorageError) => {
          throw e;
        });
      }
    });

    // upload new files
    let lastIndex = largestImageIndex;
    Promise.all(
      files.map((file) => {
        lastIndex += 1;
        return uploadFile(
          `c/${circleId}/p/${postId}`,
          `f${lastIndex}`,
          file
        ).catch((e) => {
          throw e;
        });
      })
    ).catch((e) => {
      throw e;
    });
  }

  function onEdit(data: PostSchema) {
    if (post.hasImage) {
      handleImageUpdate();
    }
    updateDoc(doc(db, `/circle/${circleId}/post/${postId}`), {
      ...post,
      ...data,
    })
      .then(() => {
        onSuccessCallback &&
          onSuccessCallback({
            ...post,
            ...data,
          });
      })
      .catch((e: FirestoreError) => {
        setEditError(e.code);
      });
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFiles((p) => [...p, ...acceptedFiles]);
      setPreviewURL((p) =>
        [...p].concat(acceptedFiles.map((file) => URL.createObjectURL(file)))
      );
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] },
    multiple: true,
  });

  return (
    <form
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={handleSubmit(onEdit)}
      className="flex w-full flex-col"
    >
      <div className="mb-4">
        <label
          htmlFor="title"
          className="mb-2 block text-sm font-bold text-gray-700"
        >
          Edit Post Title
        </label>
        <input
          type="text"
          id="title"
          {...register('title')}
          className="w-full rounded-md border border-gray-300 p-2"
        />
        <p className="text-xs italic text-red-500">{errors.title?.message}</p>
      </div>

      {post.hasImage ? (
        <div className="flex min-h-32 flex-col items-center justify-center gap-2 rounded-md border border-gray-300 p-4">
          {imageUrls.length > 0 &&
            (getImageError ? (
              <div className="flex flex-col items-center justify-center gap-2">
                <p>Whoops something went wrong when getting your image</p>
                <Button
                  onClick={() => {
                    getImageUrls()
                      .then((fetchedImageUrls) => {
                        setPreviewURL(fetchedImageUrls);
                      })
                      .catch(() => {
                        setGetImageError(true);
                      });
                  }}
                >
                  Try again
                </Button>
              </div>
            ) : (
              <ImageCarousel
                editable={true}
                imageUrls={previewURL}
                onRemove={(idx) => {
                  setFiles((p) => p.filter((_, i) => i !== idx));
                  setPreviewURL((p) => p.filter((_, i) => i !== idx));
                }}
              />
            ))}
          <div
            {...getRootProps()}
            className={
              'flex h-full w-full flex-1 cursor-grab items-center justify-center rounded-sm bg-gray-50 p-2 text-center'
            }
          >
            <input {...getInputProps()} />

            {isDragActive ? (
              <p>Drop the files here...</p>
            ) : (
              <p>Drag & drop some files here, or click to select files</p>
            )}
          </div>
          <p className="text-xs italic text-red-500">
            {errors.image_urls?.message}
          </p>
        </div>
      ) : (
        <div className="mb-4">
          <label
            htmlFor="post-description"
            className="mb-2 block text-sm font-bold text-gray-700"
          >
            Edit Post Description
          </label>
          <TextEditor
            name="description"
            control={control}
            id="post-description"
          />
          <p className="text-xs italic text-red-500">
            {errors.description?.message}
          </p>
        </div>
      )}

      <div className="flex w-full flex-row justify-end gap-2">
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit">Update Post</Button>
      </div>

      {editError && <p className="text-red-500">{editError}</p>}
    </form>
  );
}
