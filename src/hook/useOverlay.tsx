import { OverlayContext } from '@/context/OverlayProvider';
import { useAppDispatch } from '@/hook/reduxHooks';
import { useContext } from 'react';
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

  return {
    openModal,
    closeModal,
    setModal,
    openBottombar,
    closeBottombar,
    setBottombar,
  };
}
