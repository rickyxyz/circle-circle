import useWindowSize from '@/hook/useWindowSize';
import { Outlet } from 'react-router-dom';

export default function LayoutCentered() {
  const windowSize = useWindowSize();

  const mobileLayout = (
    <div className="flex min-h-screen w-screen items-center justify-center">
      <Outlet />
    </div>
  );

  const desktopLayout = (
    <div className="flex min-h-screen items-center justify-center">
      <Outlet />
    </div>
  );

  return windowSize.width > 768 ? desktopLayout : mobileLayout;
}
