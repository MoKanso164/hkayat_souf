// auth.js
import { getSupabase } from './config.js';

/**
 * Get the current logged-in user
 */
export async function getCurrentUser() {
    const supabase = getSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user || null;
}

/**
 * Check if the current user is admin
 * Uses user metadata instead of querying the table
 */
export async function isAdmin() {
    const user = await getCurrentUser();
    if (!user) return false;

    // Check metadata
    return user.user_metadata?.is_admin === true;
}

/**
 * Sign out the current user
 */
export async function signOut() {
    const supabase = getSupabase();
    await supabase.auth.signOut();
}
