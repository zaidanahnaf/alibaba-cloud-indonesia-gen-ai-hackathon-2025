import { useEffect, useState } from 'react';
import { getUserById } from '../provider/userProvider';

interface UserData {
  id: string;
  username: string;
  email: string;
}

export const useGetUser = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userFromStorage = localStorage.getItem('user');
        if (!userFromStorage) {
          setError('User tidak ditemukan di localStorage');
          return;
        }

        const parsedUser = JSON.parse(userFromStorage);

        setUser(parsedUser);
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan saat mengambil data user');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
};
