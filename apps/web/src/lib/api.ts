const base = () => process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${base()}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  const text = await res.text();
  const data = text ? (JSON.parse(text) as unknown) : null;
  if (!res.ok) {
    const err = data as { message?: string | string[]; statusCode?: number } | null;
    const msg =
      typeof err?.message === 'string'
        ? err.message
        : Array.isArray(err?.message)
          ? err.message.join(', ')
          : res.statusText;
    throw new Error(msg || `Request failed (${res.status})`);
  }
  return data as T;
}
