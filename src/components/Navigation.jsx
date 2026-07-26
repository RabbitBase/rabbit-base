import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Rabbit, Home, LayoutDashboard, Trophy, LogOut, ShieldAlert, Menu, X, Flame } from 'lucide-react';
import { supabase } from '../utils/supabase';
import logo from '../assets/logo.png';

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userExp, setUserExp] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase
          .from('profiles')
          .select('is_admin, exp')
          .eq('id', session.user.id)
          .single();
        if (data) {
          setIsAdmin(data.is_admin);
          setUserExp(data.exp || 0);
        }
      }
    }
    checkUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

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
      gap: '0.5rem', 
      padding: '0 1rem', // Reduced padding to prevent horizontal cramming
      height: NAV_HEIGHT,
      backgroundColor: active ? 'var(--primary-orange)' : 'var(--bg-white)',
      color: active ? '#fff' : 'var(--text-dark)',
      border: 'var(--border-thick)',
      boxShadow: 'var(--shadow-brutal)',
      fontWeight: '800',
      fontSize: '1.1rem',
      textTransform: 'uppercase',
      textDecoration: 'none',
      cursor: 'pointer',
      whiteSpace: 'nowrap'
    };
  };

  return (
    <nav className="brutal-box" style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginBottom: '2rem', 
      padding: '1rem 2rem', 
      position: 'relative', 
      zIndex: 9999,
      width: '100%',
      gap: '2rem' // CRITICAL: Ensure zones never collide on narrow screens
    }}>
      {/* LEFT ZONE: Logo */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', minWidth: 0 }}>
        <Link to="/" onClick={closeMenu} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', border: 'var(--border-thick)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: 'var(--bg-white)', flexShrink: 0 }}>
            <img src={logo} alt="Base HQ" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
            <Rabbit size={28} color="var(--primary-orange)" style={{ display: 'none' }} />
          </div>
          <h1 className="desktop-nav" style={{ margin: 0, fontSize: '1.8rem', whiteSpace: 'nowrap' }}>Base HQ</h1>
        </Link>
      </div>
      
      {/* CENTER ZONE: Core Nav Links */}
      <div className="desktop-nav" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
        <Link to="/home" className="nav-btn-hover" style={getLinkStyle('/home')}>
          <Home size={20} /> Home
        </Link>
        <Link to="/dashboard" className="nav-btn-hover" style={getLinkStyle('/dashboard')}>
          <LayoutDashboard size={20} /> Dashboard
        </Link>
        <Link to="/hall-of-fame" className="nav-btn-hover" style={getLinkStyle('/hall-of-fame')}>
          <Trophy size={20} /> Fame
        </Link>
      </div>

      {/* RIGHT ZONE: Player HUD & System Actions */}
      <div className="desktop-nav" style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
        
        {/* Stat Pill */}
        <div style={{
          display: 'flex', 
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center', 
          gap: '0.5rem',
          backgroundColor: '#fff8eb', 
          border: 'var(--border-thick)',
          padding: '0 1rem', 
          height: NAV_HEIGHT,
          fontWeight: '900',
          fontSize: '1.1rem',
          boxShadow: 'var(--shadow-brutal)', // MATCH shadow of other buttons
          whiteSpace: 'nowrap',
          flexShrink: 0
        }}>
          <Flame size={20} color="var(--primary-orange)" className="flaming-carrot" />
          <span>{userExp} EXP</span>
        </div>

        {isAdmin && (
          <Link to="/admin-den" className="nav-btn-hover" style={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', 
            padding: '0 1rem', height: NAV_HEIGHT,
            backgroundColor: 'var(--text-dark)', color: 'var(--bg-white)', 
            border: 'var(--border-thick)', boxShadow: 'var(--shadow-brutal)', 
            fontWeight: '800', fontSize: '1.1rem', textTransform: 'uppercase', textDecoration: 'none',
            whiteSpace: 'nowrap', flexShrink: 0
          }}>
            Admin
          </Link>
        )}
        
        {/* Compact Logout */}
        <button onClick={handleLogout} className="nav-btn-hover" style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: NAV_HEIGHT, height: NAV_HEIGHT, 
          backgroundColor: 'var(--bg-white)', color: 'var(--text-dark)', 
          border: 'var(--border-thick)', cursor: 'pointer',
          boxShadow: 'var(--shadow-brutal)', padding: 0, flexShrink: 0
        }} title="Logout">
          <LogOut size={20} />
        </button>
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
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem', padding: '0.5rem', border: 'var(--border-thick)', backgroundColor: '#fff8eb' }}>
             <Flame size={24} color="var(--primary-orange)" className="flaming-carrot" />
             <span style={{ fontSize: '1.2rem', fontWeight: '900' }}>{userExp} EXP</span>
          </div>

          <Link to="/home" onClick={closeMenu} className="brutal-btn speed-streak-hover touch-target" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: isActive('/home') ? 'var(--primary-blue)' : 'var(--bg-white)', color: isActive('/home') ? '#fff' : 'var(--text-dark)' }}>
            <Home size={24} /> Home
          </Link>
          <Link to="/dashboard" onClick={closeMenu} className="brutal-btn speed-streak-hover touch-target" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: isActive('/dashboard') ? 'var(--primary-blue)' : 'var(--bg-white)', color: isActive('/dashboard') ? '#fff' : 'var(--text-dark)' }}>
            <LayoutDashboard size={24} /> Dashboard
          </Link>
          <Link to="/hall-of-fame" onClick={closeMenu} className="brutal-btn speed-streak-hover touch-target" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: isActive('/hall-of-fame') ? 'var(--primary-blue)' : 'var(--bg-white)', color: isActive('/hall-of-fame') ? '#fff' : 'var(--text-dark)' }}>
            <Trophy size={24} /> Hall of Fame
          </Link>
          {isAdmin && (
            <Link to="/admin-den" onClick={closeMenu} className="brutal-btn speed-streak-hover touch-target" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--text-dark)', color: 'var(--bg-white)' }}>
              <ShieldAlert size={24} /> Admin
            </Link>
          )}
          <button onClick={() => { closeMenu(); handleLogout(); }} className="brutal-btn speed-streak-hover touch-target" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#ff0055', color: '#fff', cursor: 'pointer' }}>
            <LogOut size={24} /> Logout
          </button>
        </div>
      )}
    </nav>
  );
}
