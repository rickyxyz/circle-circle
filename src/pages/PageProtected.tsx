import useAuth from '@/hook/useAuth';

function LogoutButton() {
  const { logout } = useAuth();

  function handleLogout() {
    logout();
  }

  return <button onClick={handleLogout}>logout</button>;
}

function PageProtected() {
  return (
    <>
      <h2>authorized</h2>
      <LogoutButton />
    </>
  );
}

export default PageProtected;
