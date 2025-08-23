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
