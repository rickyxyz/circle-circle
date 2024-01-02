import { ModalContext } from '@/context/ModalProvider';
import { useContext } from 'react';

export default function useModal() {
  const { setIsModalOpen, openModal, isModalOpen } = useContext(ModalContext);

  function closeModal() {
    setIsModalOpen(false);
  }

  function toggleModal() {
    setIsModalOpen(!isModalOpen);
  }

  return { openModal, closeModal, toggleModal };
}
