/**
 * Authentication Module
 * Handles user authentication and role checking
 */

import { getSupabase } from './config.js';

/**
 * Check if current user is authenticated
 */
export async function isAuthenticated() {
  const supabase = getSupabase();
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
}

/**
 * Check if current user is admin
 */
export async function isAdmin() {
  const supabase = getSupabase();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return false;
  }

  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', session.user.id)
    .eq('role', 'admin')
    .single();

  return !error && !!data;
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Sign in with email and password
 */
export async function signIn(email, password) {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

/**
 * Sign out
 */
export async function signOut() {
  const supabase = getSupabase();
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Reset password (forgot password)
 */
export async function resetPassword(email) {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/admin/login.html`,
  });
  return { data, error };
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback) {
  const supabase = getSupabase();
  return supabase.auth.onAuthStateChange(callback);
}


