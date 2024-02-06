import CircleJoinButton from '@/component/common/CircleJoinButton';
import { FaCamera, FaPlus } from 'react-icons/fa6';
import { Circle } from '@/types/db';
import ButtonWithIcon from '@/component/common/ButtonWithIcon';
import { GoKebabHorizontal } from 'react-icons/go';
import DropdownList from '@/component/common/DropdownList';
import useOverlay from '@/hook/useOverlay';
import useWindowSize from '@/hook/useWindowSize';
import PostCreateModal from '@/component/modal/PostCreateModal';
import { cva, VariantProps } from 'class-variance-authority';
import useAuth from '@/hook/useAuth';
import { ChangeEvent, useEffect, useState } from 'react';
import Button from '@/component/common/Button';
import { FaXmark } from 'react-icons/fa6';
import { uploadFile } from '@/lib/firebase/storage';
import { updateData } from '@/lib/firebase/firestore';
import { db } from '@/lib/firebase/config';
import { collection, getCountFromServer } from 'firebase/firestore';
import { truncateMemberCount } from '@/lib/utils';

const cardHeaderVariant = cva('', {
  variants: {
    variant: {
      default:
        'rounded-full bg-gray-100 px-4 py-2 text-black capitalize text-sm md:text-base font-semibold',
      outline: '',
    },
    size: { default: '', sm: 'md:text-sm px-3 py-1' },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

interface CircleHeaderProps extends VariantProps<typeof cardHeaderVariant> {
  circle: Circle;
}

export default function CircleHeader({ circle }: CircleHeaderProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const { showModal } = useOverlay();
  const { isMobile } = useWindowSize();
  const { user } = useAuth();
  const [memberCount, setMemberCount] = useState(-1);

  const [file, setFile] = useState<File | null>(null);
  const [fileURL, setFileURL] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<
    string | undefined
  >();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      setFile(event.target.files[0]);
      setFileURL(URL.createObjectURL(event.target.files[0]));
    }
  }

  function onSave() {
    if (file) {
      uploadFile('c', circle.name, file)
        .then((downloadUrl) => setUploadedImageUrl(downloadUrl))
        .then(() => {
          updateData('circle', circle.name, {
            ...circle,
            thumbnailUrl: uploadedImageUrl,
          }).catch((e) => {
            throw e;
          });
        })
        .catch((e) => {
          throw e;
        })
        .finally(() => {
          setIsEditMode(false);
        });
    }
  }

  useEffect(() => {
    async function getMemberCount() {
      const colRef = collection(db, `circle/${circle.name}/member`);
      const snapshot = await getCountFromServer(colRef);
      return snapshot.data().count;
    }

    getMemberCount()
      .then((count) => setMemberCount(count))
      .catch(() => setMemberCount(-1));
  }, [circle.name]);

  return (
    <header className="flex flex-col gap-3 bg-white p-4">
      <div className="flex flex-row gap-2">
        <div className="relative overflow-hidden rounded-full">
          <img
            src={
              isEditMode
                ? fileURL ?? '/profile_placeholder.svg'
                : circle.thumbnailUrl ??
                  uploadedImageUrl ??
                  '/profile_placeholder.svg'
            }
            alt={`${circle.name} picture`}
            className={'aspect-square h-12 object-cover md:h-16'}
          />
          {isEditMode && (
            <label
              className="absolute left-0 top-0 h-full w-full cursor-pointer"
              htmlFor="upload image"
            >
              <div className="absolute bottom-0 flex h-1/3 w-full items-center justify-center bg-black bg-opacity-50">
                <FaCamera className="text-white" size={10} />
              </div>
              <input
                type="file"
                id="upload image"
                name="upload image"
                onChange={handleChange}
                className="hidden opacity-0"
              />
            </label>
          )}
        </div>
        <div className="flex flex-1 flex-col justify-end gap-1">
          <h1 className="text-xl font-bold leading-4 md:text-3xl md:leading-6">
            {circle.name}
          </h1>
          <p className="text-sm text-gray-500">
            {truncateMemberCount(memberCount)}
          </p>
        </div>
        {isEditMode ? (
          <Button
            variant={'icon'}
            className="self-start"
            onClick={() => {
              setIsEditMode(false);
            }}
          >
            <FaXmark />
          </Button>
        ) : (
          <DropdownList
            className="self-start p-0"
            triggerComponent={<GoKebabHorizontal />}
            dropdownList={[
              {
                text: 'edit',
                onClick: () => {
                  setIsEditMode(true);
                },
              },
              {
                text: 'report',
                onClick: () => {
                  return;
                },
              },
            ]}
          />
        )}
      </div>
      {isEditMode ? (
        <div className="flex flex-row items-center gap-2 md:self-end">
          <Button
            onClick={() => {
              setIsEditMode(false);
              setFile(null);
              setFileURL(null);
              setUploadedImageUrl(undefined);
            }}
          >
            Cancel
          </Button>
          <Button onClick={onSave}>Save</Button>
        </div>
      ) : (
        <div className="flex flex-row items-center gap-2 md:self-end">
          {(!user || isMobile) && (
            <ButtonWithIcon
              icon={<FaPlus />}
              onClick={() => {
                showModal(PostCreateModal, isMobile);
              }}
              disabled={isEditMode}
            >
              Create A Post
            </ButtonWithIcon>
          )}
          <CircleJoinButton
            circle={circle}
            userHasJoined={user ? user.circle.includes(circle.name) : false}
            disabled={isEditMode}
          />
        </div>
      )}
    </header>
  );
}
