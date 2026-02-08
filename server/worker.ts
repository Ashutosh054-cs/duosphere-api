import { Hono } from 'hono';
import type { Context } from 'hono';
import type { D1Database } from '@cloudflare/workers-types';
import { cors } from 'hono/cors';
import { Env, json, now } from './db';

type AppEnv = { Bindings: Env };
const app = new Hono<AppEnv>();

app.use('/api/*', cors());

const textEncoder = new TextEncoder();

const hashPassword = async (password: string, salt: string) => {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    textEncoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: textEncoder.encode(salt),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );

  return btoa(String.fromCharCode(...new Uint8Array(derivedBits)));
};

const generateDiscriminator = () => Math.floor(1000 + Math.random() * 9000).toString();

const generateUniqueTag = async (db: D1Database, displayName: string) => {
  let attempts = 0;
  while (attempts < 10) {
    const discriminator = generateDiscriminator();
    const fullTag = `${displayName}#${discriminator}`;
    const existing = await db
      .prepare('SELECT uid FROM users WHERE full_tag = ?')
      .bind(fullTag)
      .first();
    if (!existing) {
      return { discriminator, fullTag };
    }
    attempts++;
  }
  throw new Error('Could not generate unique discriminator');
};

const getAuthUser = async (c: Context<AppEnv>) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.replace('Bearer ', '');

  const session = (await c.env.DB
    .prepare('SELECT uid, expires_at FROM sessions WHERE token = ?')
    .bind(token)
    .first()) as { uid: string; expires_at: number } | null;

  if (!session || session.expires_at < now()) return null;

  const user = await c.env.DB
    .prepare('SELECT * FROM users WHERE uid = ?')
    .bind(session.uid)
    .first();

  return user || null;
};

// Auth
app.post('/api/auth/signup', async (c) => {
  const { displayName, email, password } = await c.req.json();

  if (!displayName || !email || !password) {
    return json({ error: 'Missing required fields' }, 400);
  }

  const existing = await c.env.DB
    .prepare('SELECT uid FROM users WHERE email = ?')
    .bind(email)
    .first();

  if (existing) {
    return json({ error: 'Email already in use' }, 409);
  }

  const { discriminator, fullTag } = await generateUniqueTag(c.env.DB, displayName);
  const uid = crypto.randomUUID();
  const salt = crypto.randomUUID();
  const passwordHash = await hashPassword(password, salt);
  const createdAt = now();

  await c.env.DB
    .prepare(
      `INSERT INTO users (uid, display_name, discriminator, full_tag, email, password_hash, status, created_at, last_seen,
        total_study_time, today_study_time, week_study_time, streak, completed_todos)
       VALUES (?, ?, ?, ?, ?, ?, 'online', ?, ?, 0, 0, 0, 0, 0)`
    )
    .bind(uid, displayName, discriminator, fullTag, email, `${salt}:${passwordHash}`, createdAt, createdAt)
    .run();

  const token = crypto.randomUUID();
  const expiresAt = createdAt + 1000 * 60 * 60 * 24 * 7;

  await c.env.DB
    .prepare('INSERT INTO sessions (token, uid, created_at, expires_at) VALUES (?, ?, ?, ?)')
    .bind(token, uid, createdAt, expiresAt)
    .run();

  return json({
    user: {
      uid,
      displayName,
      discriminator,
      fullTag,
      status: 'online',
      createdAt,
      lastSeen: createdAt,
      stats: {
        totalStudyTime: 0,
        todayStudyTime: 0,
        weekStudyTime: 0,
        streak: 0,
        completedTodos: 0,
      },
    },
    token,
  });
});

