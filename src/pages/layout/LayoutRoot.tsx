import Header from '@/component/Header';
import Navbar from '@/component/Navbar';
import OverlayProvider from '@/context/OverlayProvider';
import { useAppDispatch, useAppSelector } from '@/hook/reduxHooks';
import useAuth from '@/hook/useAuth';
import useWindowSize from '@/hook/useWindowSize';
import { sideBarClose } from '@/redux/menubarReducer';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

export default function LayoutRoot() {
  const { isMobile } = useWindowSize();
  const { user } = useAuth();
  const sidebarIsOpen = useAppSelector((state) => state.menubar.sidebarIsOpen);
  const dispatch = useAppDispatch();

  const mobileLayout = (
    <div className="flex min-h-screen flex-col">
      <Header user={user} />
      <div className="relative flex-grow">
        {sidebarIsOpen && (
          <div
            className="absolute inset-0 z-10 bg-black/50"
            onClick={() => dispatch(sideBarClose())}
          >
            <Navbar user={user} />
          </div>
        )}
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );

  const desktopLayout = (
    <div className="flex min-h-screen flex-col">
      <Header user={user} />
      <div className="grid flex-1 grid-cols-4 gap-x-4">
        <div className="col-span-1">
          <Navbar user={user} />
        </div>
        <div className="col-span-2">
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
        </div>
        <div className="col-span-1"></div>
      </div>
    </div>
  );

  return (
    <OverlayProvider>{isMobile ? mobileLayout : desktopLayout}</OverlayProvider>
  );
}
