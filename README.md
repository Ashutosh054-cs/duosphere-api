# DuoSphere - Mobile-First Real-Time Study Collaboration App

![DuoSphere](https://img.shields.io/badge/DuoSphere-Study%20Together-38BDF8?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers-F38020?style=flat-square&logo=cloudflare)

A production-grade, mobile-first real-time study collaboration platform where students can form groups, share timers, track todos with proof, chat, and study together with synchronized media.

## ✨ Features

### 🔐 Authentication & Identity
- **Discord-style user tags** (e.g., Alex#4839)
- Auto-generated unique discriminators
- Search users by full tag
- Real-time presence system (online/offline/studying/idle)

### 👥 Study Groups
- Create and join private study groups
- Role-based permissions (admin/member)
- Real-time member presence
- Group invitations via user tag

### ⏱️ Synchronized Study Timer
- Shared Pomodoro-style timer
- Synchronized across all group members
- Background timer support (works when screen is off)
- Tracks individual and group study time
- Daily/weekly stats and streak tracking

### 📝 Todo System with Proof
- Personal and group todos
- Priority levels and due dates
- **Proof requirement**: Upload image when completing todos
- Real-time sync across group members
- Virtualized lists for performance

### 💬 Real-Time Chat
- Group chat with typing indicators
- Direct messages between friends
- Read receipts
- Message pagination
- Optimized Firestore queries

### 🎵 Media Sync (Framework Ready)
- YouTube Watch Together (YouTube IFrame API integration ready)
- Music Sync (Spotify/SoundCloud integration ready)
- Synchronized playback for all participants
- Host controls with sync detection

### 📊 Study Analytics
- Total study time tracking
- Daily streak counter
- Weekly study goals
- Completed todos counter

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Package Manager**: Bun
- **Styling**: TailwindCSS (mobile-first design)
- **State Management**: Zustand (modular stores)
- **Backend**: Cloudflare Workers (Hono)
   - D1 (SQLite database)
   - Durable Objects (future real-time sync)
   - R2 (future proof image storage)
- **Routing**: React Router DOM 7
- **Performance**: 
  - React.memo for component optimization
  - Code splitting with lazy loading
  - Virtualized lists (react-window)
  - Intersection Observer for lazy content
  - Service Worker for background timers

## 📁 Project Structure

```
src/
├── features/          # Feature-based modules
│   ├── auth/         # Authentication pages
│   ├── groups/       # Group management
│   ├── chat/         # Messaging
│   ├── timer/        # Study timer
│   ├── todos/        # Todo management
│   ├── media/        # Music/video sync
│   ├── friends/      # Friend system
│   └── profile/      # User profile
├── stores/           # Zustand state stores
│   ├── authStore.ts
│   ├── groupStore.ts
│   ├── chatStore.ts
│   ├── timerStore.ts
│   ├── todoStore.ts
│   └── mediaStore.ts
├── services/         # API service layer
│   ├── authService.ts
│   ├── groupService.ts
│   ├── chatService.ts
│   ├── todoService.ts
│   ├── timerService.ts
│   └── presenceService.ts
├── components/       # Shared UI components
├── hooks/            # Custom React hooks
├── lib/              # Utilities and config
│   ├── constants.ts
│   └── utils.ts
├── types/            # TypeScript definitions
└── App.tsx           # Main app component
server/               # Cloudflare Worker (Hono)
├── worker.ts         # API entry
├── db.ts             # D1 helpers
└── schema.sql        # D1 schema
```

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) (latest version)
- [Cloudflare Account](https://dash.cloudflare.com)
- Node.js 18+ (for some dev tools)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Duo_sphere
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Cloudflare Setup**

   a. Create a Cloudflare account and install Wrangler
   
   b. Create a D1 database:
   ```bash
   wrangler d1 create duosphere
   ```

   c. Update database_id in wrangler.toml

   d. Apply schema:
   ```bash
   bun run db:apply
   ```

4. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API base URL:
   ```env
   VITE_API_URL=/api
   ```

5. **Run the API**
   
   Start Cloudflare Worker locally:
   ```bash
   bun run dev:worker
   ```

6. **Run Development Server**
   ```bash
   bun run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000)

## 📘 Backend Schema

See Cloudflare D1 schema documentation in:
- [CLOUDFLARE_SCHEMA.md](CLOUDFLARE_SCHEMA.md)
