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
    updateProfile({ username: inputUsername })
      // eslint-disable-next-line no-console
      .catch((e) => console.log(e));
    if (file) {
      uploadFile('user', user.uid, file)
        .then((downloadUrl) => updateProfile({ profilePicture: downloadUrl }))
        // eslint-disable-next-line no-console
        .catch((e) => console.log(e));
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
            className="h-16 w-16 rounded-full"
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
    </header>
  );
}
