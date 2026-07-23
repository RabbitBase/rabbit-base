import React, { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard';
import { Zap, Shield, Rocket, HelpCircle } from 'lucide-react';
import { supabase } from '../utils/supabase';

// Helper to map string identifiers to Lucide icons
const getIcon = (iconName) => {
  const props = { size: 50, color: "var(--primary-orange)" };
  switch (iconName?.toLowerCase()) {
    case 'zap': return <Zap {...props} />;
    case 'shield': return <Shield {...props} color="var(--primary-blue)" />;
    case 'rocket': return <Rocket {...props} />;
    default: return <HelpCircle {...props} />;
  }
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      const { data } = await supabase.from('projects').select('*');
      if (data) {
        setProjects(data);
      }
      setLoading(false);
    }
    fetchProjects();
  }, []);

  if (loading) return <div>Loading Burrows...</div>;

  return (
    <section>
      <h2>Daily Tool Burrows</h2>
      {projects.length === 0 ? (
        <p>No projects available yet. The burrow is empty!</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {projects.map((project) => (
            <ProjectCard 
              key={project.id} 
              title={project.title} 
              icon={getIcon(project.icon_url)} 
              desc={project.description} 
              link={project.link}
            />
          ))}
        </div>
      )}
    </section>
  );
}
