import { memo } from 'react';
import BottomNav from '@components/BottomNav';

const FriendsPage = memo(() => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 bg-surface/95 backdrop-blur-lg border-b border-primary/20 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-text">Friends</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-6">
        <div className="text-center py-16">
          <svg
            className="w-20 h-20 mx-auto mb-4 text-muted/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <h2 className="text-xl font-bold text-text mb-2">No friends yet</h2>
          <p className="text-muted">Search for users by their tag (e.g., Alex#1234)</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
});

FriendsPage.displayName = 'FriendsPage';

export default FriendsPage;
