import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Rabbit, Home, LayoutDashboard, Trophy, LogOut } from 'lucide-react';
import { supabase } from '../utils/supabase';

export default function Navigation() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav className="brutal-box" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '1rem 2rem' }}>
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '60px', height: '60px', border: 'var(--border-thick)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', overflow: 'hidden', backgroundColor: 'var(--bg-white)' }}>
          {/* We will try to load the logo. If it's missing, alt text or fallback styling will apply */}
          <img src="/image_0.png" alt="Base HQ" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
          <Rabbit size={35} color="var(--primary-orange)" style={{ display: 'none' }} />
        </div>
        <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Base HQ</h1>
      </Link>
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/home" className="brutal-btn speed-streak-hover" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
          <Home size={20} /> Home
        </Link>
        <Link to="/dashboard" className="brutal-btn speed-streak-hover" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
          <LayoutDashboard size={20} /> Dashboard
        </Link>
        <Link to="/hall-of-fame" className="brutal-btn speed-streak-hover" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
          <Trophy size={20} /> Hall of Fame
        </Link>
        <Link to="/admin-den" className="brutal-btn speed-streak-hover" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: 'var(--text-dark)', color: 'var(--bg-white)' }}>
          Admin
        </Link>
        <button onClick={handleLogout} className="brutal-btn speed-streak-hover" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: 'var(--primary-orange)', color: 'var(--text-dark)', cursor: 'pointer' }}>
          <LogOut size={20} /> Logout
        </button>
      </div>
    </nav>
  );
}
