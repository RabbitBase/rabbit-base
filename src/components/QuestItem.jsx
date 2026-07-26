import React from 'react';

export default function QuestItem({ quest, onClick }) {
  const isInProgress = quest.status === 'in_progress';
  
  return (
    <div 
      className="brutal-box speed-streak-hover" 
      onClick={onClick}
      style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        backgroundColor: '#fff',
        borderLeftWidth: '8px',
        borderLeftColor: isInProgress ? '#ccc' : 'var(--primary-orange)',
        cursor: 'pointer',
        userSelect: 'none'
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--primary-blue)' }}>
          {quest.title}
        </h4>
        {isInProgress && (
          <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-dark)' }}>
            🚧 IN PROGRESS
          </span>
        )}
      </div>
      
      <div style={{ 
        backgroundColor: 'var(--primary-orange)', 
        color: '#fff', 
        padding: '0.4rem 1rem', 
        border: '2px solid var(--text-dark)', 
        fontWeight: 'bold',
        transform: 'skewX(-10deg)',
        marginLeft: '1rem',
        flexShrink: 0
      }}>
        +{quest.exp_reward} EXP
      </div>
    </div>
  );
}
