import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../utils/supabase';

export default function HeroEvents() {
  const themeColors = [
    { bg: 'var(--primary-blue)', title: 'var(--primary-orange)' },
    { bg: '#ff0055', title: '#fff' },
    { bg: '#bbff00', title: 'var(--text-dark)' },
    { bg: 'var(--primary-orange)', title: 'var(--text-dark)' },
    { bg: '#00e5ff', title: 'var(--text-dark)' }
  ];

  const [events, setEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch all active events
  useEffect(() => {
    async function fetchEvents() {
      const { data } = await supabase
        .from('global_events')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (data && data.length > 0) {
        setEvents(data);
      }
      setLoading(false);
    }
    fetchEvents();
  }, []);

  // Auto-rotate interval
  useEffect(() => {
    if (events.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
    }, 6000); // 6 seconds

    // Clear interval on unmount or if currentIndex changes manually
    return () => clearInterval(timer);
  }, [events.length, currentIndex]);

  if (loading) return null;
  if (events.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? events.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
  };

  const currentEvent = events[currentIndex];
  const deadline = currentEvent.deadline 
    ? new Date(currentEvent.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null;

  const currentTheme = themeColors[currentIndex % themeColors.length];

  return (
    <div className="brutal-box" style={{ 
      backgroundColor: currentTheme.bg, 
      color: '#fff',
      padding: '3rem 2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      position: 'relative',
      overflow: 'hidden',
      marginBottom: '2rem',
      minHeight: '400px', // keep height stable during transitions
      transition: 'background-color 0.5s ease-in-out'
    }}>
      
      {/* Absolute Active Label */}
      <div style={{
        position: 'absolute', top: '-10px', right: '-10px',
        backgroundColor: 'var(--primary-orange)',
        color: 'var(--text-dark)',
        padding: '0.5rem 2rem',
        fontWeight: 'bold',
        transform: 'rotate(10deg)',
        border: '3px solid var(--text-dark)',
        zIndex: 10
      }}>
        ACTIVE MISSION
      </div>

      {/* Main Content Wrapper (keyed for animation) */}
      <div key={currentIndex} className="fade-slide-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '2rem' }}>
        <h1 style={{ fontSize: '4rem', margin: 0, textTransform: 'uppercase', lineHeight: '1', color: currentTheme.title, textShadow: '4px 4px 0 var(--text-dark)', wordBreak: 'break-word' }}>
          {currentEvent.title}
        </h1>
        
        <p style={{ 
          fontSize: '1.5rem', fontWeight: 'bold', maxWidth: '600px', margin: '0 0 1rem 0',
          color: currentTheme.bg === '#bbff00' || currentTheme.bg === 'var(--primary-orange)' || currentTheme.bg === '#00e5ff' ? 'var(--text-dark)' : '#fff',
          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'
        }}>
          {currentEvent.description}
        </p>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {deadline && (
            <div style={{ 
              backgroundColor: '#fff', color: 'var(--text-dark)', 
              padding: '0.8rem 1.5rem', fontWeight: 'bold', fontSize: '1.2rem',
              border: 'var(--border-thick)'
            }}>
              ⏳ DEADLINE: {deadline}
            </div>
          )}

          {currentEvent.link && (
            <a href={currentEvent.link} target="_blank" rel="noreferrer" 
               className="brutal-btn speed-streak-hover touch-target"
               style={{ backgroundColor: 'var(--primary-orange)', color: 'var(--text-dark)', padding: '0.8rem 2rem', fontSize: '1.2rem', display: 'inline-block', textDecoration: 'none' }}>
              JOIN EVENT
            </a>
          )}
        </div>
      </div>

      {/* Navigation Controls */}
      {events.length > 1 && (
        <div style={{ 
          position: 'absolute', 
          bottom: '1rem', 
          left: '2rem', 
          right: '2rem',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pointerEvents: 'none' // Let clicks pass through empty space
        }}>
          
          {/* Pagination Blocks */}
          <div style={{ display: 'flex', gap: '0.5rem', pointerEvents: 'auto' }}>
            {events.map((_, idx) => (
              <div 
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                style={{
                  width: '20px',
                  height: '20px',
                  border: '3px solid var(--text-dark)',
                  backgroundColor: currentIndex === idx ? 'var(--primary-orange)' : 'var(--bg-white)',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  boxShadow: currentIndex === idx ? '2px 2px 0 var(--text-dark)' : 'none',
                  transform: currentIndex === idx ? 'translate(-2px, -2px)' : 'none'
                }}
              />
            ))}
          </div>

          {/* Nav Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', pointerEvents: 'auto' }}>
            <button 
              onClick={handlePrev} 
              className="brutal-btn touch-target speed-streak-hover" 
              style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', color: 'var(--text-dark)' }}
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={handleNext} 
              className="brutal-btn touch-target speed-streak-hover" 
              style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', color: 'var(--text-dark)' }}
            >
              <ChevronRight size={24} />
            </button>
          </div>
          
        </div>
      )}
    </div>
  );
}
