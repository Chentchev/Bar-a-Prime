import { Routes, Route, Navigate } from 'react-router-dom';
import { usePlayer } from './context/PlayerContext';
import ProfilePicker from './components/players/ProfilePicker';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import EventDetailPage from './pages/EventDetailPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';

export default function App() {
  const { player, loading } = usePlayer();

  if (loading) {
    return <div className="flex min-h-svh items-center justify-center text-slate-400">Chargement…</div>;
  }

  if (!player) {
    return <ProfilePicker />;
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route
          path="/admin"
          element={player.isAdmin ? <AdminPage /> : <Navigate to="/" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
