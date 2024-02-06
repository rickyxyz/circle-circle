import useUser from '@/hook/useUser';
import { User } from '@/types/db';
import { useMemo, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import Button from '@/component/common/Button';
import { GoKebabHorizontal } from 'react-icons/go';
import DropdownList from '@/component/common/DropdownList';
import UpdateProfileForm from '@/component/form/UpdateProfileForm';

function PageProfile() {
  const loaderUserData = useLoaderData() as User;
  const { user } = useUser();
  const isSelf = user ? loaderUserData.uid === user.uid : false;
  const userData = isSelf && user ? user : loaderUserData;
  const [isEditMode, setIsEditMode] = useState(false);

  const ButtonOther = useMemo(() => {
    return (
      <div className="flex flex-row gap-2">
        <Button>Follow</Button>
      </div>
    );
  }, []);

  const ButtonSelf = useMemo(() => {
    return (
      <div className="flex flex-row gap-2">
        <DropdownList
          triggerComponent={<GoKebabHorizontal />}
          dropdownList={[
            {
              text: 'edit profile',
              onClick: () => {
                setIsEditMode(true);
              },
            },
          ]}
        />
      </div>
    );
  }, []);

  return (
    <div className="flex flex-col p-4">
      {isEditMode ? (
        <UpdateProfileForm
          onSucces={() => {
            setIsEditMode(false);
          }}
          onCancel={() => {
            setIsEditMode(false);
          }}
        />
      ) : (
        <header className="flex flex-col gap-2">
          <div className="flex flex-row items-start justify-between">
            <img
              src={userData.profilePicture ?? '/profile_placeholder.svg'}
              alt="profile picture"
              className="aspect-square h-16 w-16 rounded-full object-cover"
            />
            {isSelf ? ButtonSelf : ButtonOther}
          </div>
          <h1 className="text-xl font-bold">{userData.username}</h1>
        </header>
      )}
    </div>
  );
}

export default PageProfile;
