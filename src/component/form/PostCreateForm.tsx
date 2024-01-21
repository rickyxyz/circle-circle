import useAuth from '@/hook/useAuth';
import { createNewPost } from '@/lib/post';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormHTMLAttributes, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { PostSchema, postSchema } from '@/lib/schemas/postSchema';
import TextEditor from '@/component/common/TextEditor';
import { Post } from '@/types/db';
import Button from '@/component/common/Button';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import ImageCarousel from '@/component/common/ImageCarousel';

interface PostCreateFormProps extends FormHTMLAttributes<HTMLFormElement> {
  circleId: string;
  onSuccessCallback?: (postId: string) => void;
}

type tabName = 'text' | 'image';

export default function PostCreateForm({
  circleId,
  onSuccessCallback,
  className,
}: PostCreateFormProps) {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<PostSchema>({ resolver: zodResolver(postSchema) });
  const [createError, setCreateError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<tabName>('text');
  const [file, setFile] = useState<File[]>([]);
  const [previewURL, setPreviewURL] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleTabChange = (tab: tabName) => {
    setActiveTab(tab);
  };
  const tabStyle = (tab: tabName) =>
    cn(
      'cursor-pointer rounded-t-md p-2 bg-gray-100',
      tab === activeTab
        ? 'bg-white border-gray-300 border border-b-white'
        : 'border-b-gray-300 border'
    );

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    if (acceptedFiles.length > 0) {
      setFile((p) => [...p, ...acceptedFiles]);
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

  function onSubmit(data: PostSchema) {
    if (!user) {
      throw new Error('Unauthorized');
    }
    createNewPost({
      circleName: circleId,
      post: { ...data } as Post,
      userId: user.uid,
      files: file,
      onSuccess: onSuccessCallback,
      onFail: (e) => {
        setCreateError(e.code);
      },
    });
  }

  return (
    <form
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={handleSubmit(onSubmit)}
      className={className}
    >
      <div className="mb-4">
        <label
          htmlFor="post-title"
          className="mb-2 block text-sm font-bold text-gray-700"
        >
          Post Title
        </label>
        <input
          type="text"
          id="post-title"
          {...register('title')}
          className="w-full rounded-md border border-gray-300 p-2"
        />
        <p className="text-xs italic text-red-500">{errors.title?.message}</p>
      </div>
      <div className="grid grid-cols-2 items-center rounded-t-md text-center font-semibold">
        <div
          onClick={() => handleTabChange('text')}
          className={tabStyle('text')}
        >
          <label htmlFor="post-description" className="text-gray-700">
            Text
          </label>
        </div>
        <div
          onClick={() => handleTabChange('image')}
          className={tabStyle('image')}
        >
          <label htmlFor="post-image" className="text-gray-700">
            Image
          </label>
        </div>
      </div>
      {activeTab === 'image' && (
        <div className="flex min-h-32 flex-col items-center justify-center gap-2 rounded-b-md border border-gray-300 border-t-white p-4">
          {uploadedFiles.length > 0 && (
            <ImageCarousel
              editable={true}
              imageUrls={previewURL}
              onRemove={(idx) => {
                setFile((p) => p.filter((_, i) => i !== idx));
                setPreviewURL((p) => p.filter((_, i) => i !== idx));
              }}
            />
          )}
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
      )}
      {activeTab === 'text' && (
        <div className="flex min-h-32">
          <TextEditor
            type="tabbed"
            name="description"
            control={control}
            id="description"
          />
          <p className="text-xs italic text-red-500">
            {errors.description?.message}
          </p>
        </div>
      )}
      <Button type="submit" className="mt-4">
        Post
      </Button>
      {createError && <p className="text-red-500">{createError}</p>}
    </form>
  );
}
