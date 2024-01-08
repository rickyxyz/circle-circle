import { useAppSelector, useAppDispatch } from '@/hook/reduxHooks';
import { createContext, useState, ReactNode, ReactElement } from 'react';
import { bottombarClose } from '@/redux/menubarReducer';

interface OverlayContextProps {
  children: ReactNode;
}

export interface OverlayContextValue {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  modal: ReactElement | null;
  setModal: (modal: ReactElement) => void;
  bottombar: ReactElement | null;
  setBottombar: (modal: ReactElement) => void;
}

export const OverlayContext = createContext<OverlayContextValue>({
  isModalOpen: false,
  setIsModalOpen: () => {
    return;
  },
  modal: null,
  setModal: () => {
    return;
  },
  bottombar: null,
  setBottombar: () => {
    return;
  },
});

export default function OverlayProvider({ children }: OverlayContextProps) {
  const [modal, setModal] = useState<ReactElement | null>(null);
  const [bottombar, setBottombar] = useState<ReactElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isBottombarOpen = useAppSelector(
    (state) => state.menubar.bottombarIsOpen
  );
  const dispatch = useAppDispatch();

  return (
    <OverlayContext.Provider
      value={{
        isModalOpen,
        setIsModalOpen,
        modal,
        setModal,
        bottombar,
        setBottombar,
      }}
    >
      {isModalOpen && (
        <div
          className="absolute z-50 flex h-full w-full items-center justify-center bg-black/25"
          onClick={() => {
            setIsModalOpen(false);
          }}
        >
          {modal}
        </div>
      )}
      {isBottombarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/25"
            onClick={() => dispatch(bottombarClose())}
          />
          <div className="fixed bottom-0 left-0 z-50 flex w-full flex-col items-center rounded-t-2xl border-t border-gray-200 bg-white p-4">
            {bottombar}
          </div>
        </>
      )}
      {children}
    </OverlayContext.Provider>
  );
}
