export interface User {
  uid: string;
  displayName: string;
  discriminator: string; // 4-digit tag like #4839
  fullTag: string; // displayName#discriminator
  status: UserStatus;
  avatar?: string;
  createdAt: number;
  lastSeen: number;
  stats: UserStats;
}

export type UserStatus = 'online' | 'offline' | 'studying' | 'idle';

export interface UserStats {
  totalStudyTime: number; // in seconds
  todayStudyTime: number;
  weekStudyTime: number;
  streak: number;
  completedTodos: number;
}

export interface FriendRequest {
  id: string;
  from: string; // uid
  to: string; // uid
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: number;
}

export interface Friendship {
  id: string;
  users: string[]; // [uid1, uid2]
  createdAt: number;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  adminIds: string[];
  memberIds: string[];
  createdAt: number;
  updatedAt: number;
  settings: GroupSettings;
}

export interface GroupSettings {
  isPrivate: boolean;
  allowInvites: boolean;
  maxMembers: number;
}

export interface GroupMember {
  uid: string;
  role: 'admin' | 'member';
  joinedAt: number;
  presence: UserStatus;
  lastActive: number;
}

export interface Message {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  content: string;
  type: 'text' | 'image' | 'system';
  timestamp: number;
  readBy: string[]; // uids
  replyTo?: string; // message id
}

export interface DirectMessage {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: number;
  read: boolean;
}

export interface Todo {
  id: string;
  userId: string;
  groupId?: string;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: number;
  proofImageUrl?: string;
  createdAt: number;
  updatedAt: number;
  priority: 'low' | 'medium' | 'high';
  dueDate?: number;
}

export interface TimerSession {
  id: string;
  groupId: string;
  hostId: string;
  type: 'pomodoro' | 'custom';
  duration: number; // in seconds
  startTime: number;
  endTime: number;
  isActive: boolean;
  participants: string[]; // uids
  breaks: number;
  currentBreak: number;
}

export interface StudySession {
  id: string;
  userId: string;
  groupId?: string;
  startTime: number;
  endTime?: number;
  duration: number; // in seconds
  type: 'solo' | 'group';
}

export interface MediaSession {
  id: string;
  groupId: string;
  hostId: string;
  type: 'music' | 'youtube';
  isActive: boolean;
  currentTrack?: MusicTrack | YouTubeVideo;
  playbackState: 'playing' | 'paused' | 'stopped';
  currentTime: number; // in seconds
  lastSyncTime: number;
  participants: string[]; // uids
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  thumbnail?: string;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  duration: number;
  thumbnail: string;
}

export interface Presence {
  uid: string;
  status: UserStatus;
  groupId?: string;
  lastUpdated: number;
  isTyping?: boolean;
}

export interface TypingIndicator {
  groupId: string;
  userId: string;
  userName: string;
  timestamp: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'friend_request' | 'group_invite' | 'message' | 'timer' | 'todo';
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: number;
}
