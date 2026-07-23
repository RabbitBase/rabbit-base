import React from 'react';
import Projects from '../components/Projects';
import QuestBoard from '../components/QuestBoard';

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div style={{ gridColumn: 'span 2' }}>
           <Projects />
        </div>
        <QuestBoard />
      </div>
    </div>
  );
}
