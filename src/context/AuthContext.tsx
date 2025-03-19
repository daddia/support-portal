'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AUTH_CONFIG } from '@/config/auth';

interface AtlassianUser {
  id: string;
  name: string;
  email: string;
  picture: string;
  accessToken: string;
  cloudId: string;
}

interface AuthContextType {
  user: AtlassianUser | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AtlassianUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('atlassian_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = () => {
    const params = new URLSearchParams({
      audience: 'api.atlassian.com',
      client_id: AUTH_CONFIG.clientId,
      scope: AUTH_CONFIG.scopes,
      redirect_uri: AUTH_CONFIG.redirectUri,
      response_type: 'code',
      prompt: 'consent',
    });

    window.location.href = `${AUTH_CONFIG.authUrl}?${params.toString()}`;
  };

  const logout = () => {
    localStorage.removeItem('atlassian_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 