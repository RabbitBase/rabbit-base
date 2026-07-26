import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Rabbit, Home, LayoutDashboard, Trophy, LogOut, ShieldAlert } from 'lucide-react';
import { supabase } from '../utils/supabase';

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();
        if (data?.is_admin) {
          setIsAdmin(true);
        }
      }
    }
    checkAdmin();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* TOP NAVIGATION (Desktop + Mobile Logo) */}
      <nav className="brutal-box" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '1rem 2rem' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '60px', height: '60px', border: 'var(--border-thick)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', overflow: 'hidden', backgroundColor: 'var(--bg-white)' }}>
            <img src="/image_0.png" alt="Base HQ" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
            <Rabbit size={35} color="var(--primary-orange)" style={{ display: 'none' }} />
          </div>
          <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Base HQ</h1>
        </Link>
        
        {/* Desktop Links (Hidden on Mobile) */}
        <div className="desktop-nav" style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/home" className="brutal-btn speed-streak-hover" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
            <Home size={20} /> Home
          </Link>
          <Link to="/dashboard" className="brutal-btn speed-streak-hover" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link to="/hall-of-fame" className="brutal-btn speed-streak-hover" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
            <Trophy size={20} /> Hall of Fame
          </Link>
          {isAdmin && (
            <Link to="/admin-den" className="brutal-btn speed-streak-hover" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: 'var(--text-dark)', color: 'var(--bg-white)' }}>
              Admin
            </Link>
          )}
          <button onClick={handleLogout} className="brutal-btn speed-streak-hover" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: 'var(--primary-orange)', color: 'var(--text-dark)', cursor: 'pointer' }}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </nav>

      {/* BOTTOM NAVIGATION (Mobile Only) */}
      <nav className="mobile-nav">
        <Link to="/home" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: isActive('/home') ? 'var(--primary-orange)' : 'var(--text-dark)', textDecoration: 'none', fontWeight: 'bold' }}>
          <Home size={24} />
          <span style={{ fontSize: '0.7rem' }}>Home</span>
        </Link>
        <Link to="/dashboard" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: isActive('/dashboard') ? 'var(--primary-orange)' : 'var(--text-dark)', textDecoration: 'none', fontWeight: 'bold' }}>
          <LayoutDashboard size={24} />
          <span style={{ fontSize: '0.7rem' }}>Dash</span>
        </Link>
        <Link to="/hall-of-fame" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: isActive('/hall-of-fame') ? 'var(--primary-orange)' : 'var(--text-dark)', textDecoration: 'none', fontWeight: 'bold' }}>
          <Trophy size={24} />
          <span style={{ fontSize: '0.7rem' }}>Fame</span>
        </Link>
        {isAdmin && (
          <Link to="/admin-den" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: isActive('/admin-den') ? 'var(--primary-orange)' : 'var(--text-dark)', textDecoration: 'none', fontWeight: 'bold' }}>
            <ShieldAlert size={24} />
            <span style={{ fontSize: '0.7rem' }}>Admin</span>
          </Link>
        )}
        <button onClick={handleLogout} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-dark)', border: 'none', background: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
          <LogOut size={24} />
          <span style={{ fontSize: '0.7rem' }}>Exit</span>
        </button>
      </nav>
    </>
  );
}
