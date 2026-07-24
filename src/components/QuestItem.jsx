import React from 'react';

export default function QuestItem({ quest, onClaim }) {
  const isClaimable = quest.status === 'open' || quest.status === 'active';
  const isInProgress = quest.status === 'in_progress';
  
  const type = 'Quest'; // Default type label

  return (
    <div className="brutal-box speed-streak-hover" style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '1rem',
      backgroundColor: '#fff',
      borderLeftWidth: '8px',
      borderLeftColor: 'var(--primary-orange)',
      flexWrap: 'wrap',
      gap: '1rem'
    }}>
      <div style={{ flex: 1, minWidth: '200px' }}>
        <h4 style={{ margin: 0, fontSize: '1.2rem' }}>{quest.title}</h4>
        <span style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-dark)' }}>{type}</span>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {isClaimable && (
          <button 
            onClick={() => onClaim(quest.id)}
            className="brutal-btn speed-streak-hover" 
            style={{ backgroundColor: 'var(--primary-blue)', color: '#fff', padding: '0.5rem 1rem' }}
          >
            Start Digging
          </button>
        )}
        
        {isInProgress && (
          <div style={{ 
            backgroundColor: '#ccc', 
            padding: '0.3rem 0.8rem', 
            border: 'var(--border-thick)', 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            In progress by {quest.assignee?.username || 'a burrower'}
          </div>
        )}

        <div style={{ 
          backgroundColor: 'var(--primary-orange)', 
          color: '#fff', 
          padding: '0.5rem 1rem', 
          border: '2px solid var(--text-dark)', 
          fontWeight: 'bold',
          transform: 'skewX(-10deg)'
        }}>
          +{quest.exp_reward} EXP
        </div>
      </div>
    </div>
  );
}
