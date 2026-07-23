import React, { useState, useEffect } from 'react';
import QuestItem from './QuestItem';
import { supabase } from '../utils/supabase';

export default function QuestBoard() {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuests() {
      const { data } = await supabase
        .from('quests')
        .select('*')
        .eq('status', 'active');
      if (data) {
        setQuests(data);
      }
      setLoading(false);
    }
    fetchQuests();
  }, []);

  if (loading) return <div>Loading Quests...</div>;

  return (
    <section>
      <h2>Colony Noticeboard</h2>
      <div className="brutal-box" style={{ backgroundColor: '#fff8eb', padding: '1.5rem' }}>
        <h3 style={{ borderBottom: 'var(--border-thick)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Colony Quests</h3>
        {quests.length === 0 ? (
          <p>No active quests right now. Relax in the burrow!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {quests.map((quest) => (
              <QuestItem 
                key={quest.id}
                title={quest.title} 
                exp={quest.exp_reward} 
                type="Quest" // We can add a 'type' column later if needed
              />
            ))}
            <button className="brutal-btn blue speed-streak-hover" style={{ marginTop: '1rem' }}>View All Quests</button>
          </div>
        )}
      </div>
    </section>
  );
}
