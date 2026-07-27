import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './utils/supabase';
import Navigation from './components/Navigation';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import AdminDen from './pages/AdminDen';
import './index.css';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <div className="app-container">
        {session && <Navigation />}
        <main>
          <Routes>
            <Route path="/" element={!session ? <Landing /> : <Navigate to="/home" />} />
            <Route path="/home" element={session ? <Home /> : <Navigate to="/" />} />
            <Route path="/explore" element={session ? <Explore /> : <Navigate to="/" />} />
            <Route path="/profile" element={session ? <Profile /> : <Navigate to="/" />} />
            <Route path="/leaderboard" element={session ? <Leaderboard /> : <Navigate to="/" />} />
            <Route path="/admin-den" element={session ? <AdminDen /> : <Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
