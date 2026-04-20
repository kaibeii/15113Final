import axios from 'axios';

const BASE_URL = 'http://192.168.0.6:3000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

/**
 * Upload a clothing photo.
 * @param {string} imageUri   - Local URI from camera/library
 * @param {string} type       - 'top' | 'bottom' | 'shoes' | 'hat' | 'other'
 * @param {string} description - Optional description
 * @returns {Promise<ClothingItem>}
 */
export async function uploadClothingItem(imageUri, type, description = '') {
  const form = new FormData();
  const filename = imageUri.split('/').pop();
  const ext = filename.split('.').pop().toLowerCase();
  const mime = ext === 'png' ? 'image/png' : 'image/jpeg';

  form.append('image', { uri: imageUri, name: filename, type: mime });
  form.append('type', type);
  form.append('description', description);

  const { data } = await api.post('/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.item;
}

/**
 * Fetch all saved clothing items.
 */
export async function fetchWardrobeItems() {
  const { data } = await api.get('/items');
  return data.items;
}

/**
 * Delete a clothing item.
 */
export async function deleteClothingItem(id) {
  await api.delete(`/items/${id}`);
}

/**
 * Generate a color-matched outfit.
 */
export async function generateOutfit() {
  const { data } = await api.get('/outfit');
  return data.outfit;
}

export default api;