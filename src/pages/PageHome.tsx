import useAuth from '@/hook/useAuth';

export default function PageHome() {
  const { user } = useAuth();

  return <h3>{user ? user.username : 'NULL'}</h3>;
}