app.post('/api/auth/login', async (c) => {
  const { email, password } = await c.req.json();
  const user = await c.env.DB
    .prepare('SELECT * FROM users WHERE email = ?')
    .bind(email)
    .first();

  if (!user) return json({ error: 'Invalid credentials' }, 401);

  const [salt, hash] = (user.password_hash as string).split(':');
  const passwordHash = await hashPassword(password, salt);
  if (hash !== passwordHash) return json({ error: 'Invalid credentials' }, 401);

  const token = crypto.randomUUID();
  const createdAt = now();
  const expiresAt = createdAt + 1000 * 60 * 60 * 24 * 7;

  await c.env.DB
    .prepare('INSERT INTO sessions (token, uid, created_at, expires_at) VALUES (?, ?, ?, ?)')
    .bind(token, user.uid, createdAt, expiresAt)
    .run();

  return json({
    user: {
      uid: user.uid,
      displayName: user.display_name,
      discriminator: user.discriminator,
      fullTag: user.full_tag,
      status: user.status,
      createdAt: user.created_at,
      lastSeen: user.last_seen,
      stats: {
        totalStudyTime: user.total_study_time,
        todayStudyTime: user.today_study_time,
        weekStudyTime: user.week_study_time,
        streak: user.streak,
        completedTodos: user.completed_todos,
      },
    },
    token,
  });
});

app.post('/api/auth/logout', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return json({ ok: true });
  const token = authHeader.replace('Bearer ', '');
  await c.env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
  return json({ ok: true });
});

app.get('/api/auth/me', async (c) => {
  const user = await getAuthUser(c);
  if (!user) return json({ user: null });

  return json({
    user: {
      uid: user.uid,
      displayName: user.display_name,
      discriminator: user.discriminator,
      fullTag: user.full_tag,
      status: user.status,
      createdAt: user.created_at,
      lastSeen: user.last_seen,
      stats: {
        totalStudyTime: user.total_study_time,
        todayStudyTime: user.today_study_time,
        weekStudyTime: user.week_study_time,
        streak: user.streak,
        completedTodos: user.completed_todos,
      },
    },
  });
});

// Users
app.get('/api/users/:uid', async (c) => {
  const { uid } = c.req.param();
  const user = await c.env.DB.prepare('SELECT * FROM users WHERE uid = ?').bind(uid).first();
  if (!user) return json({ error: 'Not found' }, 404);

  return json({
    uid: user.uid,
    displayName: user.display_name,
    discriminator: user.discriminator,
    fullTag: user.full_tag,
    status: user.status,
    createdAt: user.created_at,
    lastSeen: user.last_seen,
    stats: {
      totalStudyTime: user.total_study_time,
      todayStudyTime: user.today_study_time,
      weekStudyTime: user.week_study_time,
      streak: user.streak,
      completedTodos: user.completed_todos,
    },
  });
});

app.get('/api/users/search', async (c) => {
  const tag = c.req.query('tag');
  if (!tag) return json({ user: null });

  const user = await c.env.DB
    .prepare('SELECT * FROM users WHERE full_tag = ?')
    .bind(tag)
    .first();

  if (!user) return json({ user: null });

  return json({
    user: {
      uid: user.uid,
      displayName: user.display_name,
      discriminator: user.discriminator,
      fullTag: user.full_tag,
      status: user.status,
      createdAt: user.created_at,
      lastSeen: user.last_seen,
      stats: {
        totalStudyTime: user.total_study_time,
        todayStudyTime: user.today_study_time,
        weekStudyTime: user.week_study_time,
        streak: user.streak,
        completedTodos: user.completed_todos,
      },
    },
  });
});

app.post('/api/users/:uid/status', async (c) => {
  const user = await getAuthUser(c);
  const { uid } = c.req.param();
  if (!user || user.uid !== uid) return json({ error: 'Unauthorized' }, 401);

  const { status } = await c.req.json();
  await c.env.DB
    .prepare('UPDATE users SET status = ?, last_seen = ? WHERE uid = ?')
    .bind(status, now(), uid)
    .run();

  return json({ ok: true });
});

