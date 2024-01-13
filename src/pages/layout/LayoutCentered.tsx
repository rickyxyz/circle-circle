import { Outlet } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Button from '@/component/common/Button';

export default function LayoutCentered() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Button className="absolute left-3 top-5 aspect-square" to="-1">
        <FaArrowLeft />
      </Button>
      <Outlet />
    </div>
  );
}
