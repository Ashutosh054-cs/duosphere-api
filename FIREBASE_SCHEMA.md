# Firebase Firestore Schema Documentation

## Overview
This document describes the complete Firestore database schema for DuoSphere.

## Collections

### 1. `users` Collection
Stores user profile and stats information.

**Document ID**: User's Firebase Auth UID

```typescript
{
  uid: string;                    // Firebase Auth UID (same as doc ID)
  displayName: string;            // User's chosen display name
  discriminator: string;          // 4-digit unique tag (e.g., "4839")
  fullTag: string;                // Combined tag (e.g., "Alex#4839")
  status: UserStatus;             // 'online' | 'offline' | 'studying' | 'idle'
  avatar?: string;                // Storage URL to avatar image
  createdAt: Timestamp;           // Account creation time
  lastSeen: Timestamp;            // Last activity timestamp
  stats: {
    totalStudyTime: number;       // Total study time in seconds
    todayStudyTime: number;       // Today's study time in seconds
    weekStudyTime: number;        // This week's study time in seconds
    streak: number;               // Consecutive days studied
    completedTodos: number;       // Total completed todos
  }
}
```

**Indexes Required:**
- `displayName` + `discriminator` (for unique tag lookup)
- `fullTag` (for user search)
- `status` (for presence queries)

---

### 2. `friendRequests` Collection
Manages friend request state between users.

**Document ID**: Auto-generated

```typescript
{
  id: string;                     // Document ID
  from: string;                   // Sender's UID
  to: string;                     // Receiver's UID
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Timestamp;           // Request timestamp
}
```

**Indexes Required:**
- `from` + `status`
- `to` + `status`

---

### 3. `friendships` Collection
Stores confirmed friendships.

**Document ID**: Auto-generated

```typescript
{
  id: string;                     // Document ID
  users: string[];                // [uid1, uid2] - always sorted
  createdAt: Timestamp;           // Friendship established time
}
```

