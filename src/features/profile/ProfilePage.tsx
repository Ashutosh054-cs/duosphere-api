import { memo } from 'react';
import { useAuthStore } from '@stores/authStore';
import { signOutUser } from '@services/authService';
import { cleanupPresence } from '@services/presenceService';
import { formatDuration } from '@lib/utils';
import BottomNav from '@components/BottomNav';
import Button from '@components/Button';

const ProfilePage = memo(() => {
  const { user, setUser } = useAuthStore();

  if (!user) return null;

  const handleSignOut = async () => {
    try {
      if (user) {
        await cleanupPresence(user.uid);
      }
      await signOutUser();
      setUser(null);
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-surface border-b border-primary/20">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl font-bold text-primary">
                {user.displayName[0]?.toUpperCase()}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-text mb-1">{user.displayName}</h1>
            <p className="text-primary font-mono">{user.fullTag}</p>
            <div className="flex items-center gap-2 mt-3">
              <div className={`w-2 h-2 rounded-full ${
                user.status === 'online' ? 'bg-accent' :
                user.status === 'studying' ? 'bg-primary' :
                user.status === 'idle' ? 'bg-warning' : 'bg-muted'
              }`}></div>
              <span className="text-sm text-muted capitalize">{user.status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-6 space-y-6">
        {/* Stats */}
        <div className="bg-surface rounded-2xl p-6">
          <h2 className="text-lg font-bold text-text mb-4">Study Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-background rounded-xl">
              <div className="text-2xl font-bold text-primary mb-1">
                {formatDuration(user.stats.totalStudyTime)}
              </div>
              <div className="text-xs text-muted">Total Time</div>
            </div>
            <div className="text-center p-4 bg-background rounded-xl">
              <div className="text-2xl font-bold text-accent mb-1">
                {user.stats.streak}
              </div>
              <div className="text-xs text-muted">Day Streak</div>
            </div>
            <div className="text-center p-4 bg-background rounded-xl">
              <div className="text-2xl font-bold text-primary mb-1">
                {formatDuration(user.stats.todayStudyTime)}
              </div>
              <div className="text-xs text-muted">Today</div>
            </div>
            <div className="text-center p-4 bg-background rounded-xl">
              <div className="text-2xl font-bold text-accent mb-1">
                {user.stats.completedTodos}
              </div>
              <div className="text-xs text-muted">Completed</div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-surface rounded-2xl p-6">
          <h2 className="text-lg font-bold text-text mb-4">Settings</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 bg-background rounded-xl hover:bg-background/80 transition-colors">
              <span className="text-text">Notifications</span>
              <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button className="w-full flex items-center justify-between p-4 bg-background rounded-xl hover:bg-background/80 transition-colors">
              <span className="text-text">Privacy</span>
              <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button className="w-full flex items-center justify-between p-4 bg-background rounded-xl hover:bg-background/80 transition-colors">
              <span className="text-text">About</span>
              <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Sign Out */}
        <Button variant="danger" fullWidth onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>

      <BottomNav />
    </div>
  );
});

ProfilePage.displayName = 'ProfilePage';

export default ProfilePage;
