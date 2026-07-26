import React, { useState, useEffect } from 'react';
import QuestItem from './QuestItem';
import { supabase } from '../utils/supabase';

export default function QuestBoard() {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [isProposeModalOpen, setIsProposeModalOpen] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState(null); // For the details modal
  
  // Propose Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [githubLink, setGithubLink] = useState('');
  const [submitStatus, setSubmitStatus] = useState('');

  useEffect(() => {
    fetchQuests();
  }, []);

  async function fetchQuests() {
    // Explicitly disambiguating the two foreign keys that point to profiles
    const { data, error } = await supabase
      .from('quests')
      .select('*, assignee:profiles!quests_assignee_id_fkey(username, avatar_url), author:profiles!quests_author_id_fkey(username, avatar_url)')
      .in('status', ['active', 'open', 'in_progress'])
      .order('id', { ascending: false });
      
    if (error) {
      console.error("Error fetching quests:", error);
      // Fallback query if the disambiguation fails (e.g. they named the FK differently)
      const fallback = await supabase
        .from('quests')
        .select('*')
        .in('status', ['active', 'open', 'in_progress'])
        .order('id', { ascending: false });
      if (fallback.data) setQuests(fallback.data);
    } else if (data) {
      setQuests(data);
    }
    setLoading(false);
  }

  const handleProposeQuest = async (e) => {
    e.preventDefault();
    setSubmitStatus('');
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert("You must be logged in to propose a quest!");
      return;
    }

    const { error } = await supabase.from('quests').insert([{
      title,
      description,
      difficulty,
      github_link: githubLink || null,
      author_id: session.user.id,
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
      setDifficulty('Medium');
      setGithubLink('');
      setTimeout(() => {
        setIsProposeModalOpen(false);
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
      setSelectedQuest(null);
      fetchQuests();
    }
  };

  if (loading) return <div>Loading Quests...</div>;

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ margin: 0 }}>Colony Noticeboard</h2>
        <button 
          onClick={() => setIsProposeModalOpen(true)}
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
                onClick={() => setSelectedQuest(quest)}
              />
            ))}
            <button className="brutal-btn blue speed-streak-hover" style={{ marginTop: '1rem' }}>View All Quests</button>
          </div>
        )}
      </div>

      {/* Quest Details Modal */}
      {selectedQuest && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          padding: '1rem'
        }}>
          <div className="brutal-box" style={{ 
            backgroundColor: 'var(--bg-white)', 
            width: '100%', maxWidth: '600px', 
            position: 'relative',
            display: 'flex', flexDirection: 'column',
            maxHeight: '90vh'
          }}>
            <button 
              onClick={() => setSelectedQuest(null)}
              style={{ 
                position: 'absolute', top: '-15px', right: '-15px', 
                background: 'var(--primary-orange)', border: 'var(--border-thick)', 
                fontWeight: 'bold', cursor: 'pointer', padding: '0.5rem', 
                width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 10
              }}
              className="speed-streak-hover"
            >
              X
            </button>
            
            <div style={{ overflowY: 'auto', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: 'var(--border-thick)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <h2 style={{ color: 'var(--primary-blue)', margin: 0, fontSize: '1.8rem' }}>{selectedQuest.title}</h2>
                <div style={{ 
                  backgroundColor: 'var(--primary-orange)', color: '#fff', 
                  padding: '0.5rem 1rem', border: '2px solid var(--text-dark)', 
                  fontWeight: 'bold', transform: 'skewX(-10deg)', flexShrink: 0, marginLeft: '1rem'
                }}>
                  +{selectedQuest.exp_reward} EXP
                </div>
              </div>

              {/* Stat Block */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                <div style={{ backgroundColor: '#f0f0f0', border: '2px solid var(--text-dark)', padding: '0.3rem 0.6rem', fontWeight: 'bold' }}>
                  Difficulty: {selectedQuest.difficulty || 'Medium'}
                </div>
                <div style={{ backgroundColor: '#f0f0f0', border: '2px solid var(--text-dark)', padding: '0.3rem 0.6rem', fontWeight: 'bold' }}>
                  Time Limit: {selectedQuest.time_limit_hours || 72}h
                </div>
                <div style={{ backgroundColor: '#f0f0f0', border: '2px solid var(--text-dark)', padding: '0.3rem 0.6rem', fontWeight: 'bold' }}>
                  Author: {selectedQuest.author?.username || 'The Colony'}
                </div>
              </div>

              <div style={{ marginBottom: '2rem', fontSize: '1.1rem', lineHeight: '1.6' }}>
                {selectedQuest.description}
              </div>

              {selectedQuest.github_link && (
                <a 
                  href={selectedQuest.github_link} 
                  target="_blank" 
                  rel="noreferrer"
                  className="brutal-btn speed-streak-hover"
                  style={{ display: 'inline-block', marginBottom: '2rem', backgroundColor: '#e6f2ff' }}
                >
                  🔗 View Mission Target (GitHub)
                </a>
              )}
            </div>

            {/* Action Zone pinned at bottom */}
            <div style={{ borderTop: 'var(--border-thick)', padding: '1rem', backgroundColor: '#fafafa' }}>
              {(selectedQuest.status === 'open' || selectedQuest.status === 'active') ? (
                <button 
                  onClick={() => handleClaimQuest(selectedQuest.id)}
                  className="speed-streak-hover" 
                  style={{ 
                    width: '100%', backgroundColor: 'var(--primary-blue)', color: '#fff', 
                    padding: '1rem', border: 'var(--border-thick)', fontWeight: 'bold', 
                    fontSize: '1.2rem', textTransform: 'uppercase', cursor: 'pointer'
                  }}
                >
                  Start Digging
                </button>
              ) : (
                <div style={{ 
                  width: '100%', backgroundColor: '#f8fbff', padding: '1rem', 
                  border: '3px dashed var(--text-dark)', fontWeight: 'bold',
                  textAlign: 'center', textTransform: 'uppercase', color: 'var(--text-dark)', fontSize: '1.1rem'
                }}>
                  🚧 In progress by {selectedQuest.assignee?.username || 'a burrower'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Propose Modal */}
      {isProposeModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem'
        }}>
          <div className="brutal-box" style={{ backgroundColor: 'var(--bg-white)', width: '100%', maxWidth: '500px', position: 'relative' }}>
            <button 
              onClick={() => setIsProposeModalOpen(false)}
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
                  rows={3}
                  style={{ padding: '0.8rem', border: 'var(--border-thick)', fontSize: '1rem', resize: 'vertical', fontFamily: 'inherit' }}
                />
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <select 
                    value={difficulty} 
                    onChange={(e) => setDifficulty(e.target.value)}
                    style={{ padding: '0.8rem', border: 'var(--border-thick)', fontSize: '1rem', fontFamily: 'inherit', flex: 1 }}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                    <option value="Epic">Epic</option>
                  </select>
                </div>

                <input 
                  type="url" 
                  placeholder="GitHub Issue Link (Optional)" 
                  value={githubLink} 
                  onChange={(e) => setGithubLink(e.target.value)} 
                  style={{ padding: '0.8rem', border: 'var(--border-thick)', fontSize: '1rem', fontFamily: 'inherit' }}
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
