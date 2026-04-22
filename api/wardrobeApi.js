import axios from 'axios';

const BASE_URL = 'http://192.168.0.6:3000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

export async function uploadClothingItem(imageUri, type, color, description = '') {
  const form = new FormData();
  const filename = imageUri.split('/').pop();
  const ext = filename.split('.').pop().toLowerCase();
  const mime = ext === 'png' ? 'image/png' : 'image/jpeg';

  form.append('image', { uri: imageUri, name: filename, type: mime });
  form.append('type', type);
  form.append('color', color);
  form.append('description', description);

  const { data } = await api.post('/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function fetchWardrobeItems() {
  const { data } = await api.get('/items');
  return data.items;
}

export async function deleteClothingItem(id) {
  await api.delete(`/items/${id}`);
}

export async function updateClothingItem(id, { type, color, description }) {
  const { data } = await api.patch(`/items/${id}`, { type, color, description });
  return data.item;
}

export async function generateOutfit() {
  const { data } = await api.get('/outfit');
  return data.outfit;
}

export async function saveSavedOutfit(outfit) {
  const { data } = await api.post('/outfits', {
    top:    outfit.top,
    bottom: outfit.bottom,
    shoes:  outfit.shoes,
    name:   outfit.name || 'Saved outfit',
  });
  return data.outfit;
}

export async function fetchSavedOutfits() {
  const { data } = await api.get('/outfits');
  return data.outfits;
}

export async function deleteSavedOutfitApi(id) {
  await api.delete(`/outfits/${id}`);
}

export default api;