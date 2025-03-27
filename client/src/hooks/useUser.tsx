import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  profileImageUrl: string;
  points: number;
  coins: number;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: false,
  error: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  refetch: () => {}
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shouldRefetch, setShouldRefetch] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
        });

        if (!response.ok) {
          if (response.status === 401) {
            // User is not authenticated, but this is not an error
            setUser(null);
            setError(null);
            return;
          }
          throw new Error('Failed to fetch user');
        }

        const data = await response.json();
        setUser(data.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [shouldRefetch]);

  const refetch = () => {
    setShouldRefetch((prev) => prev + 1);
  };

  return (
    <UserContext.Provider value={{ user, isLoading, error, refetch }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
}; 