import { TimerSession, StudySession } from '@/types';

export const createTimerSession = async (
  _groupId: string,
  _hostId: string,
  _duration: number,
  _type: TimerSession['type'] = 'pomodoro'
): Promise<TimerSession> => {
  throw new Error('Timer session creation is not implemented yet');
};

export const getActiveTimerSession = async (_groupId: string): Promise<TimerSession | null> => {
  return null;
};

export const joinTimerSession = async (_groupId: string, _userId: string): Promise<void> => {
  return;
};

export const leaveTimerSession = async (_groupId: string, _userId: string): Promise<void> => {
  return;
};

export const updateTimerSession = async (
  _groupId: string,
  _updates: Partial<TimerSession>
): Promise<void> => {
  return;
};

export const endTimerSession = async (_groupId: string): Promise<void> => {
  return;
};

export const subscribeToTimerSession = (
  _groupId: string,
  _callback: (session: TimerSession | null) => void
): (() => void) => {
  return () => {};
};

export const recordStudySession = async (
  _userId: string,
  _duration: number,
  _groupId?: string
): Promise<StudySession> => {
  throw new Error('Study session tracking is not implemented yet');
};

export const getUserStudySessions = async (_userId: string): Promise<StudySession[]> => {
  return [];
};
