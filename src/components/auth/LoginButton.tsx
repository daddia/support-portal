'use client';

import React, { useEffect } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { useAuth } from '@/context/AuthContext';

const LoginButton: React.FC = () => {
  const { user, isLoading, login } = useAuth();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'AUTH_SUCCESS') {
        localStorage.setItem('atlassian_user', JSON.stringify(event.data.user));
        window.location.reload();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (isLoading) {
    return <CircularProgress size={24} />;
  }

  if (user) {
    return null; // Don't show login button if user is already logged in
  }

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={login}
      startIcon={<img src="/atlassian-logo.svg" alt="Atlassian" height={20} />}
    >
      Sign in with Atlassian
    </Button>
  );
};

export default LoginButton; 