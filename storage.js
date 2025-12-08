/**
 * Storage Module
 * Handles file uploads and image previews
 */

import { getSupabase } from './config.js';

/**
 * Upload image to Supabase Storage
 */
export async function uploadImage(file, productId = null) {
  const supabase = getSupabase();
  
  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = productId 
    ? `${productId}-${Date.now()}.${fileExt}`
    : `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `products/${fileName}`;

  // Upload file
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    return { data: null, error };
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath);

  return { data: { url: publicUrl, path: filePath }, error: null };
}

/**
 * Create image preview from file
 */
export function createImagePreview(file) {
  return URL.createObjectURL(file);
}

/**
 * Revoke image preview URL to free memory
 */
export function revokeImagePreview(url) {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

/**
 * Validate image file
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

