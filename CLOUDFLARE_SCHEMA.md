# Cloudflare D1 Schema Documentation

## Overview
This document describes the SQLite (D1) schema used by the DuoSphere Cloudflare Worker backend.

## Source of Truth
The canonical schema lives in:
- server/schema.sql

## Tables

### users
Stores user identity, stats, and credentials.

Key fields:
- uid (TEXT, primary key)
- display_name, discriminator, full_tag
- email, password_hash
- status, created_at, last_seen
- total_study_time, today_study_time, week_study_time, streak, completed_todos

### sessions
Simple bearer-token sessions.

Key fields:
- token (TEXT, primary key)
- uid (TEXT, FK to users)
- created_at, expires_at

### groups
Study groups and settings.

Key fields:
- id (TEXT, primary key)
- name, description
- created_at, updated_at
- is_private, allow_invites, max_members

### group_members
Membership mapping and presence.

Key fields:
- group_id, uid (composite primary key)
- role, joined_at
- presence, last_active

### messages
Group messages.

Key fields:
- id (TEXT, primary key)
- group_id, sender_id, sender_name
- content, type
- timestamp, reply_to

### todos
Personal and group todo items.

Key fields:
- id (TEXT, primary key)
- user_id, group_id
- title, description
- completed, completed_at
- proof_image_url
- created_at, updated_at
- priority, due_date

### presence
Cached presence states.

Key fields:
- uid (TEXT, primary key)
- status, group_id
- last_updated, is_typing

## Migrations
Apply schema locally with:

```bash
bun run db:apply
```

## Notes
- For realtime sync, consider Durable Objects + WebSockets.
- For proof image uploads, consider Cloudflare R2.
- For rate limiting, use Cloudflare Rate Limiting rules or Workers KV.
