import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

export interface User {
  id: string;
  username: string;
  profileImageUrl: string;
  points: number;
  coins: number;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: () => void;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// API URLs
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const AUTH_URL = `${API_URL}/auth`;

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize user on component mount
  useEffect(() => {
    fetchUser();
  }, []);

  // Fetch the current user from the API
  const fetchUser = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${AUTH_URL}/me`, { withCredentials: true });
      
      if (response.data.success) {
        setUser(response.data.data);
      } else {
        setUser(null);
      }
    } catch (err) {
      // If 401 or other error, user is not authenticated
      setUser(null);
      
      // Only set error for non-auth errors
      if (axios.isAxiosError(err) && err.response?.status !== 401) {
        setError('Failed to fetch user data');
        console.error('Error fetching user:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Redirect to X (Twitter) login page
  const login = () => {
    window.location.href = `${AUTH_URL}/x`;
  };

  // Logout user
  const logout = async () => {
    try {
      setLoading(true);
      await axios.post(`${AUTH_URL}/logout`, {}, { withCredentials: true });
      setUser(null);
    } catch (err) {
      console.error('Error logging out:', err);
      setError('Failed to logout');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    fetchUser
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook to use the user context
export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
}; 