app.post('/api/users/:uid/stats', async (c) => {
  const user = await getAuthUser(c);
  const { uid } = c.req.param();
  if (!user || user.uid !== uid) return json({ error: 'Unauthorized' }, 401);

  const { stats } = await c.req.json();
  const updates = {
    totalStudyTime: stats?.totalStudyTime ?? user.total_study_time,
    todayStudyTime: stats?.todayStudyTime ?? user.today_study_time,
    weekStudyTime: stats?.weekStudyTime ?? user.week_study_time,
    streak: stats?.streak ?? user.streak,
    completedTodos: stats?.completedTodos ?? user.completed_todos,
  };

  await c.env.DB
    .prepare(
      `UPDATE users
       SET total_study_time = ?, today_study_time = ?, week_study_time = ?, streak = ?, completed_todos = ?
       WHERE uid = ?`
    )
    .bind(
      updates.totalStudyTime,
      updates.todayStudyTime,
      updates.weekStudyTime,
      updates.streak,
      updates.completedTodos,
      uid
    )
    .run();

  return json({ ok: true });
});

// Groups
app.get('/api/groups', async (c) => {
  const user = await getAuthUser(c);
  if (!user) return json({ error: 'Unauthorized' }, 401);

  const groups = await c.env.DB
    .prepare(
      `SELECT g.* FROM groups g
       INNER JOIN group_members gm ON gm.group_id = g.id
       WHERE gm.uid = ?
       ORDER BY g.updated_at DESC`
    )
    .bind(user.uid)
    .all();

  const groupRows = (groups.results || []) as Array<any>;
  if (groupRows.length === 0) return json({ groups: [] });

  const ids = groupRows.map((g) => g.id);
  const placeholders = ids.map(() => '?').join(',');
  const members = await c.env.DB
    .prepare(`SELECT group_id, uid, role FROM group_members WHERE group_id IN (${placeholders})`)
    .bind(...ids)
    .all();

  const memberRows = (members.results || []) as Array<any>;
  const memberMap = new Map<string, { members: string[]; admins: string[] }>();
  for (const m of memberRows) {
    const current = memberMap.get(m.group_id) || { members: [], admins: [] };
    current.members.push(m.uid);
    if (m.role === 'admin') current.admins.push(m.uid);
    memberMap.set(m.group_id, current);
  }

  const normalized = groupRows.map((g) => {
    const meta = memberMap.get(g.id) || { members: [], admins: [] };
    return {
      id: g.id,
      name: g.name,
      description: g.description,
      adminIds: meta.admins,
      memberIds: meta.members,
      createdAt: g.created_at,
      updatedAt: g.updated_at,
      settings: {
        isPrivate: Boolean(g.is_private),
        allowInvites: Boolean(g.allow_invites),
        maxMembers: g.max_members,
      },
    };
  });

  return json({ groups: normalized });
});

app.post('/api/groups', async (c) => {
  const user = await getAuthUser(c);
  if (!user) return json({ error: 'Unauthorized' }, 401);

  const { name, description } = await c.req.json();
  if (!name || !description) return json({ error: 'Missing fields' }, 400);

  const id = crypto.randomUUID();
  const createdAt = now();

  await c.env.DB
    .prepare(
      `INSERT INTO groups (id, name, description, created_at, updated_at, is_private, allow_invites, max_members)
       VALUES (?, ?, ?, ?, ?, 1, 1, 50)`
    )
    .bind(id, name, description, createdAt, createdAt)
    .run();

  await c.env.DB
    .prepare(
      `INSERT INTO group_members (group_id, uid, role, joined_at, presence, last_active)
       VALUES (?, ?, 'admin', ?, 'online', ?)`
    )
    .bind(id, user.uid, createdAt, createdAt)
    .run();

  return json({
    group: {
      id,
      name,
      description,
      adminIds: [user.uid],
      memberIds: [user.uid],
      createdAt,
      updatedAt: createdAt,
      settings: {
        isPrivate: true,
        allowInvites: true,
        maxMembers: 50,
      },
    },
  });
});

