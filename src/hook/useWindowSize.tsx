import { useAppDispatch } from '@/hook/reduxHooks';
import { useEffect, useState } from 'react';
import { sideBarClose } from '@/redux/menubarReducer';
import useOverlay from '@/hook/useOverlay';

const useWindowSize = () => {
  const isSSR = typeof window === 'undefined';
  const [windowSize, setWindowSize] = useState({
    width: isSSR ? 1200 : window.innerWidth,
    height: isSSR ? 800 : window.innerHeight,
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const dispatch = useAppDispatch();
  const { closeBottombar, closeModal } = useOverlay();

  useEffect(() => {
    function changeWindowSize() {
      setWindowSize({ width: window.innerWidth, height: window.innerWidth });
      setIsMobile(window.innerWidth < 768);
      if (window.innerHeight < 768) {
        dispatch(sideBarClose());
        closeModal();
        closeBottombar();
      }
    }

    window.addEventListener('resize', changeWindowSize);

    return () => {
      window.removeEventListener('resize', changeWindowSize);
    };
  }, [closeBottombar, closeModal, dispatch]);

  return { windowSize, isMobile };
};

export default useWindowSize;
