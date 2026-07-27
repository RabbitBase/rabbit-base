import React from 'react';
import HeroEvents from '../components/HeroEvents';
import FeaturedRepos from '../components/FeaturedRepos';
import QuestBoard from '../components/QuestBoard';

export default function Explore() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))', gap: '2rem' }}>
        
        {/* Left Column: Events & Repos */}
        <div style={{ gridColumn: 'span 2' }}>
          <HeroEvents />
          <FeaturedRepos />
        </div>
        
        {/* Right Column (or below on mobile): QuestBoard */}
        <QuestBoard />
        
      </div>
    </div>
  );
}
