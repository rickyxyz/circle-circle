import CircleJoinButton from '@/component/common/CircleJoinButton';
import { FaPlus } from 'react-icons/fa6';
import { Circle } from '@/types/db';
import ButtonWithIcon from '@/component/common/ButtonWithIcon';
import { GoKebabHorizontal } from 'react-icons/go';
import DropdownList from '@/component/common/DropdownList';
import useOverlay from '@/hook/useOverlay';
import useWindowSize from '@/hook/useWindowSize';
import PostCreateModal from '@/component/modal/PostCreateModal';
import { cva, VariantProps } from 'class-variance-authority';
import useAuth from '@/hook/useAuth';

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
  const { setModal, setBottombar, openBottombar, openModal } = useOverlay();
  const { isMobile } = useWindowSize();
  const { user } = useAuth();

  function showPostCreateForm() {
    if (isMobile) {
      setBottombar(<PostCreateModal className="h-screen pt-12" />);
      openBottombar();
    } else {
      setModal(<PostCreateModal />);
      openModal();
    }
  }

  return (
    <header className="flex flex-col gap-3 bg-white p-4">
      <div className="flex flex-row gap-2">
        <div>
          {/* TODO: add icon image here */}
          <img
            src="/profile_placeholder.svg"
            alt="circle"
            className="h-12 md:h-16"
          />
        </div>
        <div className="flex flex-1 flex-col justify-end gap-1">
          <h1 className="text-xl font-bold leading-4 md:text-3xl md:leading-6">
            {circle.name}
          </h1>
          <p className="text-sm text-gray-500">123 members</p>
        </div>
        <DropdownList
          className="self-start p-0"
          triggerComponent={<GoKebabHorizontal />}
          dropdownList={[
            {
              text: 'edit',
              onClick: () => {
                return;
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
      </div>
      <div className="flex flex-row items-center gap-2 md:self-end">
        {(!user || isMobile) && (
          <ButtonWithIcon icon={<FaPlus />} onClick={showPostCreateForm}>
            Create A Post
          </ButtonWithIcon>
        )}
        <CircleJoinButton
          circle={circle}
          userHasJoined={user ? user.circle.includes(circle.name) : false}
        />
      </div>
    </header>
  );
}
