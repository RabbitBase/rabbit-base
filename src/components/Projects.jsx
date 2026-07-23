import React from 'react';
import ProjectCard from './ProjectCard';
import { Zap, Shield, Rocket } from 'lucide-react';

export default function Projects() {
  return (
    <section>
      <h2>Daily Tool Burrows</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <ProjectCard title="Auto-Watering Can" icon={<Zap size={50} color="var(--primary-orange)" />} desc="High-tech automation utility for daily tasks." />
        <ProjectCard title="Burrow Shield" icon={<Shield size={50} color="var(--primary-blue)" />} desc="Security and privacy enhancer." />
        <ProjectCard title="Carrot Rocket" icon={<Rocket size={50} color="var(--primary-orange)" />} desc="Performance boosting scripts." />
      </div>
    </section>
  );
}
