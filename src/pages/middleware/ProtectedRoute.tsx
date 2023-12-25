import useAuth from '@/hook/useAuth';
import { useMemo } from 'react';
import { Outlet } from 'react-router-dom';

function ProtectedRoute() {
  const { isLoading, isLoggedIn } = useAuth();

  const Component = useMemo(() => {
    if (isLoading) {
      return 'Loading';
    } else if (isLoggedIn) {
      return <Outlet />;
    } else {
      return <h2>unauthorized</h2>;
    }
  }, [isLoading, isLoggedIn]);

  return Component;
}

export default ProtectedRoute;
