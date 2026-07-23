import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Edge Function to handle GitHub webhooks
serve(async (req) => {
  // Check if it's a valid POST request
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  try {
    const payload = await req.json()

    // We only care about PRs that are closed and merged
    if (payload.action === 'closed' && payload.pull_request?.merged) {
      const githubUsername = payload.pull_request.user.login
      console.log(`PR merged by ${githubUsername}. Granting EXP...`)

      // Initialize Supabase Client
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      
      const supabase = createClient(supabaseUrl, supabaseServiceKey)

      // Assuming we have a 'users' table with 'github_username' and 'exp'
      // 1. Fetch user by github username
      const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('id, exp')
        .eq('github_username', githubUsername)
        .single()

      if (fetchError) {
        console.error('Error fetching user:', fetchError)
        return new Response('User not found or error', { status: 400 })
      }

      // 2. Increment EXP (e.g., +100 EXP for a merged PR)
      const newExp = (user.exp || 0) + 100

      // 3. Update user
      const { error: updateError } = await supabase
        .from('users')
        .update({ exp: newExp })
        .eq('id', user.id)

      if (updateError) {
        console.error('Error updating user EXP:', updateError)
        return new Response('Error updating EXP', { status: 500 })
      }

      console.log(`Successfully granted 100 EXP to ${githubUsername}. New EXP: ${newExp}`)
      return new Response(JSON.stringify({ success: true, newExp }), { 
        headers: { "Content-Type": "application/json" }
      })
    }

    return new Response(JSON.stringify({ success: true, message: 'Event ignored' }), { 
      headers: { "Content-Type": "application/json" }
    })
  } catch (error) {
    console.error('Error parsing webhook payload:', error.message)
    return new Response('Bad Request', { status: 400 })
  }
})
