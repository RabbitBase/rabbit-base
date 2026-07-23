import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

export default function AdminDen() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectIcon, setProjectIcon] = useState('zap');

  const [questTitle, setQuestTitle] = useState('');
  const [questDesc, setQuestDesc] = useState('');
  const [questExp, setQuestExp] = useState(10);

  useEffect(() => {
    async function checkAdmin() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();
        if (data?.is_admin) {
          setIsAdmin(true);
        }
      }
      setLoading(false);
    }
    checkAdmin();
  }, []);

  const handleAddProject = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('projects').insert([
      { title: projectTitle, description: projectDesc, icon_url: projectIcon }
    ]);
    if (error) alert("Error adding project: " + error.message);
    else {
      alert("Project added!");
      setProjectTitle(''); setProjectDesc(''); setProjectIcon('zap');
    }
  };

  const handleAddQuest = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('quests').insert([
      { title: questTitle, description: questDesc, exp_reward: parseInt(questExp) }
    ]);
    if (error) alert("Error adding quest: " + error.message);
    else {
      alert("Quest added!");
      setQuestTitle(''); setQuestDesc(''); setQuestExp(10);
    }
  };

  if (loading) return <div>Checking authorization...</div>;
  if (!isAdmin) return <div className="brutal-box"><h2>Access Denied</h2><p>You must be an admin to enter the den.</p></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h2>Admin Den</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Add Project Form */}
        <div className="brutal-box">
          <h3 style={{ borderBottom: 'var(--border-thick)', paddingBottom: '0.5rem' }}>Add New Burrow (Project)</h3>
          <form onSubmit={handleAddProject} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <input 
              type="text" 
              placeholder="Project Title" 
              value={projectTitle} 
              onChange={(e) => setProjectTitle(e.target.value)} 
              required 
              style={{ padding: '0.8rem', border: 'var(--border-thick)', fontSize: '1rem' }}
            />
            <textarea 
              placeholder="Description" 
              value={projectDesc} 
              onChange={(e) => setProjectDesc(e.target.value)} 
              required 
              style={{ padding: '0.8rem', border: 'var(--border-thick)', fontSize: '1rem', resize: 'vertical' }}
            />
            <select 
              value={projectIcon} 
              onChange={(e) => setProjectIcon(e.target.value)}
              style={{ padding: '0.8rem', border: 'var(--border-thick)', fontSize: '1rem' }}
            >
              <option value="zap">Zap (Default)</option>
              <option value="shield">Shield</option>
              <option value="rocket">Rocket</option>
            </select>
            <button type="submit" className="brutal-btn speed-streak-hover">Add Project</button>
          </form>
        </div>

        {/* Add Quest Form */}
        <div className="brutal-box" style={{ backgroundColor: '#fff8eb' }}>
          <h3 style={{ borderBottom: 'var(--border-thick)', paddingBottom: '0.5rem' }}>Post New Quest</h3>
          <form onSubmit={handleAddQuest} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <input 
              type="text" 
              placeholder="Quest Title" 
              value={questTitle} 
              onChange={(e) => setQuestTitle(e.target.value)} 
              required 
              style={{ padding: '0.8rem', border: 'var(--border-thick)', fontSize: '1rem' }}
            />
            <textarea 
              placeholder="Description" 
              value={questDesc} 
              onChange={(e) => setQuestDesc(e.target.value)} 
              style={{ padding: '0.8rem', border: 'var(--border-thick)', fontSize: '1rem', resize: 'vertical' }}
            />
            <input 
              type="number" 
              placeholder="EXP Reward" 
              value={questExp} 
              onChange={(e) => setQuestExp(e.target.value)} 
              required 
              style={{ padding: '0.8rem', border: 'var(--border-thick)', fontSize: '1rem' }}
            />
            <button type="submit" className="brutal-btn blue speed-streak-hover">Post Quest</button>
          </form>
        </div>

      </div>
    </div>
  );
}
