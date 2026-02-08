import { create } from 'zustand';
import { MediaSession } from '@/types';

interface MediaState {
  activeSession: MediaSession | null;
  isHost: boolean;
  loading: boolean;

  setActiveSession: (session: MediaSession | null) => void;
  setIsHost: (isHost: boolean) => void;
  updatePlaybackState: (state: MediaSession['playbackState']) => void;
  updateCurrentTime: (time: number) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useMediaStore = create<MediaState>((set) => ({
  activeSession: null,
  isHost: false,
  loading: false,

  setActiveSession: (session) => set({ activeSession: session }),

  setIsHost: (isHost) => set({ isHost }),

  updatePlaybackState: (state) =>
    set((prev) => ({
      activeSession: prev.activeSession
        ? { ...prev.activeSession, playbackState: state, lastSyncTime: Date.now() }
        : null,
    })),

  updateCurrentTime: (time) =>
    set((prev) => ({
      activeSession: prev.activeSession
        ? { ...prev.activeSession, currentTime: time, lastSyncTime: Date.now() }
        : null,
    })),

  setLoading: (loading) => set({ loading }),

  reset: () =>
    set({
      activeSession: null,
      isHost: false,
      loading: false,
    }),
}));
