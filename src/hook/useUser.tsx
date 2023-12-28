import { useContext } from 'react';
import { AuthContext } from '@/context/AuthProvider';
import { User } from '@/types/db';
import { updateData } from '@/lib/firebase/firestore';

export default function useUser() {
  const { user, setUser } = useContext(AuthContext);

  async function updateProfile(newUser: Partial<User>) {
    if (!user) throw new Error('User is undefined.');
    await updateData('user', user.uid, newUser).then(() =>
      setUser({ ...user, ...newUser })
    );
  }

  return { user, setUser, updateProfile };
}
