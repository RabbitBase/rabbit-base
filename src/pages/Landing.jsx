import React from 'react';
import Auth from '../components/Auth';
import { Rabbit } from 'lucide-react';

export default function Landing() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '3rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '600px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
           <div style={{ padding: '2rem', backgroundColor: 'var(--primary-orange)', borderRadius: '50%', border: 'var(--border-thick)' }}>
             <Rabbit size={100} color="var(--bg-white)" className="flaming-carrot" />
           </div>
        </div>
        <h1 style={{ fontSize: '4rem', color: 'var(--primary-blue)', marginBottom: '1rem' }}>Rabbit Base</h1>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Your open-source warren for daily-use tools. Join the burrow.</p>
      </div>
      
      <Auth />
    </div>
  );
}
