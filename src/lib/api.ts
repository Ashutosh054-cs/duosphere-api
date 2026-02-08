const API_URL = import.meta.env.VITE_API_URL || '/api';

const getToken = () => localStorage.getItem('duosphere_token');

export const setToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('duosphere_token', token);
  } else {
    localStorage.removeItem('duosphere_token');
  }
};

export const apiFetch = async <T>(
  path: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Request failed');
  }

  return response.json() as Promise<T>;
};
