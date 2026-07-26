import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

export default function HeroEvents() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvent() {
      const { data } = await supabase
        .from('global_events')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (data) {
        setEvent(data);
      }
      setLoading(false);
    }
    fetchEvent();
  }, []);

  if (loading) return null;
  if (!event) return null;

  const deadline = new Date(event.deadline).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <div className="brutal-box" style={{ 
      backgroundColor: 'var(--primary-blue)', 
      color: '#fff',
      padding: '3rem 2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      position: 'relative',
      overflow: 'hidden',
      marginBottom: '2rem'
    }}>
      <div style={{
        position: 'absolute', top: '-10px', right: '-10px',
        backgroundColor: 'var(--primary-orange)',
        color: 'var(--text-dark)',
        padding: '0.5rem 2rem',
        fontWeight: 'bold',
        transform: 'rotate(10deg)',
        border: '3px solid var(--text-dark)'
      }}>
        ACTIVE MISSION
      </div>

      <h1 style={{ fontSize: '4rem', margin: 0, textTransform: 'uppercase', lineHeight: '1', color: 'var(--primary-orange)', textShadow: '4px 4px 0 var(--text-dark)' }}>
        {event.title}
      </h1>
      
      <p style={{ fontSize: '1.5rem', fontWeight: 'bold', maxWidth: '600px', margin: '0 0 1rem 0' }}>
        {event.description}
      </p>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        {event.deadline && (
          <div style={{ 
            backgroundColor: '#fff', color: 'var(--text-dark)', 
            padding: '0.8rem 1.5rem', fontWeight: 'bold', fontSize: '1.2rem',
            border: 'var(--border-thick)'
          }}>
            ⏳ DEADLINE: {deadline}
          </div>
        )}

        {event.link && (
          <a href={event.link} target="_blank" rel="noreferrer" 
             className="brutal-btn speed-streak-hover"
             style={{ backgroundColor: 'var(--primary-orange)', color: 'var(--text-dark)', padding: '0.8rem 2rem', fontSize: '1.2rem' }}>
            JOIN EVENT
          </a>
        )}
      </div>
    </div>
  );
}
