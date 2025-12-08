/**
 * Configuration Module
 * Loads environment variables and initializes Supabase client
 */

// Get Supabase credentials from window object
// These should be set by config.js files in admin/ or store/ directories
// Or set directly in HTML: <script>window.SUPABASE_URL = '...'; window.SUPABASE_ANON_KEY = '...';</script>
window.SUPABASE_URL = window.SUPABASE_URL || 'https://hoglbbznztqyfcrnojze.supabase.co';
window.SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvZ2xiYnpuenRxeWZjcm5vanplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMTI5OTYsImV4cCI6MjA4MDc4ODk5Nn0.3wiZ3IRG2XZACNEseTGw-j5I61R_bXQ9gMX-HM9T0m4';

const SUPABASE_URL = window.SUPABASE_URL;
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase configuration. Please set SUPABASE_URL and SUPABASE_ANON_KEY in window object or config.js');
}

// Initialize Supabase client
let supabaseClient = null;

/**
 * Initialize Supabase client
 */
async function initSupabase() {
  if (supabaseClient) {
    return supabaseClient;
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase URL and Anon Key must be set. See README for setup instructions.');
  }

  try {
    // Use CDN import for Supabase
    const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return supabaseClient;
  } catch (error) {
    console.error('Failed to initialize Supabase:', error);
    throw error;
  }
}

/**
 * Get Supabase client instance
 */
function getSupabase() {
  if (!supabaseClient) {
    throw new Error('Supabase not initialized. Call initSupabase() first.');
  }
  return supabaseClient;
}

// Export functions
export { initSupabase, getSupabase };



