import React from 'react';

export default function QuestItem({ title, exp, type }) {
  return (
    <div className="brutal-box speed-streak-hover" style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '1rem',
      cursor: 'pointer',
      backgroundColor: '#fff',
      borderLeftWidth: '8px',
      borderLeftColor: type === 'Bug' ? '#ff004d' : type === 'Design' ? 'var(--primary-blue)' : 'var(--primary-orange)'
    }}>
      <div>
        <h4 style={{ margin: 0, fontSize: '1.2rem' }}>{title}</h4>
        <span style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-dark)' }}>{type} Quest</span>
      </div>
      
      <div style={{ 
        backgroundColor: 'var(--primary-orange)', 
        color: '#fff', 
        padding: '0.5rem 1rem', 
        border: '2px solid var(--text-dark)', 
        fontWeight: 'bold',
        transform: 'skewX(-10deg)'
      }}>
        +{exp} EXP
      </div>
    </div>
  );
}