app.post('/api/groups/:groupId/messages', async (c) => {
  const user = await getAuthUser(c);
  if (!user) return json({ error: 'Unauthorized' }, 401);

  const { groupId } = c.req.param();
  const { content, type } = await c.req.json();

  const id = crypto.randomUUID();
  const timestamp = now();

  await c.env.DB
    .prepare(
      `INSERT INTO messages (id, group_id, sender_id, sender_name, content, type, timestamp)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(id, groupId, user.uid, user.display_name, content, type || 'text', timestamp)
    .run();

  return json({
    message: {
      id,
      groupId,
      senderId: user.uid,
      senderName: user.display_name,
      content,
      type: type || 'text',
      timestamp,
      readBy: [user.uid],
    },
  });
});

app.get('/api/groups/:groupId', async (c) => {
  const user = await getAuthUser(c);
  if (!user) return json({ error: 'Unauthorized' }, 401);

  const { groupId } = c.req.param();
  const group = await c.env.DB.prepare('SELECT * FROM groups WHERE id = ?').bind(groupId).first();
  if (!group) return json({ error: 'Not found' }, 404);

  const members = await c.env.DB
    .prepare('SELECT uid, role FROM group_members WHERE group_id = ?')
    .bind(groupId)
    .all();

  const memberRows = (members.results || []) as Array<any>;
  const memberIds = memberRows.map((m) => m.uid);
  const adminIds = memberRows.filter((m) => m.role === 'admin').map((m) => m.uid);

  return json({
    group: {
      id: group.id,
      name: group.name,
      description: group.description,
      adminIds,
      memberIds,
      createdAt: group.created_at,
      updatedAt: group.updated_at,
      settings: {
        isPrivate: Boolean(group.is_private),
        allowInvites: Boolean(group.allow_invites),
        maxMembers: group.max_members,
      },
    },
  });
});

// Presence
app.post('/api/presence', async (c) => {
  const user = await getAuthUser(c);
  if (!user) return json({ error: 'Unauthorized' }, 401);

  const { uid, status, groupId } = await c.req.json();
  if (uid !== user.uid) return json({ error: 'Unauthorized' }, 401);

  await c.env.DB
    .prepare(
      `INSERT INTO presence (uid, status, group_id, last_updated, is_typing)
       VALUES (?, ?, ?, ?, 0)
       ON CONFLICT(uid) DO UPDATE SET status = excluded.status, group_id = excluded.group_id, last_updated = excluded.last_updated`
    )
    .bind(uid, status, groupId || null, now())
    .run();

  return json({ ok: true });
});

app.post('/api/presence/typing', async (c) => {
  const user = await getAuthUser(c);
  if (!user) return json({ error: 'Unauthorized' }, 401);
  const { uid, isTyping } = await c.req.json();
  if (uid !== user.uid) return json({ error: 'Unauthorized' }, 401);

  await c.env.DB
    .prepare(
      `INSERT INTO presence (uid, status, group_id, last_updated, is_typing)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(uid) DO UPDATE SET is_typing = excluded.is_typing, last_updated = excluded.last_updated`
    )
    .bind(uid, user.status, null, now(), isTyping ? 1 : 0)
    .run();

  return json({ ok: true });
});

app.get('/api/presence/:uid', async (c) => {
  const user = await getAuthUser(c);
  if (!user) return json({ error: 'Unauthorized' }, 401);
  const { uid } = c.req.param();
  const presence = await c.env.DB.prepare('SELECT * FROM presence WHERE uid = ?').bind(uid).first();
  if (!presence) return json({ presence: null });

  return json({
    presence: {
      uid: presence.uid,
      status: presence.status,
      groupId: presence.group_id,
      lastUpdated: presence.last_updated,
      isTyping: Boolean(presence.is_typing),
    },
  });
});

export default app;
