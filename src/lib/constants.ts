// Firestore collection names
export const COLLECTIONS = {
  USERS: 'users',
  FRIEND_REQUESTS: 'friendRequests',
  FRIENDSHIPS: 'friendships',
  GROUPS: 'groups',
  GROUP_MEMBERS: 'groupMembers',
  MESSAGES: 'messages',
  DIRECT_MESSAGES: 'directMessages',
  TODOS: 'todos',
  TIMER_SESSIONS: 'timerSessions',
  STUDY_SESSIONS: 'studySessions',
  MEDIA_SESSIONS: 'mediaSessions',
  PRESENCE: 'presence',
  NOTIFICATIONS: 'notifications',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'duo_auth_token',
  USER_PREFS: 'duo_user_prefs',
  TIMER_STATE: 'duo_timer_state',
} as const;

// Timer configurations
export const TIMER_PRESETS = {
  POMODORO: {
    work: 25 * 60, // 25 minutes
    shortBreak: 5 * 60, // 5 minutes
    longBreak: 15 * 60, // 15 minutes
    cycles: 4,
  },
  SHORT: {
    work: 15 * 60,
    shortBreak: 3 * 60,
    longBreak: 10 * 60,
    cycles: 4,
  },
  LONG: {
    work: 50 * 60,
    shortBreak: 10 * 60,
    longBreak: 30 * 60,
    cycles: 3,
  },
} as const;

// Pagination limits
export const PAGINATION = {
  MESSAGES: 20,
  TODOS: 30,
  NOTIFICATIONS: 15,
  FRIENDS: 50,
  GROUPS: 20,
} as const;

// File upload limits
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
} as const;

// Status update intervals
export const INTERVALS = {
  PRESENCE_UPDATE: 30000, // 30 seconds
  TIMER_SYNC: 5000, // 5 seconds
  MEDIA_SYNC: 2000, // 2 seconds
  TYPING_TIMEOUT: 3000, // 3 seconds
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  PROFILE: '/profile',
  FRIENDS: '/friends',
  GROUPS: '/groups',
  GROUP: '/groups/:id',
  CHAT: '/chat',
  TIMER: '/timer',
  TODOS: '/todos',
  MEDIA: '/media',
  SETTINGS: '/settings',
} as const;
