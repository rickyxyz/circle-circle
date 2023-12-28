import useUser from '@/hook/useUser';
import { uploadFile } from '@/lib/firebase/storage';
import { User } from '@/types/db';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useLoaderData } from 'react-router-dom';

function UpdateProfileForm() {
  const { user, updateProfile } = useUser();
  const [inputUsername, setInputUsername] = useState<string>(
    user?.username ?? ''
  );
  const [file, setFile] = useState<File | undefined>();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  }

  function handleUpdate(e: FormEvent<HTMLFormElement>) {
    if (!user) throw new Error('not logged in');
    e.preventDefault();
    updateProfile({ username: inputUsername })
      // eslint-disable-next-line no-console
      .catch((e) => console.log(e));
  }

  function handleUpload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (file) {
      uploadFile('user', user?.uid ?? '', file)
        .then((downloadUrl) => updateProfile({ profilePicture: downloadUrl }))
        // eslint-disable-next-line no-console
        .catch((e) => console.log(e));
    }
  }

  return (
    <>
      <form onSubmit={handleUpdate}>
        <label htmlFor="update username">
          update username
          <input
            type="text"
            name="username"
            id="update username"
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
          />
        </label>
        <button type="submit">update</button>
      </form>
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
    </>
  );
}

function PageProfile() {
  const loaderUserData = useLoaderData() as User;
  const { user } = useUser();
  const isSelf = user ? loaderUserData.uid === user.uid : false;
  const userData = isSelf && user ? user : loaderUserData;

  return (
    <div>
      <h2>this is {userData.username} profile page</h2>
      {userData.profilePicture && (
        <img src={userData.profilePicture} alt="profile picture" />
      )}
      {isSelf && <UpdateProfileForm />}
    </div>
  );
}

export default PageProfile;
