import Header from '@/component/common/Header';
import Sidebar from '@/component/common/Sidebar';
import { useAppDispatch, useAppSelector } from '@/hook/reduxHooks';
import useAuth from '@/hook/useAuth';
import useWindowSize from '@/hook/useWindowSize';
import { sideBarClose } from '@/redux/menubarReducer';
import Bottombar from '@/component/common/Bottombar';
import { Outlet } from 'react-router-dom';

export default function LayoutRoot() {
  const windowSize = useWindowSize();
  const { user } = useAuth();
  const sidebarIsOpen = useAppSelector((state) => state.menubar.sidebarIsOpen);
  const bottombarIsOpen = useAppSelector(
    (state) => state.menubar.bottombarIsOpen
  );
  const dispatch = useAppDispatch();

  const mobileLayout = (
    <div className="flex flex-col">
      <Header user={user} />
      <div className="relative">
        {sidebarIsOpen && (
          <div
            className="absolute inset-0 z-10 bg-black/50"
            onClick={() => dispatch(sideBarClose())}
          >
            <Sidebar user={user} />
          </div>
        )}
        <Outlet />
      </div>
      {bottombarIsOpen && <Bottombar />}
    </div>
  );

  const desktopLayout = (
    <>
      <Header user={user} />
      <Outlet />
    </>
  );

  return windowSize.width > 768 ? desktopLayout : mobileLayout;
}
