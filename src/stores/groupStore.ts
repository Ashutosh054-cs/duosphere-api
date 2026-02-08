import { create } from 'zustand';
import { Group, GroupMember } from '@/types';

interface GroupState {
  groups: Group[];
  activeGroup: Group | null;
  members: Record<string, GroupMember[]>; // groupId -> members[]
  loading: boolean;
  error: string | null;

  setGroups: (groups: Group[]) => void;
  addGroup: (group: Group) => void;
  updateGroup: (groupId: string, updates: Partial<Group>) => void;
  removeGroup: (groupId: string) => void;
  setActiveGroup: (group: Group | null) => void;
  setMembers: (groupId: string, members: GroupMember[]) => void;
  updateMemberPresence: (groupId: string, uid: string, presence: GroupMember['presence']) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useGroupStore = create<GroupState>((set) => ({
  groups: [],
  activeGroup: null,
  members: {},
  loading: false,
  error: null,

  setGroups: (groups) => set({ groups }),

  addGroup: (group) =>
    set((state) => ({
      groups: [...state.groups, group],
    })),

  updateGroup: (groupId, updates) =>
    set((state) => ({
      groups: state.groups.map((g) =>
        g.id === groupId ? { ...g, ...updates, updatedAt: Date.now() } : g
      ),
      activeGroup:
        state.activeGroup?.id === groupId
          ? { ...state.activeGroup, ...updates, updatedAt: Date.now() }
          : state.activeGroup,
    })),

  removeGroup: (groupId) =>
    set((state) => ({
      groups: state.groups.filter((g) => g.id !== groupId),
      activeGroup: state.activeGroup?.id === groupId ? null : state.activeGroup,
    })),

  setActiveGroup: (group) => set({ activeGroup: group }),

  setMembers: (groupId, members) =>
    set((state) => ({
      members: { ...state.members, [groupId]: members },
    })),

  updateMemberPresence: (groupId, uid, presence) =>
    set((state) => ({
      members: {
        ...state.members,
        [groupId]: state.members[groupId]?.map((m) =>
          m.uid === uid ? { ...m, presence, lastActive: Date.now() } : m
        ) || [],
      },
    })),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  reset: () =>
    set({
      groups: [],
      activeGroup: null,
      members: {},
      loading: false,
      error: null,
    }),
}));
