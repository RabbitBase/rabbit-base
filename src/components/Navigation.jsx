import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Rabbit, Home, LayoutDashboard, Trophy, Menu, X, Compass } from 'lucide-react';
import { supabase } from '../utils/supabase';
import logo from '../assets/logo.png';

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userExp, setUserExp] = useState(0);
  const [username, setUsername] = useState('AGENT');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase
          .from('profiles')
          .select('is_admin, exp, username')
          .eq('id', session.user.id)
          .single();
        if (data) {
          setIsAdmin(data.is_admin);
          setUserExp(data.exp || 0);
          if (data.username) setUsername(data.username);
        }
      }
    }
    checkUser();
  }, []);

  const isActive = (path) => location.pathname === path;
  const closeMenu = () => setIsMobileMenuOpen(false);

  // Uniform height for all nav elements
  const NAV_HEIGHT = '48px';

  // Helper for Desktop Nav Link styling
  const getLinkStyle = (path) => {
    const active = isActive(path);
    return {
      display: 'flex', 
      alignItems: 'center',
      justifyContent: 'center', 
      width: '56px', // Perfect square (w-14)
      height: '56px', // Perfect square (h-14)
      backgroundColor: active ? 'var(--primary-orange)' : 'var(--bg-white)',
      color: active ? '#fff' : 'var(--text-dark)',
      border: 'var(--border-thick)',
      boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)', // stark shadow as requested
      textDecoration: 'none',
      cursor: 'pointer',
      flexShrink: 0
    };
  };

  return (
    <nav className="brutal-box" style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '1rem 2rem', 
      marginBottom: '2rem',
      position: 'relative', 
      zIndex: 9999,
      width: '100%',
      gap: '2rem'
    }}>
      {/* LEFT ZONE: Logo */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', minWidth: 0 }}>
        <Link to="/" onClick={closeMenu} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', border: 'var(--border-thick)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: 'var(--bg-white)', flexShrink: 0 }}>
            <img src={logo} alt="Base HQ" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
            <Rabbit size={28} color="var(--primary-orange)" style={{ display: 'none' }} />
          </div>
          <h1 className="desktop-nav" style={{ margin: 0, fontSize: '1.8rem', whiteSpace: 'nowrap' }}>Rabbit Base</h1>
        </Link>
      </div>
      
      {/* MOBILE CENTER: Title */}
      <h1 className="mobile-menu-btn" style={{ 
        position: 'absolute', 
        left: '50%', 
        transform: 'translateX(-50%)', 
        margin: 0, 
        fontSize: '1.5rem', 
        whiteSpace: 'nowrap',
        pointerEvents: 'none' 
      }}>
        Rabbit Base
      </h1>
      
      {/* CENTER ZONE: Core Nav Links */}
      <div className="desktop-nav" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', flexShrink: 0 }}>
        <Link to="/home" className="nav-btn-hover" style={getLinkStyle('/home')} title="Home">
          <Home size={28} />
        </Link>
        <Link to="/explore" className="nav-btn-hover" style={getLinkStyle('/explore')} title="Explore">
          <Compass size={28} />
        </Link>
        <Link to="/leaderboard" className="nav-btn-hover" style={getLinkStyle('/leaderboard')} title="Leaderboard">
          <Trophy size={28} />
        </Link>
      </div>

      {/* RIGHT ZONE: Player HUD / Profile */}
      <div className="desktop-nav" style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', minWidth: 0 }}>
        
        <Link to="/profile" className="nav-btn-hover" title="Profile" style={{
          display: 'flex', 
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: '900',
          fontSize: '1.2rem',
          color: 'var(--text-dark)',
          textTransform: 'uppercase',
          textDecoration: 'none',
          backgroundColor: 'var(--bg-white)',
          padding: '0 1rem',
          height: '56px', // match nav icons height
          border: 'var(--border-thick)',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
          cursor: 'pointer',
          maxWidth: '300px' // Ensure entire button doesn't blow out
        }}>
          <span style={{ 
            maxWidth: '120px', 
            overflow: 'hidden', 
            whiteSpace: 'nowrap', 
            textOverflow: 'ellipsis' 
          }}>
            {username}
          </span>
          <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '1.5rem', margin: '0 0.2rem' }}>🥕</span> {userExp} EXP
          </span>
        </Link>
      </div>

      {/* Hamburger Menu Button (Mobile Only) */}
      <button 
        className="mobile-menu-btn brutal-btn speed-streak-hover touch-target" 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem' }}
      >
        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Dropdown Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-btn brutal-box" style={{
          position: 'absolute', top: '100%', left: 0, width: '100%',
          marginTop: '1rem', display: 'flex', flexDirection: 'column',
          gap: '1rem', zIndex: 1000, backgroundColor: 'var(--bg-white)', padding: '1.5rem'
        }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem', padding: '0.5rem' }}>
             <span style={{ fontSize: '1.2rem', fontWeight: '900', textTransform: 'uppercase' }}>{username} 🥕 {userExp} EXP</span>
          </div>

          <Link to="/home" onClick={closeMenu} className="brutal-btn speed-streak-hover touch-target" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: isActive('/home') ? 'var(--primary-blue)' : 'var(--bg-white)', color: isActive('/home') ? '#fff' : 'var(--text-dark)' }}>
            <Home size={24} /> Home
          </Link>
          <Link to="/explore" onClick={closeMenu} className="brutal-btn speed-streak-hover touch-target" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: isActive('/explore') ? 'var(--primary-blue)' : 'var(--bg-white)', color: isActive('/explore') ? '#fff' : 'var(--text-dark)' }}>
            <LayoutDashboard size={24} /> Explore
          </Link>
          <Link to="/leaderboard" onClick={closeMenu} className="brutal-btn speed-streak-hover touch-target" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: isActive('/leaderboard') ? 'var(--primary-blue)' : 'var(--bg-white)', color: isActive('/leaderboard') ? '#fff' : 'var(--text-dark)' }}>
            <Trophy size={24} /> Leaderboard
          </Link>
          <Link to="/profile" onClick={closeMenu} className="brutal-btn speed-streak-hover touch-target" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: isActive('/profile') ? 'var(--primary-blue)' : 'var(--bg-white)', color: isActive('/profile') ? '#fff' : 'var(--text-dark)' }}>
             Profile
          </Link>
        </div>
      )}
    </nav>
  );
}
