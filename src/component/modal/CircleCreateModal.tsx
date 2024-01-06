import CircleCreateForm from '@/component/form/CircleCreateForm';
import useModal from '@/hook/useModal';
import { Circle } from '@/types/db';
import { FaXmark } from 'react-icons/fa6';

interface CircleCreateModalProps {
  onSuccessCallback?: (newCircle: Circle) => void;
}

export default function CircleCreateModal({
  onSuccessCallback,
}: CircleCreateModalProps) {
  const { closeModal } = useModal();

  return (
    <div
      className="container flex flex-col gap-4 rounded-md bg-white p-4 lg:max-w-md"
      onClick={(e) => e.stopPropagation()}
      data-testid={'modal'}
    >
      <div className="flex flex-row items-center justify-between">
        <span className="text-lg font-bold">Create A Circle</span>
        <button onClick={closeModal}>
          <FaXmark size={18} />
        </button>
      </div>
      <hr />
      <CircleCreateForm onSuccessCallback={onSuccessCallback} />
    </div>
  );
}
