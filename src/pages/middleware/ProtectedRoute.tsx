import useAuth from '@/hook/useAuth';
import { useMemo } from 'react';
import { Outlet } from 'react-router-dom';

function ProtectedRoute() {
  const { isLoggedIn } = useAuth();

  const Component = useMemo(() => {
    if (isLoggedIn) {
      return <Outlet />;
    } else {
      return <h2>unauthorized</h2>;
    }
  }, [isLoggedIn]);

  return Component;
}

export default ProtectedRoute;
