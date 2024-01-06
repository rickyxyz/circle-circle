import { ModalContext } from '@/context/ModalProvider';
import { useContext } from 'react';

export default function useModal() {
  const { setIsModalOpen, isModalOpen, setModal } = useContext(ModalContext);

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function toggleModal() {
    setIsModalOpen(!isModalOpen);
  }

  return { openModal, closeModal, toggleModal, setModal };
}
