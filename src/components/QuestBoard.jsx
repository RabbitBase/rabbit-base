import React, { useState, useEffect } from 'react';
import QuestItem from './QuestItem';
import { supabase } from '../utils/supabase';

export default function QuestBoard() {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitStatus, setSubmitStatus] = useState(''); // '' | 'success' | 'error'

  useEffect(() => {
    async function fetchQuests() {
      // Fetching 'active', 'open', and 'in_progress'
      const { data } = await supabase
        .from('quests')
        .select('*, assignee:assignee_id(username, avatar_url)')
        .in('status', ['active', 'open', 'in_progress'])
        .order('id', { ascending: false });
      if (data) {
        setQuests(data);
      }
      setLoading(false);
    }
    fetchQuests();
  }, []);

  const handleProposeQuest = async (e) => {
    e.preventDefault();
    setSubmitStatus('');
    
    // Check if logged in
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert("You must be logged in to propose a quest!");
      return;
    }

    const { error } = await supabase.from('quests').insert([{
      title,
      description,
      status: 'pending',
      exp_reward: 0
    }]);

    if (error) {
      console.error(error);
      setSubmitStatus('error');
    } else {
      setSubmitStatus('success');
      setTitle('');
      setDescription('');
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitStatus('');
      }, 2500);
    }
  };

  const handleClaimQuest = async (questId) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert("You must be logged in to claim a quest!");
      return;
    }

    const { error } = await supabase
      .from('quests')
      .update({ 
        assignee_id: session.user.id,
        status: 'in_progress',
        claimed_at: new Date().toISOString()
      })
      .eq('id', questId);

    if (error) {
      console.error(error);
      alert("Failed to claim quest! " + error.message);
    } else {
      // Re-fetch quests to reflect the new state
      const { data } = await supabase
        .from('quests')
        .select('*, assignee:assignee_id(username, avatar_url)')
        .in('status', ['active', 'open', 'in_progress'])
        .order('id', { ascending: false });
      if (data) setQuests(data);
    }
  };

  if (loading) return <div>Loading Quests...</div>;

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ margin: 0 }}>Colony Noticeboard</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="brutal-btn speed-streak-hover" 
          style={{ backgroundColor: 'var(--primary-orange)', padding: '0.5rem 1rem' }}
        >
          Propose a Quest
        </button>
      </div>

      <div className="brutal-box" style={{ backgroundColor: '#fff8eb', padding: '1.5rem' }}>
        <h3 style={{ borderBottom: 'var(--border-thick)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Active Colony Quests</h3>
        {quests.length === 0 ? (
          <p>No active quests right now. Relax in the burrow!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {quests.map((quest) => (
              <QuestItem 
                key={quest.id}
                quest={quest}
                onClaim={handleClaimQuest}
              />
            ))}
            <button className="brutal-btn blue speed-streak-hover" style={{ marginTop: '1rem' }}>View All Quests</button>
          </div>
        )}
      </div>

      {/* Brutalist Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div className="brutal-box" style={{ backgroundColor: 'var(--bg-white)', width: '90%', maxWidth: '500px', position: 'relative' }}>
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{ position: 'absolute', top: '-15px', right: '-15px', background: 'var(--primary-orange)', border: 'var(--border-thick)', fontWeight: 'bold', cursor: 'pointer', padding: '0.5rem', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              className="speed-streak-hover"
            >
              X
            </button>
            
            <h2 style={{ color: 'var(--primary-blue)', borderBottom: 'var(--border-thick)', paddingBottom: '0.5rem', marginTop: 0 }}>Suggestion Box</h2>
            
            {submitStatus === 'success' ? (
              <div style={{ backgroundColor: 'var(--primary-orange)', color: 'var(--text-dark)', border: 'var(--border-thick)', padding: '1.5rem', marginTop: '1rem', fontWeight: 'bold', textAlign: 'center', fontSize: '1.2rem' }}>
                🥕 Quest dropped in the suggestion box!
              </div>
            ) : (
              <form onSubmit={handleProposeQuest} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                <p style={{ fontWeight: 'bold', margin: 0 }}>Got a great idea for the colony? Pitch it to the admins!</p>
                <input 
                  type="text" 
                  placeholder="Quest Title (e.g. Build a new tunnel)" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  required 
                  style={{ padding: '0.8rem', border: 'var(--border-thick)', fontSize: '1rem', fontFamily: 'inherit' }}
                />
                <textarea 
                  placeholder="Describe the quest in detail..." 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  required 
                  rows={4}
                  style={{ padding: '0.8rem', border: 'var(--border-thick)', fontSize: '1rem', resize: 'vertical', fontFamily: 'inherit' }}
                />
                
                {submitStatus === 'error' && (
                  <p style={{ color: 'red', fontWeight: 'bold', margin: 0 }}>Failed to submit quest. You must be logged in!</p>
                )}

                <button type="submit" className="brutal-btn blue speed-streak-hover" style={{ marginTop: '0.5rem' }}>
                  Pitch Quest
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
