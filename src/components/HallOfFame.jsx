import React from 'react';
import { Trophy } from 'lucide-react';

const eliteUsers = [
  { name: 'BunnyMaster99', level: 42, exp: '120k', rank: 1 },
  { name: 'CarrotCruncher', level: 38, exp: '95k', rank: 2 },
  { name: 'DigDug', level: 35, exp: '80k', rank: 3 },
  { name: 'SpeedyPaws', level: 20, exp: '40k', rank: 4 }
];

export default function HallOfFame() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><Trophy size={40} color="var(--primary-orange)" /> Elite Burrowers</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {eliteUsers.map((user) => (
          <div key={user.name} className="brutal-box speed-streak-hover" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '2rem',
            backgroundColor: user.rank === 1 ? 'var(--primary-blue)' : '#fff',
            color: user.rank === 1 ? '#fff' : 'var(--text-dark)'
          }}>
            <h3 style={{ fontSize: '3rem', margin: 0, width: '60px' }}>#{user.rank}</h3>
            
            {/* Evolving avatar frame based on rank */}
            <div style={{
              width: '90px', height: '90px',
              border: `6px solid ${user.rank === 1 ? 'var(--primary-orange)' : 'var(--text-dark)'}`,
              borderRadius: user.rank === 1 ? '50% 50% 0 0' : user.rank === 2 ? '20%' : '0', 
              backgroundColor: '#ccc',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
              boxShadow: user.rank === 1 ? '4px 4px 0px 0px var(--primary-orange)' : 'none'
            }}>
               <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            
            <div style={{ flex: 1 }}>
               <h3 style={{ margin: 0, fontSize: '1.8rem', color: user.rank === 1 ? '#fff' : 'var(--primary-blue)' }}>{user.name}</h3>
               <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Level {user.level} Burrower</p>
            </div>
            
            <div style={{ textAlign: 'right', backgroundColor: user.rank === 1 ? 'var(--bg-white)' : 'var(--primary-orange)', padding: '1rem', border: 'var(--border-thick)', color: 'var(--text-dark)', transform: 'skewX(-5deg)' }}>
               <p style={{ fontSize: '1.5rem', fontWeight: '900', margin: 0 }}>{user.exp} EXP</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
