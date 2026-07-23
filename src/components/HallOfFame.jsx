import React, { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import { supabase } from '../utils/supabase';

export default function HallOfFame() {
  const [eliteUsers, setEliteUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopUsers() {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, exp')
        .order('exp', { ascending: false })
        .limit(10);
      
      if (data) {
        setEliteUsers(data);
      }
      setLoading(false);
    }
    fetchTopUsers();
  }, []);

  if (loading) return <div>Loading Hall of Fame...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><Trophy size={40} color="var(--primary-orange)" /> Elite Burrowers</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {eliteUsers.map((user, index) => {
          const rank = index + 1;
          const name = user.username || 'Unknown Burrower';
          const level = Math.floor((user.exp || 0) / 1000) + 1; // simple calculation

          return (
            <div key={user.username || index} className="brutal-box speed-streak-hover" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '2rem',
              backgroundColor: rank === 1 ? 'var(--primary-blue)' : '#fff',
              color: rank === 1 ? '#fff' : 'var(--text-dark)'
            }}>
              <h3 style={{ fontSize: '3rem', margin: 0, width: '60px' }}>#{rank}</h3>
              
              <div style={{
                width: '90px', height: '90px',
                border: `6px solid ${rank === 1 ? 'var(--primary-orange)' : 'var(--text-dark)'}`,
                borderRadius: rank === 1 ? '50% 50% 0 0' : rank === 2 ? '20%' : '0', 
                backgroundColor: '#ccc',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden',
                boxShadow: rank === 1 ? '4px 4px 0px 0px var(--primary-orange)' : 'none'
              }}>
                 <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${name}`} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              
              <div style={{ flex: 1 }}>
                 <h3 style={{ margin: 0, fontSize: '1.8rem', color: rank === 1 ? '#fff' : 'var(--primary-blue)' }}>{name}</h3>
                 <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Level {level} Burrower</p>
              </div>
              
              <div style={{ textAlign: 'right', backgroundColor: rank === 1 ? 'var(--bg-white)' : 'var(--primary-orange)', padding: '1rem', border: 'var(--border-thick)', color: 'var(--text-dark)', transform: 'skewX(-5deg)' }}>
                 <p style={{ fontSize: '1.5rem', fontWeight: '900', margin: 0 }}>{user.exp || 0} EXP</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
