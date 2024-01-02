import useAuth from '@/hook/useAuth';
import RegisterForm from '@/component/form/RegisterForm';
import LoginForm from '@/component/form/LoginForm';

function LogoutButton() {
  const { logout } = useAuth();

  function handleLogout() {
    logout();
  }

  return (
    <button
      onClick={handleLogout}
      className="mx-auto mt-8 block rounded-md bg-blue-500 p-2 text-white hover:bg-blue-700"
    >
      Logout
    </button>
  );
}

function PageAuth() {
  return (
    <>
      <RegisterForm />
      <LoginForm />
      <LogoutButton />
    </>
  );
}

export default PageAuth;
