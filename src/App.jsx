import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './utils/supabase';
import Navigation from './components/Navigation';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Dashboard from './components/Dashboard';
import HallOfFame from './components/HallOfFame';
import Onboarding from './components/Onboarding';
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
            <Route path="/" element={!session ? <Landing /> : <Navigate to="/onboarding" />} />
            <Route path="/onboarding" element={session ? <Onboarding /> : <Navigate to="/" />} />
            <Route path="/home" element={session ? <Home /> : <Navigate to="/" />} />
            <Route path="/dashboard" element={session ? <Dashboard /> : <Navigate to="/" />} />
            <Route path="/hall-of-fame" element={session ? <HallOfFame /> : <Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
