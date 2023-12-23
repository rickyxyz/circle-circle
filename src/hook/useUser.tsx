import { useContext } from 'react';
import { AuthContext } from '@/context/AuthProvider';

export default function useUser() {
  const { user } = useContext(AuthContext);

  return { user };
}
