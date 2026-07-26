import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';

export default function AdminDen() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Direct Quest Form
  const [questTitle, setQuestTitle] = useState('');
  const [questDesc, setQuestDesc] = useState('');
  const [questExp, setQuestExp] = useState(10);
  const [questDifficulty, setQuestDifficulty] = useState('Medium');
  const [questTimeLimit, setQuestTimeLimit] = useState(72);
  const [questGithub, setQuestGithub] = useState('');

  // Pending Quests
  const [pendingQuests, setPendingQuests] = useState([]);
  const [approvalExp, setApprovalExp] = useState({});
  const [approvalTimeLimit, setApprovalTimeLimit] = useState({});

  // Global Event Form
  const [eventTitle, setEventTitle] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventLink, setEventLink] = useState('');
  const [eventDeadline, setEventDeadline] = useState('');

  // Featured Repo Form
  const [repoName, setRepoName] = useState('');
  const [repoDesc, setRepoDesc] = useState('');
  const [repoLink, setRepoLink] = useState('');
  const [repoTags, setRepoTags] = useState('');

  // Badge Form
  const [badgeName, setBadgeName] = useState('');
  const [badgeDesc, setBadgeDesc] = useState('');
  const [badgeIcon, setBadgeIcon] = useState('🏆');

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
      .select('*, author:profiles!quests_author_id_fkey(username)')
      .eq('status', 'pending');
      
    if (data) {
      setPendingQuests(data);
      const expInit = {};
      const timeInit = {};
      data.forEach(q => {
        expInit[q.id] = q.exp_reward || 0;
        timeInit[q.id] = q.time_limit_hours || 72;
      });
      setApprovalExp(expInit);
      setApprovalTimeLimit(timeInit);
    } else {
      const fallback = await supabase.from('quests').select('*').eq('status', 'pending');
      if (fallback.data) {
        setPendingQuests(fallback.data);
        const expInit = {};
        const timeInit = {};
        fallback.data.forEach(q => {
          expInit[q.id] = q.exp_reward || 0;
          timeInit[q.id] = q.time_limit_hours || 72;
        });
        setApprovalExp(expInit);
        setApprovalTimeLimit(timeInit);
      }
    }
  };

  const handleAddQuest = async (e) => {
    e.preventDefault();
    const { data: { session } } = await supabase.auth.getSession();
    
    const { error } = await supabase.from('quests').insert([{ 
      title: questTitle, 
      description: questDesc, 
      status: 'open', 
      exp_reward: parseInt(questExp),
      difficulty: questDifficulty,
      time_limit_hours: parseInt(questTimeLimit),
      github_link: questGithub || null,
      author_id: session?.user?.id
    }]);
    
    if (error) alert("Error adding quest: " + error.message);
    else {
      alert("Quest added!");
      setQuestTitle(''); setQuestDesc(''); setQuestExp(10);
      setQuestDifficulty('Medium'); setQuestTimeLimit(72); setQuestGithub('');
      fetchPendingQuests();
    }
  };

  const handleApproveQuest = async (questId) => {
    const exp = approvalExp[questId] || 0;
    const timeLimit = approvalTimeLimit[questId] || 72;
    
    const { error } = await supabase
      .from('quests')
      .update({ 
        status: 'open', 
        exp_reward: parseInt(exp),
        time_limit_hours: parseInt(timeLimit)
      })
      .eq('id', questId);
      
    if (error) {
      alert("Error approving quest: " + error.message);
    } else {
      alert("Quest approved and opened!");
      fetchPendingQuests();
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('global_events').insert([{
      title: eventTitle,
      description: eventDesc,
      link: eventLink || null,
      deadline: eventDeadline ? new Date(eventDeadline).toISOString() : null,
      is_active: true
    }]);
    if (error) alert("Error adding event: " + error.message);
    else {
      alert("Global Event live!");
      setEventTitle(''); setEventDesc(''); setEventLink(''); setEventDeadline('');
    }
  };

  const handleAddRepo = async (e) => {
    e.preventDefault();
    const tagsArray = repoTags ? repoTags.split(',').map(t => t.trim()) : [];
    const { error } = await supabase.from('featured_repos').insert([{
      name: repoName,
      description: repoDesc,
      github_link: repoLink || null,
      tags: tagsArray
    }]);
    if (error) alert("Error adding repo: " + error.message);
    else {
      alert("Featured Repo added!");
      setRepoName(''); setRepoDesc(''); setRepoLink(''); setRepoTags('');
    }
  };

  const handleAddBadge = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('badges').insert([{
      name: badgeName,
      description: badgeDesc,
      icon_url: badgeIcon
    }]);
    if (error) alert("Error creating badge: " + error.message);
    else {
      alert("Badge created in the system!");
      setBadgeName(''); setBadgeDesc(''); setBadgeIcon('🏆');
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
              <div key={quest.id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', backgroundColor: 'var(--bg-white)', border: 'var(--border-thick)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary-blue)', fontSize: '1.4rem' }}>{quest.title}</h4>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                      <span style={{ backgroundColor: '#f0f0f0', border: '1px solid black', padding: '0.2rem 0.5rem' }}>Diff: {quest.difficulty}</span>
                      {quest.author?.username && <span style={{ backgroundColor: '#f0f0f0', border: '1px solid black', padding: '0.2rem 0.5rem' }}>By: {quest.author.username}</span>}
                      {quest.github_link && <a href={quest.github_link} target="_blank" rel="noreferrer" style={{ backgroundColor: '#e6f2ff', border: '1px solid black', padding: '0.2rem 0.5rem', color: 'var(--primary-blue)', textDecoration: 'none' }}>🔗 GitHub</a>}
                    </div>
                    <p style={{ margin: 0 }}>{quest.description}</p>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', backgroundColor: '#fafafa', padding: '1rem', border: 'var(--border-thick)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <label style={{ fontWeight: 'bold', width: '80px' }}>Reward:</label>
                      <input type="number" placeholder="EXP" value={approvalExp[quest.id] || ''} onChange={(e) => setApprovalExp({...approvalExp, [quest.id]: e.target.value})} style={{ width: '80px', padding: '0.5rem', border: 'var(--border-thick)', fontSize: '1rem', fontWeight: 'bold' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <label style={{ fontWeight: 'bold', width: '80px' }}>Time (h):</label>
                      <input type="number" placeholder="Hours" value={approvalTimeLimit[quest.id] || ''} onChange={(e) => setApprovalTimeLimit({...approvalTimeLimit, [quest.id]: e.target.value})} style={{ width: '80px', padding: '0.5rem', border: 'var(--border-thick)', fontSize: '1rem', fontWeight: 'bold' }} />
                    </div>
                    <button onClick={() => handleApproveQuest(quest.id)} className="brutal-btn speed-streak-hover" style={{ backgroundColor: 'var(--primary-orange)', padding: '0.5rem 1rem', width: '100%', marginTop: '0.5rem' }}>Approve Quest</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        
        {/* Post New Quest directly */}
        <div className="brutal-box" style={{ backgroundColor: '#fff8eb' }}>
          <h3 style={{ borderBottom: 'var(--border-thick)', paddingBottom: '0.5rem' }}>Post New Quest directly</h3>
          <form onSubmit={handleAddQuest} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <input type="text" placeholder="Quest Title" value={questTitle} onChange={(e) => setQuestTitle(e.target.value)} required style={{ padding: '0.8rem', border: 'var(--border-thick)', fontSize: '1rem' }} />
            <textarea placeholder="Description" value={questDesc} onChange={(e) => setQuestDesc(e.target.value)} style={{ padding: '0.8rem', border: 'var(--border-thick)', fontSize: '1rem', resize: 'vertical' }} />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <select value={questDifficulty} onChange={(e) => setQuestDifficulty(e.target.value)} style={{ padding: '0.8rem', border: 'var(--border-thick)', fontSize: '1rem', flex: 1 }}>
                <option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Hard">Hard</option><option value="Epic">Epic</option>
              </select>
              <input type="number" placeholder="Time (h)" value={questTimeLimit} onChange={(e) => setQuestTimeLimit(e.target.value)} required style={{ padding: '0.8rem', border: 'var(--border-thick)', fontSize: '1rem', width: '100px' }} />
            </div>
            <input type="number" placeholder="EXP Reward" value={questExp} onChange={(e) => setQuestExp(e.target.value)} required style={{ padding: '0.8rem', border: 'var(--border-thick)', fontSize: '1rem' }} />
            <input type="url" placeholder="GitHub Link (Optional)" value={questGithub} onChange={(e) => setQuestGithub(e.target.value)} style={{ padding: '0.8rem', border: 'var(--border-thick)', fontSize: '1rem' }} />
            <button type="submit" className="brutal-btn blue speed-streak-hover">Post Quest</button>
          </form>
        </div>

        {/* Global Event Form */}
        <div className="brutal-box" style={{ backgroundColor: '#eef8f5' }}>
          <h3 style={{ borderBottom: 'var(--border-thick)', paddingBottom: '0.5rem' }}>Broadcast Global Event</h3>
          <form onSubmit={handleAddEvent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <input type="text" placeholder="Event Title (e.g. GSoC'27)" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} required style={{ padding: '0.8rem', border: 'var(--border-thick)', fontSize: '1rem' }} />
            <textarea placeholder="Description" value={eventDesc} onChange={(e) => setEventDesc(e.target.value)} required style={{ padding: '0.8rem', border: 'var(--border-thick)', fontSize: '1rem', resize: 'vertical' }} />
            <input type="url" placeholder="Link" value={eventLink} onChange={(e) => setEventLink(e.target.value)} style={{ padding: '0.8rem', border: 'var(--border-thick)', fontSize: '1rem' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 'bold' }}>Deadline:</label>
              <input type="datetime-local" value={eventDeadline} onChange={(e) => setEventDeadline(e.target.value)} required style={{ padding: '0.8rem', border: 'var(--border-thick)', fontSize: '1rem', fontFamily: 'inherit' }} />
            </div>
            <button type="submit" className="brutal-btn speed-streak-hover" style={{ backgroundColor: 'var(--primary-orange)' }}>Broadcast Event</button>
          </form>
        </div>

        {/* Featured Repo Form */}
        <div className="brutal-box" style={{ backgroundColor: '#f0e6fa' }}>
          <h3 style={{ borderBottom: 'var(--border-thick)', paddingBottom: '0.5rem' }}>Add Featured Repo</h3>
          <form onSubmit={handleAddRepo} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <input type="text" placeholder="Repo Name (e.g. Kubernetes)" value={repoName} onChange={(e) => setRepoName(e.target.value)} required style={{ padding: '0.8rem', border: 'var(--border-thick)', fontSize: '1rem' }} />
            <textarea placeholder="Description" value={repoDesc} onChange={(e) => setRepoDesc(e.target.value)} required style={{ padding: '0.8rem', border: 'var(--border-thick)', fontSize: '1rem', resize: 'vertical' }} />
            <input type="url" placeholder="GitHub Link" value={repoLink} onChange={(e) => setRepoLink(e.target.value)} required style={{ padding: '0.8rem', border: 'var(--border-thick)', fontSize: '1rem' }} />
            <input type="text" placeholder="Tags (comma separated)" value={repoTags} onChange={(e) => setRepoTags(e.target.value)} style={{ padding: '0.8rem', border: 'var(--border-thick)', fontSize: '1rem' }} />
            <button type="submit" className="brutal-btn blue speed-streak-hover">Add Repo</button>
          </form>
        </div>

        {/* Badge Form */}
        <div className="brutal-box" style={{ backgroundColor: '#fff' }}>
          <h3 style={{ borderBottom: 'var(--border-thick)', paddingBottom: '0.5rem' }}>Create New Badge</h3>
          <form onSubmit={handleAddBadge} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <input type="text" placeholder="Badge Name" value={badgeName} onChange={(e) => setBadgeName(e.target.value)} required style={{ padding: '0.8rem', border: 'var(--border-thick)', fontSize: '1rem' }} />
            <input type="text" placeholder="Description" value={badgeDesc} onChange={(e) => setBadgeDesc(e.target.value)} required style={{ padding: '0.8rem', border: 'var(--border-thick)', fontSize: '1rem' }} />
            <input type="text" placeholder="Icon Emoji or URL" value={badgeIcon} onChange={(e) => setBadgeIcon(e.target.value)} required style={{ padding: '0.8rem', border: 'var(--border-thick)', fontSize: '1rem' }} />
            <button type="submit" className="brutal-btn speed-streak-hover" style={{ backgroundColor: 'var(--text-dark)', color: '#fff' }}>Create Badge</button>
          </form>
        </div>

      </div>
    </div>
  );
}
