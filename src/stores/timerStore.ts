import { create } from 'zustand';
import { TimerSession, StudySession } from '@/types';

interface TimerState {
  activeSession: TimerSession | null;
  studySessions: StudySession[];
  timeRemaining: number;
  isRunning: boolean;
  isPaused: boolean;
  currentPhase: 'work' | 'break';
  loading: boolean;

  setActiveSession: (session: TimerSession | null) => void;
  setTimeRemaining: (time: number) => void;
  setIsRunning: (isRunning: boolean) => void;
  setIsPaused: (isPaused: boolean) => void;
  setCurrentPhase: (phase: 'work' | 'break') => void;
  addStudySession: (session: StudySession) => void;
  tick: () => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  reset: () => void;
}

export const useTimerStore = create<TimerState>((set) => ({
  activeSession: null,
  studySessions: [],
  timeRemaining: 0,
  isRunning: false,
  isPaused: false,
  currentPhase: 'work',
  loading: false,

  setActiveSession: (session) =>
    set({
      activeSession: session,
      timeRemaining: session ? session.duration : 0,
    }),

  setTimeRemaining: (time) => set({ timeRemaining: time }),

  setIsRunning: (isRunning) => set({ isRunning }),

  setIsPaused: (isPaused) => set({ isPaused }),

  setCurrentPhase: (phase) => set({ currentPhase: phase }),

  addStudySession: (session) =>
    set((state) => ({
      studySessions: [...state.studySessions, session],
    })),

  tick: () =>
    set((state) => {
      if (state.isRunning && !state.isPaused && state.timeRemaining > 0) {
        return { timeRemaining: state.timeRemaining - 1 };
      }
      return state;
    }),

  start: () => set({ isRunning: true, isPaused: false }),

  pause: () => set({ isPaused: true }),

  resume: () => set({ isPaused: false }),

  stop: () =>
    set({
      isRunning: false,
      isPaused: false,
      timeRemaining: 0,
      activeSession: null,
    }),

  reset: () =>
    set({
      activeSession: null,
      timeRemaining: 0,
      isRunning: false,
      isPaused: false,
      currentPhase: 'work',
    }),
}));
