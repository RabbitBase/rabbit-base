import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

export default function FeaturedRepos() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRepos() {
      const { data } = await supabase
        .from('featured_repos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) {
        setRepos(data);
      }
      setLoading(false);
    }
    fetchRepos();
  }, []);

  if (loading) return <div>Loading featured repos...</div>;

  return (
    <section style={{ marginBottom: '2rem' }}>
      <h2 style={{ fontSize: '2.5rem', margin: '0 0 1.5rem 0', textTransform: 'uppercase' }}>Featured Repos</h2>
      
      {repos.length === 0 ? (
        <p>No featured repos right now. Check back later!</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {repos.map(repo => (
            <a 
              href={repo.github_link} 
              target="_blank" 
              rel="noreferrer"
              key={repo.id}
              className="brutal-box speed-streak-hover"
              style={{ 
                display: 'flex', flexDirection: 'column', gap: '1rem', 
                padding: '1.5rem', backgroundColor: '#fff', textDecoration: 'none', color: 'inherit'
              }}
            >
              <h3 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--primary-blue)', wordBreak: 'break-all' }}>
                {repo.name}
              </h3>
              
              <p style={{ margin: 0, flex: 1 }}>{repo.description}</p>
              
              {repo.tags && repo.tags.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                  {repo.tags.map((tag, i) => (
                    <span key={i} style={{ 
                      backgroundColor: 'var(--primary-orange)', color: '#fff', 
                      padding: '0.2rem 0.6rem', border: '2px solid var(--text-dark)', 
                      fontWeight: 'bold', fontSize: '0.9rem' 
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
