'use client';

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

function getBase() {
  const envBase = process.env.NEXT_PUBLIC_API_BASE;
  if (!envBase) throw new Error('Missing NEXT_PUBLIC_API_BASE');
  return envBase.replace(/\/$/, '');
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('ws_token');
}

export function setToken(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('ws_token', token);
}

export function clearToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('ws_token');
}

export async function api<T=any>(path: string, options: { method?: HttpMethod, body?: any, token?: string | null, headers?: Record<string,string> } = {}): Promise<T> {
  const base = getBase();
  const url = path.startsWith('http') ? path : `${base}${path}`;
  const token = options.token ?? getToken() ?? (process.env.NEXT_PUBLIC_API_TOKEN || '');
  const headers: Record<string,string> = {
    'Accept': 'application/json',
    ...(options.body ? {'Content-Type': 'application/json'} : {}),
    ...(token ? {'Authorization': `Bearer ${token}`} : {}),
    ...(options.headers || {}),
  };
  const res = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: 'no-store',
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} for ${path}: ${text}`);
  }
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json() as Promise<T>;
  return (await res.text()) as any as T;
}

// Convenience wrappers
export const get = <T=any>(path: string, token?: string | null) => api<T>(path, { method: 'GET', token });
export const post = <T=any>(path: string, body?: any, token?: string | null) => api<T>(path, { method: 'POST', body, token });
export const patch = <T=any>(path: string, body?: any, token?: string | null) => api<T>(path, { method: 'PATCH', body, token });
export const del = <T=any>(path: string, token?: string | null) => api<T>(path, { method: 'DELETE', token });
