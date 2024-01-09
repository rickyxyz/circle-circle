import PostCreateForm from '@/component/form/PostCreateForm';
import useOverlay from '@/hook/useOverlay';
import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';
import { FaXmark } from 'react-icons/fa6';
import { useNavigate, useParams } from 'react-router-dom';

export default function PostCreateModal({
  className,
}: HTMLAttributes<HTMLDivElement>) {
  const { closeModal, closeBottombar } = useOverlay();
  const navigate = useNavigate();
  const params = useParams();

  return (
    <div
      className={cn(
        'container flex flex-col gap-4 rounded-md bg-white p-4 lg:max-w-md',
        className
      )}
      onClick={(e) => e.stopPropagation()}
      data-testid={'modal'}
    >
      <div className="flex flex-row items-center justify-between">
        <span className="text-lg font-bold">Create A Circle</span>
        <button
          onClick={() => {
            closeModal();
            closeBottombar();
          }}
        >
          <FaXmark size={18} />
        </button>
      </div>
      <hr />
      <PostCreateForm
        circleId={params.circleId ?? ''}
        onSuccessCallback={(postId) => {
          closeModal();
          closeBottombar();
          navigate(`/c/${params.circleId}/p/${postId}`);
        }}
      />
    </div>
  );
}
