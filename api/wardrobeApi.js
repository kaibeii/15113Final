import axios from 'axios';

// Change this to your backend URL (use your machine's LAN IP when testing on a real device)
const BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

/**
 * Upload a clothing photo.
 * @param {string} imageUri - Local URI from camera/library
 * @param {string} type     - 'top' | 'bottom' | 'shoes' | 'hat' | 'other'
 * @returns {Promise<ClothingItem>}
 */
export async function uploadClothingItem(imageUri, type) {
  const form = new FormData();
  const filename = imageUri.split('/').pop();
  const ext = filename.split('.').pop().toLowerCase();
  const mime = ext === 'png' ? 'image/png' : 'image/jpeg';

  form.append('image', { uri: imageUri, name: filename, type: mime });
  form.append('type', type);

  const { data } = await api.post('/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.item;
}

/**
 * Fetch all saved clothing items.
 * @returns {Promise<ClothingItem[]>}
 */
export async function fetchWardrobeItems() {
  const { data } = await api.get('/items');
  return data.items;
}

/**
 * Delete a clothing item.
 * @param {string} id
 */
export async function deleteClothingItem(id) {
  await api.delete(`/items/${id}`);
}

/**
 * Generate a random outfit (1 top + 1 bottom + 1 shoes).
 * @returns {Promise<{ top, bottom, shoes }>}
 */
export async function generateOutfit() {
  const { data } = await api.get('/outfit');
  return data.outfit;
}

export default api;
