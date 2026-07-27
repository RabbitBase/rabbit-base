import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { Globe, MapPin, EyeOff } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('LOCAL');

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

      {/* Mission Radar */}
      <div>
        <h2 style={{ fontSize: '3rem', margin: '0 0 1rem 0', textTransform: 'uppercase' }}>Mission Radar</h2>
        
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
            <Globe size={24} /> GLOBAL
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
            <MapPin size={24} /> LOCAL
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
            <EyeOff size={24} /> PRIVATE
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
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input 
                  type="text" 
                  placeholder="e.g., RabbitBase/rabbit-base" 
                  className="brutal-box" 
                  style={{ flex: 1, padding: '1rem', fontSize: '1.2rem', outline: 'none' }}
                />
                <button className="brutal-btn speed-streak-hover" style={{ backgroundColor: 'var(--primary-blue)', color: '#fff' }}>
                  Track Target
                </button>
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
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input 
                  type="text" 
                  placeholder="Enter encrypted target..." 
                  style={{ 
                    flex: 1, padding: '1rem', fontSize: '1.2rem', outline: 'none', 
                    backgroundColor: '#000', color: '#0f0', border: '2px solid #0f0' 
                  }}
                />
                <button className="speed-streak-hover" style={{ 
                  backgroundColor: '#000', color: '#0f0', border: '2px solid #0f0', 
                  padding: '1rem 2rem', fontWeight: '900', textTransform: 'uppercase', cursor: 'pointer'
                }}>
                  Encrypt & Add
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
