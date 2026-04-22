import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

interface User {
  username: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await api.auth.me();
        if (data) {
          setUser({
            username: data.Name || data.name || data.username,
            email: data.Email || data.email
          });
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await api.auth.login(email, password);
    const userData = data.User || data.user;
    if (userData) {
      setUser({
        username: userData.Name || userData.name || userData.username,
        email: userData.Email || userData.email
      });
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    const data = await api.auth.signup(username, email, password);
    const userData = data.User || data.user;
    if (userData) {
      setUser({
        username: userData.Name || userData.name || userData.username,
        email: userData.Email || userData.email
      });
    }
  };

  const logout = async () => {
    await api.auth.revoke();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
