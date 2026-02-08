import { apiFetch } from '@lib/api';
import { INTERVALS } from '@lib/constants';
import { Presence, UserStatus } from '@/types';

let presenceInterval: ReturnType<typeof setInterval> | null = null;

/**
 * Initialize presence system for a user
 */
export const initializePresence = async (
  uid: string,
  status: UserStatus = 'online',
  groupId?: string
): Promise<void> => {
  await updatePresence(uid, status, groupId);

  if (presenceInterval) {
    clearInterval(presenceInterval);
  }

  presenceInterval = setInterval(async () => {
    await updatePresence(uid, status, groupId);
  }, INTERVALS.PRESENCE_UPDATE);
};

/**
 * Update user presence
 */
export const updatePresence = async (
  uid: string,
  status: UserStatus,
  groupId?: string
): Promise<void> => {
  await apiFetch('/presence', {
    method: 'POST',
    body: JSON.stringify({ uid, status, groupId }),
  });
};

/**
 * Set typing indicator
 */
export const setTypingIndicator = async (
  uid: string,
  isTyping: boolean
): Promise<void> => {
  await apiFetch('/presence/typing', {
    method: 'POST',
    body: JSON.stringify({ uid, isTyping }),
  });
};

/**
 * Get user presence
 */
export const getUserPresence = async (uid: string): Promise<Presence | null> => {
  const data = await apiFetch<{ presence: Presence | null }>(`/presence/${uid}`, {
    method: 'GET',
  });
  return data.presence;
};

/**
 * Listen to user presence
 */
export const subscribeToUserPresence = (
  _uid: string,
  _callback: (presence: Presence | null) => void
): (() => void) => {
  return () => {};
};

/**
 * Cleanup presence system
 */
export const cleanupPresence = async (uid: string): Promise<void> => {
  if (presenceInterval) {
    clearInterval(presenceInterval);
    presenceInterval = null;
  }

  await updatePresence(uid, 'offline');
};
