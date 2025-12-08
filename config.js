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

// Validate credentials are non-empty strings (warn only, will throw in initSupabase if needed)
if (!SUPABASE_URL || typeof SUPABASE_URL !== 'string' || SUPABASE_URL.trim() === '') {
  console.error('Invalid or missing SUPABASE_URL');
}

if (!SUPABASE_ANON_KEY || typeof SUPABASE_ANON_KEY !== 'string' || SUPABASE_ANON_KEY.trim() === '') {
  console.error('Invalid or missing SUPABASE_ANON_KEY');
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

  // Double-check credentials are valid
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || 
      typeof SUPABASE_URL !== 'string' || typeof SUPABASE_ANON_KEY !== 'string' ||
      SUPABASE_URL.trim() === '' || SUPABASE_ANON_KEY.trim() === '') {
    throw new Error('Supabase URL and Anon Key must be valid non-empty strings.');
  }

  try {
    // Import Supabase from CDN - try multiple methods for compatibility
    let createClient;
    
    // Method 1: Try jsDelivr with specific stable version
    try {
      const module1 = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.0/+esm');
      createClient = module1.createClient;
      if (typeof createClient === 'function') {
        console.log('Loaded Supabase from jsDelivr (v2.39.0)');
      }
    } catch (e1) {
      console.warn('jsDelivr v2.39.0 failed, trying latest...', e1.message);
      // Fallback to latest
      try {
        const module1b = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
        createClient = module1b.createClient;
        if (typeof createClient === 'function') {
          console.log('Loaded Supabase from jsDelivr (latest)');
        }
      } catch (e1c) {
        console.warn('jsDelivr latest also failed');
      }
    }
    
    // Method 2: Try unpkg if first method failed
    if (!createClient || typeof createClient !== 'function') {
      try {
        const module2 = await import('https://unpkg.com/@supabase/supabase-js@2/dist/esm/index.js');
        createClient = module2.createClient || module2.default?.createClient;
        if (typeof createClient === 'function') {
          console.log('Loaded Supabase from unpkg');
        }
      } catch (e2) {
        console.warn('unpkg import failed:', e2);
      }
    }
    
    // Method 3: Try jsDelivr direct path
    if (!createClient || typeof createClient !== 'function') {
      try {
        const module3 = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/esm/index.js');
        createClient = module3.createClient || module3.default?.createClient;
        if (typeof createClient === 'function') {
          console.log('Loaded Supabase from jsDelivr (direct path)');
        }
      } catch (e3) {
        console.warn('jsDelivr direct path failed:', e3);
      }
    }
    
    if (!createClient || typeof createClient !== 'function') {
      throw new Error('Could not load Supabase createClient from any CDN source. Please check your internet connection.');
    }
    
    // Create the Supabase client with minimal options to avoid issues
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    if (!supabaseClient) {
      throw new Error('createClient returned null or undefined');
    }
    
    return supabaseClient;
  } catch (error) {
    console.error('Failed to initialize Supabase:', error);
    console.error('Supabase URL provided:', !!SUPABASE_URL);
    console.error('Supabase Key provided:', !!SUPABASE_ANON_KEY);
    throw new Error(`Supabase initialization failed: ${error.message}`);
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



