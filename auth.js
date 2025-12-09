// auth.js
import { getSupabase } from './config.js';

export async function signIn(email, password) {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

export async function signOut() {
  const supabase = getSupabase();
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const supabase = getSupabase();
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user || null;
}

export async function isAdmin() {
  const user = await getCurrentUser();
  return user?.email === 'admin@example.com';
}

// ✅ This is the important one
export async function resetPassword(email) {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/login.html`
  });
  return { data, error };
}
