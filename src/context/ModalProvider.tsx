import { createContext, useState, ReactNode, ReactElement } from 'react';

interface ModalContextProps {
  children: ReactNode;
}

export interface ModalContextValue {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  modal: ReactElement | null;
  setModal: (modal: ReactElement) => void;
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
});

export default function ModalProvider({ children }: ModalContextProps) {
  const [modal, setModal] = useState<ReactElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <ModalContext.Provider
      value={{ isModalOpen, setIsModalOpen, modal, setModal }}
    >
      {isModalOpen && (
        <div
          className="absolute z-50 flex h-full w-full items-center justify-center bg-black/35"
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
