import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

export interface GameBoost {
  id: string;
  type: 'superDistributor' | 'superAutomator' | 'followX' | 'rtPost' | 'connectGenesis' | 'connectSuperseed';
  level?: 1 | 2 | 3;
  unlocked: boolean;
  lastUsed?: number; // timestamp when last used (for cooldown)
  usageCount?: number; // number of times the boost has been used
}

export interface User {
  id: string;
  username: string;
  profileImageUrl: string;
  points: number;
  coins: number;
  gamesPlayed?: number;
  gamesWon?: number;
  boosts?: GameBoost[];
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: () => void;
  logout: () => void;
  fetchUser: () => Promise<void>;
  buyBoost: (boostType: string, level: number) => Promise<{success: boolean; error?: string}>;
  useBoost: (boostType: string, level?: number) => Promise<{success: boolean; error?: string; reward?: number}>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// API URLs
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const AUTH_URL = `${API_URL}/auth`;
const BOOST_URL = `${API_URL}/boosts`;

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

  // Buy a boost
  const buyBoost = async (boostType: string, level: number): Promise<{success: boolean; error?: string}> => {
    try {
      const response = await axios.post(`${BOOST_URL}/buy`, {
        type: boostType,
        level
      }, { withCredentials: true });
      
      if (response.data.success) {
        await fetchUser(); // Refresh user data
        return { success: true };
      }
      return { success: false, error: response.data.error || 'Failed to buy boost' };
    } catch (err) {
      console.error('Error buying boost:', err);
      let errorMsg = 'An unknown error occurred';
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        errorMsg = err.response.data.error;
      }
      return { success: false, error: errorMsg };
    }
  };

  // Use a boost
  const useBoost = async (boostType: string, level?: number): Promise<{success: boolean; error?: string; reward?: number}> => {
    try {
      const response = await axios.post(`${BOOST_URL}/use`, {
        type: boostType,
        level
      }, { withCredentials: true });
      
      if (response.data.success) {
        await fetchUser(); // Refresh user data
        
        // If there's reward data, include it in the response
        if (response.data.data && response.data.data.reward) {
          return { 
            success: true,
            reward: response.data.data.reward
          };
        }
        
        return { success: true };
      }
      return { success: false, error: response.data.error || 'Failed to use boost' };
    } catch (err) {
      console.error('Error using boost:', err);
      let errorMsg = 'An unknown error occurred';
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        errorMsg = err.response.data.error;
      }
      return { success: false, error: errorMsg };
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    fetchUser,
    buyBoost,
    useBoost
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