**Indexes Required:**
- `users` (array-contains for querying user's friends)

---

### 4. `groups` Collection
Study group information and settings.

**Document ID**: Auto-generated group ID

```typescript
{
  id: string;                     // Group ID (same as doc ID)
  name: string;                   // Group name
  description: string;            // Group description
  adminIds: string[];             // Array of admin UIDs
  memberIds: string[];            // Array of all member UIDs
  createdAt: Timestamp;           // Group creation time
  updatedAt: Timestamp;           // Last update time
  settings: {
    isPrivate: boolean;           // Private group (invite-only)
    allowInvites: boolean;        // Members can invite others
    maxMembers: number;           // Maximum member count (default: 50)
  }
}
```

**Indexes Required:**
- `memberIds` (array-contains for user's groups)
- `updatedAt` (for sorting)

#### Subcollection: `groups/{groupId}/members`
Group member details and presence.

**Document ID**: User's UID

```typescript
{
  uid: string;                    // Member's UID
  role: 'admin' | 'member';       // Member role
  joinedAt: Timestamp;            // When they joined
  presence: UserStatus;           // Current presence in group
  lastActive: Timestamp;          // Last activity in group
}
```

#### Subcollection: `groups/{groupId}/messages`
Group chat messages.

**Document ID**: Auto-generated message ID

```typescript
{
  id: string;                     // Message ID
  groupId: string;                // Parent group ID
  senderId: string;               // Sender's UID
  senderName: string;             // Sender's display name
  content: string;                // Message text
  type: 'text' | 'image' | 'system'; // Message type
  timestamp: Timestamp;           // Message timestamp
  readBy: string[];               // UIDs who read the message
  replyTo?: string;               // Message ID being replied to
}
```

**Indexes Required:**
- `timestamp` (for chronological ordering)
- `senderId` + `timestamp`

#### Subcollection: `groups/{groupId}/timer`
Active timer session for the group.

**Document ID**: `current` (single document)

```typescript
{
  id: string;                     // Session ID
  groupId: string;                // Parent group ID
  hostId: string;                 // Host/creator UID
  type: 'pomodoro' | 'custom';    // Timer type
  duration: number;               // Duration in seconds
  startTime: Timestamp;           // Start timestamp
  endTime: number;                // Calculated end time (milliseconds)
  isActive: boolean;              // Currently running
  participants: string[];         // UIDs of participants
  breaks: number;                 // Number of breaks completed
  currentBreak: number;           // Current break number
}
```

---

### 5. `todos` Collection
Personal and group todo items.

**Document ID**: Auto-generated todo ID

```typescript
{
  id: string;                     // Todo ID
  userId: string;                 // Owner's UID
  groupId?: string;               // Optional: group ID if shared
  title: string;                  // Todo title
  description: string;            // Detailed description
  completed: boolean;             // Completion status
  completedAt?: Timestamp;        // Completion timestamp
  proofImageUrl?: string;         // Storage URL to proof image
  createdAt: Timestamp;           // Creation timestamp
  updatedAt: Timestamp;           // Last update timestamp
  priority: 'low' | 'medium' | 'high'; // Priority level
  dueDate?: number;               // Optional due date (milliseconds)
}
```

**Indexes Required:**
- `userId` + `createdAt`
- `groupId` + `createdAt`
- `userId` + `completed` + `createdAt`

---

### 6. `directMessages` Collection
Direct messages between users.

**Document ID**: Auto-generated message ID

```typescript
{
  id: string;                     // Message ID
  conversationId: string;         // Sorted UIDs joined: "uid1_uid2"
  senderId: string;               // Sender's UID
  receiverId: string;             // Receiver's UID
  content: string;                // Message content
  timestamp: Timestamp;           // Message timestamp
  read: boolean;                  // Read status
}
```

**Indexes Required:**
- `conversationId` + `timestamp`
- `receiverId` + `read` + `timestamp`

---

### 7. `studySessions` Collection
Historical study session records.

**Document ID**: Auto-generated session ID

```typescript
{
  id: string;                     // Session ID
  userId: string;                 // User's UID
  groupId?: string;               // Optional: group ID
  startTime: Timestamp;           // Session start
  endTime: Timestamp;             // Session end
  duration: number;               // Duration in seconds
  type: 'solo' | 'group';         // Session type
}
```

**Indexes Required:**
- `userId` + `startTime`
- `groupId` + `startTime`

---

### 8. `presence` Collection
Real-time user presence and status.

**Document ID**: User's UID

```typescript
{
  uid: string;                    // User's UID
  status: UserStatus;             // Current status
  groupId?: string;               // Current group ID (if in group)
  lastUpdated: Timestamp;         // Last presence update
  isTyping?: boolean;             // Currently typing indicator
}
```

**Indexes Required:**
- `status`
- `groupId` + `status`

---

### 9. `mediaSessions` Collection
Media sync sessions (YouTube/Music).

**Document ID**: Auto-generated session ID

```typescript
{
  id: string;                     // Session ID
  groupId: string;                // Group ID
  hostId: string;                 // Host's UID
  type: 'music' | 'youtube';      // Media type
  isActive: boolean;              // Session active
  currentTrack?: {                // Current media info
    id: string;
    title: string;
    artist?: string;
    duration: number;
    url?: string;
    thumbnail?: string;
  };
  playbackState: 'playing' | 'paused' | 'stopped';
  currentTime: number;            // Current playback time (seconds)
  lastSyncTime: Timestamp;        // Last sync timestamp
  participants: string[];         // Participant UIDs
}
```

---

### 10. `notifications` Collection
User notifications.

**Document ID**: Auto-generated notification ID

```typescript
{
  id: string;                     // Notification ID
  userId: string;                 // Recipient's UID
  type: 'friend_request' | 'group_invite' | 'message' | 'timer' | 'todo';
  title: string;                  // Notification title
  message: string;                // Notification message
  data?: Record<string, any>;     // Additional data
  read: boolean;                  // Read status
  createdAt: Timestamp;           // Creation timestamp
}
```

**Indexes Required:**
- `userId` + `read` + `createdAt`

---

## Storage Buckets

### `/todo-proofs/{todoId}/{fileName}`
Todo completion proof images (max 5MB, images only)

### `/avatars/{userId}/{fileName}`
User avatar images (max 5MB, images only)

### `/groups/{groupId}/{fileName}`
Group images and media (max 5MB, images only)

---

## Security Rules Summary

1. **Users**: Read by all authenticated users, write only by owner
2. **Friend Requests**: Visible to sender and receiver only
3. **Groups**: Visible to members only, admin-only modifications
4. **Messages**: Group members can read/write, admin can delete
5. **Todos**: Owner can read/write, group members can view group todos
6. **Presence**: Public read, owner write
7. **Storage**: Authenticated write with size/type limits

---

## Query Optimization Tips

1. **Always use compound indexes** for complex queries
2. **Limit query results** with pagination (use `limit()` and `startAfter()`)
3. **Use `where()` before `orderBy()`** in compound queries
4. **Cache frequently accessed data** client-side with Zustand
5. **Subscribe selectively** - only listen to active conversations/groups
6. **Unsubscribe from listeners** when components unmount

---

## Deployment Checklist

- [ ] Deploy Firestore rules: `firebase deploy --only firestore:rules`
- [ ] Deploy Storage rules: `firebase deploy --only storage:rules`
- [ ] Create composite indexes in Firebase Console
- [ ] Enable offline persistence in app
- [ ] Set up Firebase App Check (recommended for production)
- [ ] Configure rate limiting via Cloud Functions
- [ ] Enable Firebase Analytics

---

**Last Updated**: February 2026
