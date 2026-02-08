import { memo } from 'react';
import { useAuthStore } from '@stores/authStore';
import { formatDuration } from '@lib/utils';
import BottomNav from '@components/BottomNav';

const HomePage = memo(() => {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-surface/95 backdrop-blur-lg border-b border-primary/20 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text">Welcome back!</h1>
              <p className="text-sm text-primary">{user.fullTag}</p>
            </div>
            <div className="relative">
              <div className={`w-3 h-3 rounded-full absolute -top-1 -right-1 ${
                user.status === 'online' ? 'bg-accent' :
                user.status === 'studying' ? 'bg-primary' :
                user.status === 'idle' ? 'bg-warning' : 'bg-muted'
              } animate-pulse`}></div>
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-primary">
                  {user.displayName[0]?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface rounded-2xl p-4">
            <div className="text-muted text-sm mb-1">Today's Study</div>
            <div className="text-2xl font-bold text-primary">
              {formatDuration(user.stats.todayStudyTime)}
            </div>
          </div>
          <div className="bg-surface rounded-2xl p-4">
            <div className="text-muted text-sm mb-1">Streak</div>
            <div className="text-2xl font-bold text-accent">
              {user.stats.streak} days
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-surface rounded-2xl p-6">
          <h2 className="text-lg font-bold text-text mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex flex-col items-center gap-2 p-4 bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm font-medium text-text">Create Group</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-accent/10 rounded-xl hover:bg-accent/20 transition-colors">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-text">Start Timer</span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-surface rounded-2xl p-6">
          <h2 className="text-lg font-bold text-text mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="text-center text-muted py-8">
              <svg className="w-16 h-16 mx-auto mb-3 text-muted/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-sm">No recent activity yet</p>
              <p className="text-xs text-muted/70 mt-1">Join a group or start studying!</p>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
});

HomePage.displayName = 'HomePage';

export default HomePage;
