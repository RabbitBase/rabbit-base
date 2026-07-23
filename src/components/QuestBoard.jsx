import React from 'react';
import QuestItem from './QuestItem';

export default function QuestBoard() {
  return (
    <section>
      <h2>Colony Noticeboard</h2>
      <div className="brutal-box" style={{ backgroundColor: '#fff8eb', padding: '1.5rem' }}>
        <h3 style={{ borderBottom: 'var(--border-thick)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Colony Quests</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <QuestItem title="Fix navigation bug" exp={50} type="Bug" />
          <QuestItem title="Design new carrot icon" exp={120} type="Design" />
          <QuestItem title="Write docs for Shield" exp={80} type="Docs" />
          <button className="brutal-btn blue speed-streak-hover" style={{ marginTop: '1rem' }}>View All Quests</button>
        </div>
      </div>
    </section>
  );
}
