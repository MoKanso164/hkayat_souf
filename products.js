/**
 * Products Module
 * Handles product CRUD operations
 */

import { getSupabase } from './config.js';

/**
 * Get all public products (for storefront)
 */
export async function getPublicProducts(filters = {}) {
  const supabase = getSupabase();
  
  let query = supabase
    .from('products')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false });

  // Filter by color if provided
  if (filters.color) {
    query = query.contains('colors', [filters.color]);
  }

  // Search by name if provided
  if (filters.search) {
    query = query.ilike('name', `%${filters.search}%`);
  }

  // Pagination
  const page = filters.page || 1;
  const pageSize = filters.pageSize || 12;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  return { data, error, count };
}

/**
 * Get all products (for admin - includes non-public)
 */
export async function getAllProducts(filters = {}) {
  const supabase = getSupabase();
  
  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  // Pagination
  const page = filters.page || 1;
  const pageSize = filters.pageSize || 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  return { data, error, count };
}

/**
 * Get single product by ID
 */
export async function getProduct(id) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  return { data, error };
}

/**
 * Create product
 */
export async function createProduct(productData) {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from('products')
    .insert([{
      ...productData,
      created_by: user?.id,
    }])
    .select()
    .single();

  return { data, error };
}

/**
 * Update product
 */
export async function updateProduct(id, productData) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('products')
    .update(productData)
    .eq('id', id)
    .select()
    .single();

  return { data, error };
}

/**
 * Delete product
 */
export async function deleteProduct(id) {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  return { error };
}


