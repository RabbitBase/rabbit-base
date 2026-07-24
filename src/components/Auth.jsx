import React from 'react';
import { supabase } from '../utils/supabase';

export default function Auth() {
  const handleGitHubLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/` }
    });
  };

  return (
    <div className="brutal-box" style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
      <h3 style={{ marginBottom: '1.5rem' }}>Login to Base HQ</h3>
      <button onClick={handleGitHubLogin} className="brutal-btn blue speed-streak-hover" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
        Sign in with GitHub
      </button>
    </div>
  );
}
