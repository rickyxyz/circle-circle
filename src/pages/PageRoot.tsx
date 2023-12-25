import useAuth from '@/hook/useAuth';
import { Outlet } from 'react-router-dom';

function Username() {
  const { user } = useAuth();
  return <h1>{user?.username ?? 'NULL'}</h1>;
}

function PageRoot() {
  return (
    <>
      <Username />
      <Outlet />
    </>
  );
}

export default PageRoot;
