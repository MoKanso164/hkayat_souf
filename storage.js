/**
 * Storage Module
 * Handles file uploads, previews, and validation
 */

import { getSupabase } from './config.js';

/**
 * Upload image to Supabase Storage
 * @param {File} file - image file
 * @param {string|null} productId - optional product ID for naming
 * @returns {Promise<{data: {url: string, path: string} | null, error: any}>}
 */
export async function uploadImage(file, productId = null) {
  const supabase = getSupabase();

  if (!file) return { data: null, error: new Error('No file provided') };

  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = productId
    ? `${productId}-${Date.now()}.${fileExt}`
    : `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

  const filePath = `products/${fileName}`;

  // Upload file
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, { cacheControl: '3600', upsert: false });

  if (uploadError) return { data: null, error: uploadError };

  // Get public URL
  const { data: publicData, error: urlError } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath);

  if (urlError) return { data: null, error: urlError };

  return { data: { url: publicData.publicUrl, path: filePath }, error: null };
}

/**
 * Create image preview from file
 * @param {File} file 
 * @returns {string} - object URL
 */
export function createImagePreview(file) {
  return URL.createObjectURL(file);
}

/**
 * Revoke image preview URL to free memory
 * @param {string} url 
 */
export function revokeImagePreview(url) {
  if (url && url.startsWith('blob:')) URL.revokeObjectURL(url);
}

/**
 * Validate image file
 * @param {File} file 
 * @returns {{valid: boolean, error?: string}}
 */
export function validateImageFile(file) {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (!file) return { valid: false, error: 'No file selected' };
  if (!allowedTypes.includes(file.type)) return { valid: false, error: 'Invalid file type. Only JPEG, PNG, WebP allowed.' };
  if (file.size > maxSize) return { valid: false, error: 'File too large. Max 5MB.' };

  return { valid: true };
}
