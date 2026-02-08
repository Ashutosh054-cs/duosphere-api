import { apiFetch, setToken } from '@lib/api';
import { User, UserStatus } from '@/types';

interface AuthResponse {
  user: User;
  token: string;
}

interface MeResponse {
  user: User | null;
}

export const signUpWithDisplayName = async (
  displayName: string,
  email: string,
  password: string
): Promise<User> => {
  const data = await apiFetch<AuthResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ displayName, email, password }),
  });
  setToken(data.token);
  return data.user;
};

export const signInWithEmail = async (email: string, password: string): Promise<User> => {
  const data = await apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  return data.user;
};

export const signOutUser = async (): Promise<void> => {
  await apiFetch('/auth/logout', { method: 'POST' });
  setToken(null);
};

export const getCurrentUser = async (): Promise<User | null> => {
  const data = await apiFetch<MeResponse>('/auth/me', { method: 'GET' });
  return data.user;
};

export const getUserData = async (uid: string): Promise<User | null> => {
  const data = await apiFetch<User>(`/users/${uid}`, { method: 'GET' });
  return data || null;
};

export const updateUserStatus = async (uid: string, status: UserStatus): Promise<void> => {
  await apiFetch(`/users/${uid}/status`, {
    method: 'POST',
    body: JSON.stringify({ status }),
  });
};

export const updateUserStats = async (uid: string, stats: Partial<User['stats']>): Promise<void> => {
  await apiFetch(`/users/${uid}/stats`, {
    method: 'POST',
    body: JSON.stringify({ stats }),
  });
};

export const searchUserByTag = async (fullTag: string): Promise<User | null> => {
  const data = await apiFetch<{ user: User | null }>(`/users/search?tag=${encodeURIComponent(fullTag)}`);
  return data.user;
};
