// auth.js
import { getSupabase } from './config.js';

/**
 * Sign in a user with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{data: any, error: any}>}
 */
export async function signIn(email, password) {
    const supabase = getSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
}

/**
 * Sign out the current user
 * @returns {Promise<{error: any}>}
 */
export async function signOut() {
    const supabase = getSupabase();
    const { error } = await supabase.auth.signOut();
    return { error };
}

/**
 * Get the currently logged-in user
 * @returns {Promise<User|null>}
 */
export async function getCurrentUser() {
    const supabase = getSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user || null;
}

/**
 * Check if the current user is admin
 * @returns {Promise<boolean>}
 */
export async function isAdmin() {
    const user = await getCurrentUser();
    // Adjust this to your logic: example by email
    return user?.email === 'admin@example.com';
}

/**
 * Send a password reset email
 * @param {string} email
 * @returns {Promise<{data: any, error: any}>}
 */
export async function resetPassword(email) {
    const supabase = getSupabase();
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login.html`
    });
    return { data, error };
}
