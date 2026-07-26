import React from 'react';
import Auth from '../components/Auth';
import logo from '../assets/logo.png';

export default function Landing() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '3rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '600px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <img src={logo} alt="Rabbit Base Logo" style={{ width: '120px', height: '120px', objectFit: 'cover', border: 'var(--border-thick)', boxShadow: 'var(--shadow-brutal)' }} className="flaming-carrot" />
        </div>
        <h1 style={{ fontSize: '4rem', color: 'var(--primary-blue)', marginBottom: '1rem' }}>Rabbit Base</h1>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Your open-source warren for daily-use tools. Join the burrow.</p>
      </div>
      
      <Auth />
    </div>
  );
}
