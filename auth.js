// auth.js
import { getSupabase } from './config.js';

// Sign in with email & password
export async function signIn(email, password) {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

// Sign out
export async function signOut() {
  const supabase = getSupabase();
  const { error } = await supabase.auth.signOut();
  return { error };
}

// Get current user reliably
export async function getCurrentUser() {
  const supabase = getSupabase();

  // Listen to auth changes (session persisted)
  supabase.auth.onAuthStateChange((_event, session) => {
    // session changed; can handle auto logout if needed
  });

  // Get current session
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user || null;
}

// Check if user is admin
export async function isAdmin() {
  const user = await getCurrentUser();
  // Replace with your real admin email or a role check in Supabase
  return user?.email === 'admin@example.com';
}

// Reset password
export async function resetPassword(email) {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/login.html`
  });
  return { data, error };
}
