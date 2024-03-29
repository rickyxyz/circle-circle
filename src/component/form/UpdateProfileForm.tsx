import Button from '@/component/common/Button';
import useUser from '@/hook/useUser';
import { uploadFile } from '@/lib/firebase/storage';
import { ChangeEvent, FormEvent, useState } from 'react';

interface UpdateProfileFormProps {
  onSucces?: () => void;
  onCancel?: () => void;
}

export default function UpdateProfileForm({
  onSucces,
  onCancel,
}: UpdateProfileFormProps) {
  const { user, updateProfile } = useUser();
  const [inputUsername, setInputUsername] = useState<string>(
    user?.username ?? ''
  );
  const [file, setFile] = useState<File | undefined>();
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      setFile(event.target.files[0]);
      setPreviewURL(URL.createObjectURL(event.target.files[0]));
    }
  }

  function handleUpload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) throw new Error('not logged in');
    e.preventDefault();
    updateProfile({ username: inputUsername }).catch(() => {
      setUpdateError(true);
    });
    if (file) {
      uploadFile('u', user.uid, file)
        .then((downloadUrl) => updateProfile({ profilePicture: downloadUrl }))
        .catch(() => setImageUploadError(true));
    }
    onSucces && onSucces();
  }

  return (
    <header>
      <form onSubmit={handleUpload} className="flex flex-col gap-4">
        <span className="flex flex-row items-end gap-2">
          <img
            src={
              previewURL ?? user?.profilePicture ?? '/profile_placeholder.svg'
            }
            alt="profile picture"
            className="aspect-square h-16 w-16 rounded-full object-cover"
          />
          <label htmlFor="upload image">
            Change profile picture
            <input
              type="file"
              id="upload image"
              name="upload image"
              onChange={handleChange}
            />
          </label>
        </span>
        <label htmlFor="update username">
          update username
          <input
            type="text"
            name="username"
            id="update username"
            value={inputUsername}
            className="w-full rounded-md border border-gray-300 p-2 text-xl font-bold"
            onChange={(e) => setInputUsername(e.target.value)}
          />
        </label>
        <span className="flex flex-row gap-2 self-end">
          <Button
            onClick={() => {
              onCancel && onCancel();
            }}
          >
            cancel
          </Button>
          <Button type="submit">save update</Button>
        </span>
      </form>
      {(updateError || imageUploadError) && (
        <span className="w-full text-right text-sm text-red-500">
          Uh oh something went wrong, please try again later
        </span>
      )}
    </header>
  );
}
