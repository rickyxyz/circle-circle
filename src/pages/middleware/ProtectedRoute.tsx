import { useMemo } from 'react';
import { Outlet, useLoaderData } from 'react-router-dom';

function ProtectedRoute() {
  const { isLoggedIn } = useLoaderData() as { isLoggedIn: boolean };

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
