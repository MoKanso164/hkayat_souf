/**
 * Storage Module
 * Handles file uploads and image previews
 */

import { getSupabase } from './config.js';

/**
 * Upload image to Supabase Storage
 * @param {File} file - The image file to upload
 * @param {string|null} productId - Optional product ID to include in filename
 * @returns {Promise<{data: {url: string, path: string}, error: any}>}
 */
export async function uploadImage(file, productId = null) {
  const supabase = getSupabase();

  // Safe filename: remove spaces & illegal characters
  const fileExt = file.name.split('.').pop();
  const safeName = file.name
    .replace(/\s+/g, '-')                   // replace spaces with -
    .replace(/[^a-zA-Z0-9\-_\.]/g, '');    // remove special chars

  const fileName = productId
    ? `${productId}-${Date.now()}.${fileExt}`
    : `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExt}`;

  const filePath = `products/${fileName}`;

  // Upload file with upsert: true to avoid conflicts
  const { data, error } = await supabase.storage
    .from('products')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type
    });

  if (error) {
    return { data: null, error };
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('products')
    .getPublicUrl(filePath);

  return { data: { url: publicUrl, path: filePath }, error: null };
}

/**
 * Create image preview from file
 * @param {File} file - The image file
 * @returns {string} - Blob URL for preview
 */
export function createImagePreview(file) {
  return URL.createObjectURL(file);
}

/**
 * Revoke image preview URL to free memory
 * @param {string} url - Blob URL
 */
export function revokeImagePreview(url) {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

/**
 * Validate image file
 * @param {File} file - The image file
 * @returns {{valid: boolean, error?: string}}
 */
export function validateImageFile(file) {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Please upload a JPEG, PNG, or WebP image.' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'File size too large. Maximum size is 5MB.' };
  }

  return { valid: true };
}

