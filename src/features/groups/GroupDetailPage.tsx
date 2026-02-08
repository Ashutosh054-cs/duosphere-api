import { memo } from 'react';
import BottomNav from '@components/BottomNav';

const GroupDetailPage = memo(() => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl mx-auto px-6 py-6">
        <h1 className="text-2xl font-bold text-text">Group Detail</h1>
        <p className="text-muted mt-2">Group detail page - Coming soon</p>
      </div>
      <BottomNav />
    </div>
  );
});

GroupDetailPage.displayName = 'GroupDetailPage';

export default GroupDetailPage;
