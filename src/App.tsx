import { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@stores/authStore';
import { getCurrentUser } from '@services/authService';
import { initializePresence, cleanupPresence } from '@services/presenceService';
import { ROUTES } from '@lib/constants';
import LoadingScreen from '@components/LoadingScreen';
import ErrorBoundary from '@components/ErrorBoundary';

// Lazy load features for code splitting
const AuthPage = lazy(() => import('@features/auth/AuthPage'));
const HomePage = lazy(() => import('@features/home/HomePage'));
const GroupsPage = lazy(() => import('@features/groups/GroupsPage'));
const GroupDetailPage = lazy(() => import('@features/groups/GroupDetailPage'));
const ProfilePage = lazy(() => import('@features/profile/ProfilePage'));
const FriendsPage = lazy(() => import('@features/friends/FriendsPage'));

function App() {
  const { user, setUser, setLoading, setInitialized, initialized } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        await initializePresence(currentUser.uid, 'online');
      } else {
        setUser(null);
      }
      setLoading(false);
      setInitialized(true);
    };

    init();
  }, []);

  // Cleanup presence on app unmount
  useEffect(() => {
    return () => {
      if (user) {
        cleanupPresence(user.uid);
      }
    };
  }, [user]);

  if (!initialized) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route
            path={ROUTES.AUTH}
            element={user ? <Navigate to={ROUTES.HOME} replace /> : <AuthPage />}
          />
          <Route
            path={ROUTES.HOME}
            element={user ? <HomePage /> : <Navigate to={ROUTES.AUTH} replace />}
          />
          <Route
            path={ROUTES.GROUPS}
            element={user ? <GroupsPage /> : <Navigate to={ROUTES.AUTH} replace />}
          />
          <Route
            path={ROUTES.GROUP}
            element={user ? <GroupDetailPage /> : <Navigate to={ROUTES.AUTH} replace />}
          />
          <Route
            path={ROUTES.PROFILE}
            element={user ? <ProfilePage /> : <Navigate to={ROUTES.AUTH} replace />}
          />
          <Route
            path={ROUTES.FRIENDS}
            element={user ? <FriendsPage /> : <Navigate to={ROUTES.AUTH} replace />}
          />
          <Route path="*" element={<Navigate to={user ? ROUTES.HOME : ROUTES.AUTH} replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
