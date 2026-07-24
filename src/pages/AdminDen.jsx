import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';

export default function AdminDen() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectIcon, setProjectIcon] = useState('zap');

  const [questTitle, setQuestTitle] = useState('');
  const [questDesc, setQuestDesc] = useState('');
  const [questExp, setQuestExp] = useState(10);

  const [pendingQuests, setPendingQuests] = useState([]);
  const [approvalExp, setApprovalExp] = useState({});

  useEffect(() => {
    async function checkAdminAndFetch() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();
        if (data?.is_admin) {
          setIsAdmin(true);
          fetchPendingQuests();
        } else {
          navigate('/dashboard'); // Strict route guard redirect
        }
      } else {
        navigate('/'); // Not logged in
      }
      setLoading(false);
    }
    checkAdminAndFetch();
  }, [navigate]);

  const fetchPendingQuests = async () => {
    const { data } = await supabase
      .from('quests')
      .select('*')
      .eq('status', 'pending');
    if (data) {
      setPendingQuests(data);
    }
  };

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
      { title: questTitle, description: questDesc, status: 'open', exp_reward: parseInt(questExp) }
    ]);
    if (error) alert("Error adding quest: " + error.message);
    else {
      alert("Quest added!");
      setQuestTitle(''); setQuestDesc(''); setQuestExp(10);
      fetchPendingQuests();
    }
  };

  const handleApproveQuest = async (questId) => {
    const exp = approvalExp[questId] || 0;
    const { error } = await supabase
      .from('quests')
      .update({ status: 'open', exp_reward: parseInt(exp) })
      .eq('id', questId);
      
    if (error) {
      alert("Error approving quest: " + error.message);
    } else {
      alert("Quest approved and opened!");
      fetchPendingQuests();
    }
  };

  if (loading) return <div>Checking authorization...</div>;
  if (!isAdmin) return null; // Redirecting, so don't render anything

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h2>Admin Den</h2>
      
      {/* Pending Quests Queue */}
      <div className="brutal-box" style={{ backgroundColor: '#e6f2ff' }}>
        <h3 style={{ borderBottom: 'var(--border-thick)', paddingBottom: '0.5rem' }}>Pending Quest Suggestions</h3>
        {pendingQuests.length === 0 ? (
          <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>No pending quests right now. The colony is quiet!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {pendingQuests.map(quest => (
              <div key={quest.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', padding: '1rem', backgroundColor: 'var(--bg-white)', border: 'var(--border-thick)' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary-blue)' }}>{quest.title}</h4>
                  <p style={{ margin: 0 }}>{quest.description}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input 
                    type="number" 
                    placeholder="EXP"
                    value={approvalExp[quest.id] || ''}
                    onChange={(e) => setApprovalExp({...approvalExp, [quest.id]: e.target.value})}
                    style={{ width: '80px', padding: '0.5rem', border: 'var(--border-thick)', fontSize: '1rem', fontWeight: 'bold' }}
                  />
                  <button 
                    onClick={() => handleApproveQuest(quest.id)}
                    className="brutal-btn speed-streak-hover" 
                    style={{ backgroundColor: 'var(--primary-orange)', padding: '0.5rem 1rem' }}
                  >
                    Approve Quest
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
          <h3 style={{ borderBottom: 'var(--border-thick)', paddingBottom: '0.5rem' }}>Post New Quest directly</h3>
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
