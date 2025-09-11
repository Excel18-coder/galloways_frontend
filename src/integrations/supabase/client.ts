// Frontend Supabase client — reads credentials from Vite env variables.
// Do NOT commit secrets to source. Use a .env (not checked into git) with the
// VITE_SUPABASE_URL and VITE_SUPABASE_KEY variables.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env || '';
const SUPABASE_PUBLISHABLE_KEY = import.meta.env. || '';

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  const errorMessage = `Supabase configuration error:
    - VITE_SUPABASE_URL: ${SUPABASE_URL ? '✅ Set' : '❌ Missing'} 
    - VITE_SUPABASE_ANON_KEY: ${SUPABASE_PUBLISHABLE_KEY ? '✅ Set' : '❌ Missing'}
    
    Please ensure these environment variables are set in your .env file`;
    
  console.error(errorMessage);
  
  // In development, show detailed error
  if (import.meta.env.DEV) {
    throw new Error('Supabase configuration missing. Check your .env file.');
  }
  
  // In production, continue but warn
  console.warn('Supabase credentials missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.');
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    persistSession: false, // Disable session persistence to avoid cookie issues
    autoRefreshToken: false, // Disable auto-refresh to avoid token issues
    detectSessionInUrl: false, // Disable URL session detection
  },
  realtime: {
    params: {
      eventsPerSecond: 2 // Reduce real-time event frequency
    },
    timeout: 20000 // Increase timeout for WebSocket connections
  },
  global: {
    headers: {
      'x-client-info': 'galloways-frontend@1.0.0'
    }
  }
});