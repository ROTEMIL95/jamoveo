import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignupPage from '../features/auth/SignupPage';
import LoginPage from '../features/auth/LoginPage';
import PlayerPage from '../features/player/PlayerPage';
import AdminPage from '../features/admin/AdminPage';
import LivePage from '../features/live/LivePage';
import SignupAdminPage from '../features/auth/SignupAdminPage';
import ResultsPage from '../features/admin/ResultsPage';

const mockSong = {
  sections: [
    {
      title: 'Verse',
      lines: [
        { chords: 'C G Am F', lyrics: 'Imagine all the people...' },
        { chords: 'F G C', lyrics: 'Living for today...' },
      ],
    },
    {
      title: 'Chorus',
      lines: [
        { chords: 'F G C', lyrics: 'You may say I\'m a dreamer' },
      ],
    },
  ],
};

function AppRouter({ user }) {
  if (!user) {
    return (
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signup-admin" element={<SignupAdminPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/player" element={<PlayerPage user={user} />} />
        <Route path="/admin" element={<AdminPage user={user} />} />
        <Route path="/live" element={<LivePage user={user} song={mockSong} />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="*" element={<Navigate to="/signup" />} />

        
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/live" element={<LivePage user={user} song={mockSong} />} />
    </Routes>
  );
}

export default AppRouter;
