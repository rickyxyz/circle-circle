import { OverlayContext } from '@/context/OverlayProvider';
import { useAppDispatch } from '@/hook/reduxHooks';
import { HTMLAttributes, useContext } from 'react';
import { bottombarClose, bottombarOpen } from '@/redux/menubarReducer';

export default function useOverlay() {
  const { setIsModalOpen, setModal, setBottombar } = useContext(OverlayContext);
  const dispatch = useAppDispatch();

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }
  function openBottombar() {
    dispatch(bottombarOpen());
  }

  function closeBottombar() {
    dispatch(bottombarClose());
  }

  function showModal(
    Modal: React.ComponentType<HTMLAttributes<HTMLDivElement>>,
    isMobile: boolean
  ) {
    if (isMobile) {
      setBottombar(<Modal className="h-screen pt-12" />);
      dispatch(bottombarOpen());
    } else {
      setModal(<Modal />);
      setIsModalOpen(true);
    }
  }

  return {
    openModal,
    closeModal,
    setModal,
    showModal,
    openBottombar,
    closeBottombar,
    setBottombar,
  };
}
