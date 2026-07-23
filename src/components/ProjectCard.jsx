import React from 'react';

export default function ProjectCard({ title, icon, desc }) {
  return (
    <div className="brutal-box" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      textAlign: 'center', 
      gap: '1rem',
      borderTopLeftRadius: '50% 20%',
      borderTopRightRadius: '50% 20%',
      borderBottomWidth: '8px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: '-20px', left: '-20px',
        width: '60px', height: '60px',
        background: 'var(--primary-blue)',
        transform: 'rotate(45deg)',
        zIndex: 0
      }}></div>
      
      <div style={{ zIndex: 1, padding: '1rem', backgroundColor: '#fff', borderRadius: '50%', border: 'var(--border-thick)' }}>
        {icon}
      </div>
      
      <div style={{ zIndex: 1 }}>
        <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: 'var(--primary-blue)' }}>{title}</h3>
        <p style={{ fontSize: '1rem', fontWeight: 'bold' }}>{desc}</p>
      </div>
      
      <button className="brutal-btn speed-streak-hover" style={{ width: '100%', marginTop: 'auto', zIndex: 1 }}>
        Enter Burrow
      </button>
    </div>
  );
}
