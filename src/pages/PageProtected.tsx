import useAuth from '@/hook/useAuth';
import { uploadFile } from '@/lib/firebase/storage';
import { ChangeEvent, FormEvent, useState } from 'react';

function LogoutButton() {
  const { logout } = useAuth();

  function handleLogout() {
    logout();
  }

  return <button onClick={handleLogout}>logout</button>;
}

function PageProtected() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | undefined>();
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  }

  function handleUpload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (file) {
      uploadFile('user', user?.uid ?? '', file)
        .then((downloadUrl) => setUploadedImageUrl(downloadUrl))
        // eslint-disable-next-line no-console
        .catch((e) => console.log(e));
    }
  }

  return (
    <>
      <h2>authorized</h2>
      {uploadedImageUrl && <img src={uploadedImageUrl} alt="profile picture" />}
      <form onSubmit={handleUpload}>
        <label htmlFor="upload image">upload image</label>
        <input
          type="file"
          id="upload image"
          name="upload image"
          onChange={handleChange}
        />
        <button type="submit">upload</button>
      </form>
      <LogoutButton />
    </>
  );
}

export default PageProtected;
