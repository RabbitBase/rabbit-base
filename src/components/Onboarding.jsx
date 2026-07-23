import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Rabbit } from 'lucide-react';

export default function Onboarding() {
  const navigate = useNavigate();

  return (
    <section className="brutal-box" style={{ backgroundColor: 'var(--primary-blue)', color: 'var(--bg-white)', maxWidth: '800px', margin: '4rem auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ backgroundColor: 'var(--bg-white)', color: 'var(--text-dark)', padding: '2rem', border: 'var(--border-thick)', borderRadius: '50%' }}>
          <Rabbit size={80} color="var(--primary-orange)" className="flaming-carrot" />
        </div>
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
