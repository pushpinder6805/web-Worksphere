'use client';

import { getToken as authGetToken } from './auth';

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

function getBase() {
  const envBase = process.env.NEXT_PUBLIC_API_BASE;
  if (!envBase) throw new Error('Missing NEXT_PUBLIC_API_BASE');
  return envBase.replace(/\/$/, '');
}

export async function api<T = any>(
  path: string,
  options: { method?: HttpMethod; body?: any; token?: string | null } = {}
): Promise<T> {
  const token = options.token ?? authGetToken();

  const res = await fetch(`${getBase()}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

// ✅ Convenience helpers
export const get = <T = any>(path: string, token?: string | null) =>
  api<T>(path, { method: 'GET', token });

export const post = <T = any>(path: string, body: any, token?: string | null) =>
  api<T>(path, { method: 'POST', body, token });

export const patch = <T = any>(path: string, body: any, token?: string | null) =>
  api<T>(path, { method: 'PATCH', body, token });

export const del = <T = any>(path: string, token?: string | null) =>
  api<T>(path, { method: 'DELETE', token });
