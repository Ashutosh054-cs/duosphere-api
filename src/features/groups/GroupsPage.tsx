import { useState, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@stores/authStore';
import { useGroupStore } from '@stores/groupStore';
import { getUserGroups, createGroup } from '@services/groupService';
import { formatRelativeTime } from '@lib/utils';
import BottomNav from '@components/BottomNav';
import Button from '@components/Button';
import Input from '@components/Input';
import { SkeletonList } from '@components/Skeleton';

const GroupsPage = memo(() => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { groups, setGroups, setLoading, loading } = useGroupStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadGroups();
  }, [user]);

  const loadGroups = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const userGroups = await getUserGroups(user.uid);
      setGroups(userGroups);
    } catch (error) {
      console.error('Failed to load groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !groupName.trim()) return;

    setCreating(true);
    try {
      const newGroup = await createGroup(groupName, groupDescription, user.uid);
      setGroups([...groups, newGroup]);
      setShowCreateModal(false);
      setGroupName('');
      setGroupDescription('');
      navigate(`/groups/${newGroup.id}`);
    } catch (error) {
      console.error('Failed to create group:', error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-surface/95 backdrop-blur-lg border-b border-primary/20 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-text">Study Groups</h1>
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors active:scale-95"
              aria-label="Create group"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-6">
        {loading ? (
          <SkeletonList count={3} />
        ) : groups.length === 0 ? (
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h2 className="text-xl font-bold text-text mb-2">No groups yet</h2>
            <p className="text-muted mb-6">Create your first study group to get started</p>
            <Button onClick={() => setShowCreateModal(true)}>
              Create Group
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {groups.map((group) => (
              <button
                key={group.id}
                onClick={() => navigate(`/groups/${group.id}`)}
                className="w-full bg-surface rounded-2xl p-6 text-left hover:bg-surface/80 transition-colors active:scale-98"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-text mb-1">{group.name}</h3>
                    <p className="text-sm text-muted line-clamp-2">{group.description}</p>
                  </div>
                  <div className="ml-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">{group.memberIds.length}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted">
                  <span>{group.memberIds.length} members</span>
                  <span>•</span>
                  <span>Updated {formatRelativeTime(group.updatedAt)}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-6">
          <div
            className="w-full max-w-md bg-surface rounded-3xl p-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-text">Create Study Group</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary/10 transition-colors"
              >
                <svg className="w-6 h-6 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-4">
              <Input
                label="Group Name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="e.g., CS Study Squad"
                required
              />

              <div className="w-full">
                <label className="block text-sm font-medium text-text mb-2">
                  Description
                </label>
                <textarea
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  placeholder="What will you study together?"
                  rows={3}
                  className="w-full bg-background border border-primary/30 rounded-xl px-4 py-3 text-text placeholder-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  fullWidth
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" fullWidth loading={creating}>
                  Create
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
});

GroupsPage.displayName = 'GroupsPage';

export default GroupsPage;
