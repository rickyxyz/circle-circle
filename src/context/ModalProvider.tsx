import { ModalName } from '@/types/modal';
import { createContext, useState, ReactNode, ReactElement } from 'react';

interface ModalContextProps {
  children: ReactNode;
}

export interface ModalContextValue {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  modal: ReactElement | null;
  setModal: (modal: ReactElement) => void;
  openModal: (modal: ModalName) => void;
}

export const ModalContext = createContext<ModalContextValue>({
  isModalOpen: false,
  setIsModalOpen: () => {
    return;
  },
  modal: null,
  setModal: () => {
    return;
  },
  openModal: () => {
    return;
  },
});

export default function ModalProvider({ children }: ModalContextProps) {
  const [modal, setModal] = useState<ReactElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function openModal(modalName: ModalName) {
    setModal(<>{modalName}</>);
    setIsModalOpen(true);
  }

  return (
    <ModalContext.Provider
      value={{ isModalOpen, setIsModalOpen, modal, setModal, openModal }}
    >
      {isModalOpen && (
        <div
          className="absolute h-full w-full bg-slate-50 bg-opacity-30"
          onClick={() => {
            setIsModalOpen(false);
          }}
        >
          {modal}
        </div>
      )}
      {children}
    </ModalContext.Provider>
  );
}
