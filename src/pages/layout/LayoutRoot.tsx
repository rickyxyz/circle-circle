import Header from '@/component/common/Header';
import useAuth from '@/hook/useAuth';
import useWindowSize from '@/hook/useWindowSize';
import { Outlet } from 'react-router-dom';

export default function LayoutRoot() {
  const windowSize = useWindowSize();
  const { user } = useAuth();

  const mobileLayout = (
    <>
      <Header user={user} />
      <Outlet />
    </>
  );

  const desktopLayout = (
    <>
      <Header user={user} />
      <Outlet />
    </>
  );

  return windowSize.width > 768 ? desktopLayout : mobileLayout;
}
