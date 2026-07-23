import React from 'react';
import { Flame, Pickaxe } from 'lucide-react';

export default function Dashboard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h2>Contributor Dashboard</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Streak */}
        <div className="brutal-box">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <Flame size={28} className="flaming-carrot" color="var(--primary-orange)" />
            Daily Streak
          </h3>
          <p style={{ fontSize: '4rem', fontWeight: '800', margin: '0.5rem 0', lineHeight: 1 }}>14</p>
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '1rem' }}>Days</p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
             {[...Array(5)].map((_, i) => (
                <Flame key={i} size={35} color={i < 4 ? "var(--primary-orange)" : "#ccc"} className={i < 4 ? "flaming-carrot" : ""} />
             ))}
          </div>
          <p style={{ marginTop: '1rem', fontWeight: 'bold', borderTop: 'var(--border-thick)', paddingTop: '1rem' }}>
            Keep the burrow warm! 1 day until next bonus.
          </p>
        </div>

        {/* EXP Bar */}
        <div className="brutal-box" style={{ backgroundColor: 'var(--primary-blue)', color: 'var(--bg-white)' }}>
           <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--bg-white)', margin: 0 }}>
            <Pickaxe size={28} />
            Digging Progress
          </h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '1.5rem 0' }}>Level 5 Elite Burrower</p>
          
          <div style={{ 
            width: '100%', 
            height: '40px', 
            backgroundColor: 'var(--text-dark)', 
            border: '4px solid var(--bg-white)',
            position: 'relative',
            overflow: 'hidden'
          }}>
             <div className="speed-streak-hover" style={{
                position: 'absolute',
                top: 0, left: 0, height: '100%',
                width: '65%',
                backgroundColor: 'var(--primary-orange)',
                borderRight: '4px solid var(--bg-white)'
             }}></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
            <span>2500 EXP</span>
            <span>4000 EXP</span>
          </div>
        </div>
      </div>
    </div>
  );
}
