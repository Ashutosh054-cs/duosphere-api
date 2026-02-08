import { apiFetch } from '@lib/api';
import { Group, GroupMember, GroupSettings } from '@/types';

export const createGroup = async (
  name: string,
  description: string,
  _adminId: string,
  settings?: Partial<GroupSettings>
): Promise<Group> => {
  const data = await apiFetch<{ group: Group }>('/groups', {
    method: 'POST',
    body: JSON.stringify({ name, description, settings }),
  });
  return data.group;
};

export const getGroup = async (groupId: string): Promise<Group | null> => {
  const data = await apiFetch<{ group: Group }>(`/groups/${groupId}`, {
    method: 'GET',
  });
  return data.group || null;
};

export const getUserGroups = async (_uid: string): Promise<Group[]> => {
  const data = await apiFetch<{ groups: Group[] }>('/groups', { method: 'GET' });
  return data.groups || [];
};

export const updateGroup = async (_groupId: string, _updates: Partial<Group>): Promise<void> => {
  return;
};

export const deleteGroup = async (_groupId: string): Promise<void> => {
  return;
};

export const addGroupMember = async (
  _groupId: string,
  _uid: string,
  _role: 'admin' | 'member' = 'member'
): Promise<void> => {
  return;
};

export const removeGroupMember = async (_groupId: string, _uid: string): Promise<void> => {
  return;
};

export const getGroupMembers = async (_groupId: string): Promise<GroupMember[]> => {
  return [];
};

export const updateMemberPresence = async (
  _groupId: string,
  _uid: string,
  _presence: GroupMember['presence']
): Promise<void> => {
  return;
};

export const subscribeToGroup = (
  _groupId: string,
  _callback: (group: Group) => void
): (() => void) => {
  return () => {};
};

export const subscribeToGroupMembers = (
  _groupId: string,
  _callback: (members: GroupMember[]) => void
): (() => void) => {
  return () => {};
};
