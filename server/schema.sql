-- Users
CREATE TABLE IF NOT EXISTS users (
  uid TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  discriminator TEXT NOT NULL,
  full_tag TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'offline',
  avatar TEXT,
  created_at INTEGER NOT NULL,
  last_seen INTEGER NOT NULL,
  total_study_time INTEGER NOT NULL DEFAULT 0,
  today_study_time INTEGER NOT NULL DEFAULT 0,
  week_study_time INTEGER NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 0,
  completed_todos INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_users_display_disc ON users(display_name, discriminator);
CREATE INDEX IF NOT EXISTS idx_users_full_tag ON users(full_tag);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- Sessions (simple token auth)
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  uid TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessions_uid ON sessions(uid);

-- Groups
CREATE TABLE IF NOT EXISTS groups (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  is_private INTEGER NOT NULL DEFAULT 1,
  allow_invites INTEGER NOT NULL DEFAULT 1,
  max_members INTEGER NOT NULL DEFAULT 50
);

CREATE TABLE IF NOT EXISTS group_members (
  group_id TEXT NOT NULL,
  uid TEXT NOT NULL,
  role TEXT NOT NULL,
  joined_at INTEGER NOT NULL,
  presence TEXT NOT NULL DEFAULT 'online',
  last_active INTEGER NOT NULL,
  PRIMARY KEY (group_id, uid),
  FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
  FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_group_members_uid ON group_members(uid);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  group_id TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'text',
  timestamp INTEGER NOT NULL,
  reply_to TEXT,
  FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(uid) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_messages_group_time ON messages(group_id, timestamp);

-- Todos
CREATE TABLE IF NOT EXISTS todos (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  group_id TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0,
  completed_at INTEGER,
  proof_image_url TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium',
  due_date INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(uid) ON DELETE CASCADE,
  FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_todos_user_time ON todos(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_todos_group_time ON todos(group_id, created_at);

-- Presence
CREATE TABLE IF NOT EXISTS presence (
  uid TEXT PRIMARY KEY,
  status TEXT NOT NULL,
  group_id TEXT,
  last_updated INTEGER NOT NULL,
  is_typing INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_presence_status ON presence(status);
CREATE INDEX IF NOT EXISTS idx_presence_group_status ON presence(group_id, status);
