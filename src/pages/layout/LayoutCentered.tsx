import { Outlet } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Button from '@/component/common/Button';
import { Suspense } from 'react';

export default function LayoutCentered() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Button className="absolute left-3 top-5 aspect-square" to="-1">
        <FaArrowLeft />
      </Button>
      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>
    </div>
  );
}
