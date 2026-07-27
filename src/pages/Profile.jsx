import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Pickaxe, Award, CheckCircle, LogOut } from 'lucide-react';
import { supabase } from '../utils/supabase';

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [userBadges, setUserBadges] = useState([]);
  const [runHistory, setRunHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Fetch Profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('exp, streak, is_admin')
          .eq('id', session.user.id)
          .single();
        setProfile(profileData);

        // Fetch Badges (Trophy Room)
        const { data: badgeData } = await supabase
          .from('user_badges')
          .select('*, badge:badges(*)')
          .eq('user_id', session.user.id);
        if (badgeData) setUserBadges(badgeData);

        // Fetch Run History (closed quests)
        const { data: historyData } = await supabase
          .from('quests')
          .select('*')
          .eq('assignee_id', session.user.id)
          .eq('status', 'closed')
          .order('id', { ascending: false });
        if (historyData) setRunHistory(historyData);
      }
      setLoading(false);
    }
    fetchDashboardData();
  }, []);

  if (loading) return <div>Loading Burrow...</div>;
  if (!profile) return <div>No profile found. Please re-login.</div>;

  const expToNextLevel = 4000;
  const currentExp = profile.exp || 0;
  const progressPercent = Math.min((currentExp / expToNextLevel) * 100, 100);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '3rem', margin: 0, textTransform: 'uppercase' }}>Contributor Profile</h2>
        <button onClick={handleLogout} className="brutal-btn speed-streak-hover" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#ff0055', color: '#fff', fontSize: '1.2rem' }}>
          <LogOut size={24} /> Logout
        </button>
      </div>
      
      {/* Top Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '2rem' }}>
        
        {/* Streak */}
        <div className="brutal-box">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <Flame size={28} className="flaming-carrot" color="var(--primary-orange)" />
            Daily Streak
          </h3>
          <p style={{ fontSize: '4rem', fontWeight: '800', margin: '0.5rem 0', lineHeight: 1 }}>{profile.streak || 0}</p>
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '1rem' }}>Days</p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
             {[...Array(5)].map((_, i) => (
                <Flame key={i} size={35} color={i < (profile.streak || 0) ? "var(--primary-orange)" : "#ccc"} className={i < (profile.streak || 0) ? "flaming-carrot" : ""} />
             ))}
          </div>
          <p style={{ marginTop: '1rem', fontWeight: 'bold', borderTop: 'var(--border-thick)', paddingTop: '1rem' }}>
            Keep the burrow warm!
          </p>
        </div>

        {/* EXP Bar */}
        <div className="brutal-box" style={{ backgroundColor: 'var(--primary-blue)', color: 'var(--bg-white)' }}>
           <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--bg-white)', margin: 0 }}>
            <Pickaxe size={28} />
            Digging Progress
          </h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '1.5rem 0' }}>Burrower Rank</p>
          
          <div style={{ 
            width: '100%', height: '40px', backgroundColor: 'var(--text-dark)', 
            border: '4px solid var(--bg-white)', position: 'relative', overflow: 'hidden'
          }}>
             <div className="speed-streak-hover" style={{
                position: 'absolute', top: 0, left: 0, height: '100%', width: `${progressPercent}%`,
                backgroundColor: 'var(--primary-orange)', borderRight: '4px solid var(--bg-white)'
             }}></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
            <span>{currentExp} EXP</span>
            <span>{expToNextLevel} EXP</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: '2rem' }}>
        
        {/* Trophy Room */}
        <div className="brutal-box" style={{ backgroundColor: '#fff8eb' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 1.5rem 0', borderBottom: 'var(--border-thick)', paddingBottom: '0.5rem' }}>
            <Award size={28} color="var(--primary-orange)" />
            The Trophy Room
          </h3>
          {userBadges.length === 0 ? (
            <p style={{ fontWeight: 'bold' }}>No badges earned yet. Time to start digging!</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem' }}>
              {userBadges.map(({ badge }) => (
                <div key={badge.id} style={{ 
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                  padding: '1rem', border: 'var(--border-thick)', backgroundColor: 'var(--bg-white)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '3rem' }}>{badge.icon_url || '🏆'}</div>
                  <strong style={{ fontSize: '1.1rem', color: 'var(--primary-blue)' }}>{badge.name}</strong>
                  <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-dark)' }}>{badge.description}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Run History */}
        <div className="brutal-box" style={{ backgroundColor: '#f0f4f8' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 1.5rem 0', borderBottom: 'var(--border-thick)', paddingBottom: '0.5rem' }}>
            <CheckCircle size={28} color="var(--primary-blue)" />
            Run History
          </h3>
          {runHistory.length === 0 ? (
            <p style={{ fontWeight: 'bold' }}>No completed runs yet. Accept a quest to get started!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {runHistory.map(quest => (
                <div key={quest.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '1rem', backgroundColor: 'var(--bg-white)', border: 'var(--border-thick)'
                }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary-blue)', fontSize: '1.2rem' }}>{quest.title}</h4>
                    {quest.github_link && (
                      <a href={quest.github_link} target="_blank" rel="noreferrer" style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--primary-orange)' }}>
                        🔗 View Mission Target
                      </a>
                    )}
                  </div>
                  <div style={{
                    backgroundColor: 'var(--primary-orange)', color: '#fff', padding: '0.4rem 0.8rem',
                    border: '2px solid var(--text-dark)', fontWeight: 'bold', transform: 'skewX(-10deg)',
                    flexShrink: 0, marginLeft: '1rem'
                  }}>
                    +{quest.exp_reward} EXP
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
