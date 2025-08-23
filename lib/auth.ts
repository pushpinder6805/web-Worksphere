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

// Discourse SSO integration
export function getDiscourseLoginUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_DISCOURSE_URL || 'https://your-discourse-site.com';
  const returnUrl = encodeURIComponent(window.location.origin + '/auth/callback');
  return `${baseUrl}/session/sso_provider?return_sso_url=${returnUrl}`;
}

export function handleDiscourseCallback(params: URLSearchParams) {
  const sso = params.get('sso');
  const sig = params.get('sig');
  
  if (sso && sig) {
    // In a real implementation, you'd verify the signature server-side
    // For now, we'll decode the SSO payload (this should be done securely on your backend)
    try {
      const decoded = atob(sso);
      const ssoParams = new URLSearchParams(decoded);
      
      const user: User = {
        id: parseInt(ssoParams.get('external_id') || '0'),
        username: ssoParams.get('username') || '',
        email: ssoParams.get('email') || '',
        name: ssoParams.get('name') || '',
        avatar_url: ssoParams.get('avatar_url') || '',
      };
      
      // You would typically exchange this for a JWT token from your backend
      const token = `discourse_${user.id}_${Date.now()}`;
      
      setToken(token);
      setUser(user);
      
      return true;
    } catch (error) {
      console.error('Failed to process Discourse callback:', error);
      return false;
    }
  }
  
  return false;
}

export function logout() {
  clearToken();
  // Optionally redirect to Discourse logout
  const discourseUrl = process.env.NEXT_PUBLIC_DISCOURSE_URL;
  if (discourseUrl) {
    window.location.href = `${discourseUrl}/session/sso_provider_logout?return_url=${encodeURIComponent(window.location.origin)}`;
  }
}