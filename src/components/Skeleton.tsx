import { memo } from 'react';

const SkeletonCard = memo(() => (
  <div className="bg-surface rounded-2xl p-6 animate-pulse">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 bg-primary/20 rounded-full skeleton"></div>
      <div className="flex-1">
        <div className="h-4 bg-primary/20 rounded w-3/4 mb-2 skeleton"></div>
        <div className="h-3 bg-primary/10 rounded w-1/2 skeleton"></div>
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-primary/10 rounded skeleton"></div>
      <div className="h-3 bg-primary/10 rounded w-5/6 skeleton"></div>
    </div>
  </div>
));

SkeletonCard.displayName = 'SkeletonCard';

export const SkeletonList = memo(({ count = 3 }: { count?: number }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
));

SkeletonList.displayName = 'SkeletonList';

export default SkeletonCard;
