// auth.js
import { getSupabase } from './config.js';

/**
 * Sign in user with email and password
 * Returns { data, error }
 */
export async function signIn(email, password) {
    const supabase = getSupabase();
    return await supabase.auth.signInWithPassword({ email, password });
}

/**
 * Reset password for email
 */
export async function resetPassword(email) {
    const supabase = getSupabase();
    return await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/login.html'
    });
}

/**
 * Sign out current user
 */
export async function signOut() {
    const supabase = getSupabase();
    await supabase.auth.signOut();
}

/**
 * Get current user session and data
 */
export async function getCurrentUser() {
    const supabase = getSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    const user = session.user;
    return user;
}

/**
 * Check if current user is admin
 */
export async function isAdmin() {
    const user = await getCurrentUser();
    if (!user) return false;
    return !!user.raw_user_meta_data?.is_admin;
}
