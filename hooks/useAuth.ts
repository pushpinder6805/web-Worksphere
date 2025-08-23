'use client';

import { useEffect, useState } from 'react';
import { AuthState, getAuthState, subscribeToAuth, initializeAuth } from '@/lib/auth';

export function useAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>(getAuthState());

  useEffect(() => {
    // Initialize auth on mount
    initializeAuth();
    setAuthState(getAuthState());

    // Subscribe to auth changes
    const unsubscribe = subscribeToAuth(setAuthState);
    return unsubscribe;
  }, []);

  return authState;
}