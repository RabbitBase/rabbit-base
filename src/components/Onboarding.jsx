import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Onboarding() {
  const navigate = useNavigate();

  return (
    <section className="brutal-box" style={{ backgroundColor: 'var(--primary-blue)', color: 'var(--bg-white)', maxWidth: '800px', margin: '4rem auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
        <img src={logo} alt="Rabbit Base Logo" style={{ width: '100px', height: '100px', objectFit: 'cover', border: 'var(--border-thick)', boxShadow: 'var(--shadow-brutal)' }} className="flaming-carrot" />
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Rabbit Training Program</h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>
            Welcome to the Burrow! Take your first steps into the open-source warren. Complete this quick tutorial to unlock your dashboard.
          </p>
          <button onClick={() => navigate('/home')} className="brutal-btn speed-streak-hover">Finish Training & Dig In</button>
        </div>
      </div>
    </section>
  );
}
