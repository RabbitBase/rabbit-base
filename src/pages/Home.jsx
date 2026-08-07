import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { Globe, MapPin, EyeOff } from 'lucide-react';
import { generateRoadmap } from '../utils/generateRoadmap';
import { supabase } from '../utils/supabase';

export default function Home() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('LOCAL');
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmapData, setRoadmapData] = useState("");
  
  // Database and Form State
  const [bounties, setBounties] = useState([]);
  const [newRepoName, setNewRepoName] = useState("");
  const [newRepoUrl, setNewRepoUrl] = useState("");
  
  // Selection and Goal State
  const [selectedBounty, setSelectedBounty] = useState(null);
  const [goal, setGoal] = useState("First Good Issue");

  const fetchBounties = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const { data, error } = await supabase
      .from('user_bounties')
      .select('*')
      .eq('bounty_type', activeTab.toLowerCase())
      .order('created_at', { ascending: false });
      
    if (data) {
      setBounties(data);
    }
  };

  useEffect(() => {
    fetchBounties();
    setSelectedBounty(null);
    setRoadmapData("");
  }, [activeTab]);

  const handleTrackTarget = async () => {
    if (!newRepoName || !newRepoUrl) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    await supabase.from('user_bounties').insert([
      { 
        user_id: user.id, 
        repo_name: newRepoName, 
        repo_url: newRepoUrl, 
        bounty_type: activeTab.toLowerCase() 
      }
    ]);
    
    setNewRepoName("");
    setNewRepoUrl("");
    fetchBounties();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      
      {/* Onboarding Banner (Maintained) */}
      <section className="brutal-box" style={{ backgroundColor: 'var(--primary-blue)', color: 'var(--bg-white)', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <img src={logo} alt="Rabbit Base Logo" style={{ width: '100px', height: '100px', objectFit: 'cover', border: 'var(--border-thick)', boxShadow: 'var(--shadow-brutal)' }} className="flaming-carrot" />
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Rabbit Training Program</h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>
              Welcome to the Burrow! Take your first steps into the open-source warren. Complete this quick tutorial to unlock your dashboard.
            </p>
            <button onClick={() => navigate('/explore')} className="brutal-btn speed-streak-hover">Finish Training & Dig In</button>
          </div>
        </div>
      </section>

      {/* The Bounty Board */}
      <div>
        <h2 style={{ fontSize: '3rem', margin: '0 0 1rem 0', textTransform: 'uppercase' }}>THE BOUNTY BOARD</h2>
        
        {/* Chunky Tabs */}
        <div style={{ display: 'flex', gap: '1rem', borderBottom: 'var(--border-thick)', paddingBottom: '1rem' }}>
          <button 
            className="brutal-box nav-btn-hover"
            onClick={() => setActiveTab('GLOBAL')}
            style={{ 
              flex: 1, 
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              backgroundColor: activeTab === 'GLOBAL' ? 'var(--primary-orange)' : 'var(--bg-white)',
              color: activeTab === 'GLOBAL' ? '#fff' : 'var(--text-dark)',
              fontSize: '1.5rem', fontWeight: '900', padding: '1rem', cursor: 'pointer'
            }}>
            <Globe size={20} strokeWidth={2.5} /> GLOBAL
          </button>
          <button 
            className="brutal-box nav-btn-hover"
            onClick={() => setActiveTab('LOCAL')}
            style={{ 
              flex: 1, 
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              backgroundColor: activeTab === 'LOCAL' ? 'var(--primary-blue)' : 'var(--bg-white)',
              color: activeTab === 'LOCAL' ? '#fff' : 'var(--text-dark)',
              fontSize: '1.5rem', fontWeight: '900', padding: '1rem', cursor: 'pointer'
            }}>
            <MapPin size={20} strokeWidth={2.5} /> LOCAL BOUNTIES
          </button>
          <button 
            className="brutal-box nav-btn-hover"
            onClick={() => setActiveTab('PRIVATE')}
            style={{ 
              flex: 1, 
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              backgroundColor: activeTab === 'PRIVATE' ? 'var(--text-dark)' : 'var(--bg-white)',
              color: activeTab === 'PRIVATE' ? '#0f0' : 'var(--text-dark)',
              fontSize: '1.5rem', fontWeight: '900', padding: '1rem', cursor: 'pointer',
              border: activeTab === 'PRIVATE' ? '4px solid #0f0' : 'var(--border-thick)'
            }}>
            <EyeOff size={20} strokeWidth={2.5} /> SAFEHOUSE
          </button>
        </div>

        {/* Tab Content */}
        <div style={{ marginTop: '2rem' }}>
          {activeTab === 'GLOBAL' && (
            <div className="brutal-box" style={{ 
              minHeight: '300px', backgroundColor: 'var(--primary-orange)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', overflow: 'hidden'
            }}>
              <div style={{
                backgroundColor: 'var(--text-dark)', color: '#fff', padding: '2rem 4rem',
                transform: 'rotate(-5deg)', border: '4px solid #fff', boxShadow: '10px 10px 0 #fff'
              }}>
                <h3 style={{ margin: 0, fontSize: '3rem', fontWeight: '900', letterSpacing: '2px' }}>COMING SOON</h3>
              </div>
            </div>
          )}

          {activeTab === 'LOCAL' && (
            <div className="brutal-box" style={{ minHeight: '300px', backgroundColor: '#fff8eb' }}>
              <h3 style={{ fontSize: '2rem', margin: '0 0 1rem 0' }}>Tactical Tracking</h3>
              <p style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '2rem', color: 'var(--text-dark)' }}>
                Add Organizations or Repositories of Interest. This list is completely private to you.
              </p>
              
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <input 
                  type="text" 
                  value={newRepoName}
                  onChange={(e) => setNewRepoName(e.target.value)}
                  placeholder="Repo Name (e.g., Rabbit Base)" 
                  className="brutal-box" 
                  style={{ flex: 1, padding: '1rem', fontSize: '1.2rem', outline: 'none' }}
                />
                <input 
                  type="text" 
                  value={newRepoUrl}
                  onChange={(e) => setNewRepoUrl(e.target.value)}
                  placeholder="Repo URL (e.g., https://github.com/...)" 
                  className="brutal-box" 
                  style={{ flex: 2, padding: '1rem', fontSize: '1.2rem', outline: 'none' }}
                />
                <button 
                  onClick={handleTrackTarget}
                  className="brutal-btn speed-streak-hover" 
                  style={{ backgroundColor: 'var(--primary-blue)', color: '#fff' }}>
                  TRACK TARGET
                </button>
              </div>

              {/* Active Bounties List */}
              {bounties.length > 0 && (
                <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {bounties.map((bounty) => (
                    <button
                      key={bounty.id}
                      onClick={() => setSelectedBounty(bounty)}
                      className="brutal-box"
                      style={{
                        padding: '0.5rem 1rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        backgroundColor: selectedBounty?.id === bounty.id ? 'var(--primary-orange)' : 'var(--bg-white)',
                        color: selectedBounty?.id === bounty.id ? '#fff' : 'var(--text-dark)',
                      }}
                    >
                      {bounty.repo_name}
                    </button>
                  ))}
                </div>
              )}

              {/* AI GENERATION SECTION */}
              <div style={{ borderTop: 'var(--border-thick)', paddingTop: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                  <label style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Select Goal:</label>
                  <select 
                    className="brutal-box"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    style={{ padding: '0.5rem 1rem', fontSize: '1.1rem', outline: 'none', cursor: 'pointer' }}
                  >
                    <option value="First Good Issue">First Good Issue</option>
                    <option value="Architecture Setup">Architecture Setup</option>
                    <option value="Bug Hunting">Bug Hunting</option>
                  </select>
                </div>

                <button 
                  onClick={async () => {
                    if (!selectedBounty) return;
                    setIsGenerating(true);
                    setRoadmapData("");
                    try {
                      const result = await generateRoadmap(selectedBounty.repo_name, selectedBounty.repo_url, goal);
                      setRoadmapData(result);
                    } catch (err) {
                      setRoadmapData("Error decrypting target. Ensure your VITE_GEMINI_API_KEY is valid in .env.local.");
                    } finally {
                      setIsGenerating(false);
                    }
                  }}
                  disabled={isGenerating || !selectedBounty}
                  className="brutal-box"
                  style={{ 
                    backgroundColor: isGenerating || !selectedBounty ? '#ccc' : 'var(--primary-orange)', 
                    color: '#000', 
                    padding: '1rem 2rem', 
                    fontSize: '1.2rem', 
                    fontWeight: '900',
                    cursor: isGenerating || !selectedBounty ? 'not-allowed' : 'pointer',
                    width: '100%'
                  }}>
                  {isGenerating ? 'DECRYPTING TARGET...' : '[ GENERATE AI ROADMAP ]'}
                </button>

                {roadmapData && (
                  <div className="brutal-box" style={{ marginTop: '1.5rem', backgroundColor: '#111', color: '#0f0', padding: '1.5rem', whiteSpace: 'pre-wrap' }}>
                    <h4 style={{ margin: '0 0 1rem 0', textTransform: 'uppercase', color: '#fff' }}>Mission Briefing</h4>
                    <p style={{ margin: 0, fontFamily: 'monospace', lineHeight: '1.5' }}>{roadmapData}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'PRIVATE' && (
            <div className="brutal-box" style={{ 
              minHeight: '300px', 
              backgroundColor: '#111', 
              color: '#0f0', 
              border: '4px solid #fff',
              boxShadow: '8px 8px 0 #fff'
            }}>
              <h3 style={{ fontSize: '2rem', margin: '0 0 1rem 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Stealth Safehouse</h3>
              <p style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '2rem', color: '#fff' }}>
                RESTRICTED AREA. Add Personal Repositories. Visible only to you.
              </p>
              
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <input 
                  type="text" 
                  value={newRepoName}
                  onChange={(e) => setNewRepoName(e.target.value)}
                  placeholder="Repo Name (e.g., Classified Project)" 
                  style={{ 
                    flex: 1, padding: '1rem', fontSize: '1.2rem', outline: 'none', 
                    backgroundColor: '#000', color: '#0f0', border: '2px solid #0f0' 
                  }}
                />
                <input 
                  type="text" 
                  value={newRepoUrl}
                  onChange={(e) => setNewRepoUrl(e.target.value)}
                  placeholder="Repo URL (e.g., https://github.com/...)" 
                  style={{ 
                    flex: 2, padding: '1rem', fontSize: '1.2rem', outline: 'none', 
                    backgroundColor: '#000', color: '#0f0', border: '2px solid #0f0' 
                  }}
                />
                <button 
                  onClick={handleTrackTarget}
                  className="speed-streak-hover" 
                  style={{ 
                    backgroundColor: '#000', color: '#0f0', border: '2px solid #0f0', 
                    padding: '1rem 2rem', fontWeight: '900', textTransform: 'uppercase', cursor: 'pointer'
                  }}>
                  Encrypt & Add
                </button>
              </div>

              {/* Active Private Bounties List */}
              {bounties.length > 0 && (
                <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {bounties.map((bounty) => (
                    <button
                      key={bounty.id}
                      onClick={() => setSelectedBounty(bounty)}
                      style={{
                        padding: '0.5rem 1rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        backgroundColor: selectedBounty?.id === bounty.id ? '#0f0' : '#000',
                        color: selectedBounty?.id === bounty.id ? '#000' : '#0f0',
                        border: '2px solid #0f0'
                      }}
                    >
                      {bounty.repo_name}
                    </button>
                  ))}
                </div>
              )}

              {/* AI GENERATION SECTION FOR SAFEHOUSE */}
              <div style={{ borderTop: '2px solid #0f0', paddingTop: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                  <label style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Select Objective:</label>
                  <select 
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    style={{ 
                      padding: '0.5rem 1rem', fontSize: '1.1rem', outline: 'none', cursor: 'pointer',
                      backgroundColor: '#000', color: '#0f0', border: '2px solid #0f0'
                    }}
                  >
                    <option value="First Good Issue">First Good Issue</option>
                    <option value="Architecture Setup">Architecture Setup</option>
                    <option value="Bug Hunting">Bug Hunting</option>
                  </select>
                </div>

                <button 
                  onClick={async () => {
                    if (!selectedBounty) return;
                    setIsGenerating(true);
                    setRoadmapData("");
                    try {
                      const result = await generateRoadmap(selectedBounty.repo_name, selectedBounty.repo_url, goal);
                      setRoadmapData(result);
                    } catch (err) {
                      setRoadmapData("Error decrypting target. Ensure your VITE_GEMINI_API_KEY is valid in .env.local.");
                    } finally {
                      setIsGenerating(false);
                    }
                  }}
                  disabled={isGenerating || !selectedBounty}
                  className="speed-streak-hover"
                  style={{ 
                    backgroundColor: isGenerating || !selectedBounty ? '#333' : '#0f0', 
                    color: '#000', 
                    padding: '1rem 2rem', 
                    fontSize: '1.2rem', 
                    fontWeight: '900',
                    cursor: isGenerating || !selectedBounty ? 'not-allowed' : 'pointer',
                    width: '100%',
                    border: '2px solid',
                    borderColor: isGenerating || !selectedBounty ? '#555' : '#0f0'
                  }}>
                  {isGenerating ? 'DECRYPTING TARGET...' : '[ GENERATE AI ROADMAP ]'}
                </button>

                {roadmapData && (
                  <div style={{ marginTop: '1.5rem', backgroundColor: '#000', color: '#0f0', padding: '1.5rem', whiteSpace: 'pre-wrap', border: '2px dashed #0f0' }}>
                    <h4 style={{ margin: '0 0 1rem 0', textTransform: 'uppercase', color: '#0f0' }}>Classified Briefing</h4>
                    <p style={{ margin: 0, fontFamily: 'monospace', lineHeight: '1.5' }}>{roadmapData}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
