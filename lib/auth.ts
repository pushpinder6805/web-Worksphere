'use client';

export interface User {
  id: number;
  username: string;
  email: string;
  name?: string;
  avatar_url?: string;
  is_advisor?: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Auth state management
let authState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
};

let listeners: Array<(state: AuthState) => void> = [];

export function subscribeToAuth(listener: (state: AuthState) => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
}

function notifyListeners() {
  listeners.forEach(listener => listener(authState));
}

export function getAuthState(): AuthState {
  return { ...authState };
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('ws_token');
}

export function setToken(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('ws_token', token);
  authState.token = token;
  notifyListeners();
}

export function clearToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('ws_token');
  localStorage.removeItem('ws_user');
  authState = {
    user: null,
    token: null,
    isLoading: false,
    isAuthenticated: false,
  };
  notifyListeners();
}

export function setUser(user: User) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('ws_user', JSON.stringify(user));
  authState.user = user;
  authState.isAuthenticated = true;
  authState.isLoading = false;
  notifyListeners();
}

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('ws_user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

// Initialize auth state from localStorage
export function initializeAuth() {
  if (typeof window === 'undefined') return;

  const token = getToken();
  const user = getStoredUser();

  authState = {
    user,
    token,
    isLoading: false,
    isAuthenticated: !!(token && user),
  };

  notifyListeners();
}

/* ------------------------------------------------------------------
   SSO DISABLED — no redirects to Discourse, no callback handling
-------------------------------------------------------------------*/

// SSO login disabled
export function getDiscourseLoginUrl(): string {
  return "/"; // Disable SSO login completely
}

// Ignore SSO callbacks
export function handleDiscourseCallback() {
  return false; // Do not process any SSO login
}

// Logout without redirecting to Discourse
export function logout() {
  clearToken();
  // No SSO logout redirect
}
