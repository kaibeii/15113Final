import React, { createContext, useContext, useState, useCallback } from 'react';
import { saveSavedOutfit, fetchSavedOutfits, deleteSavedOutfitApi } from '../api/wardrobeApi';

const WardrobeContext = createContext(null);

export function WardrobeProvider({ children }) {
  const [items, setItems] = useState([]);
  const [savedOutfits, setSavedOutfits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addItem = useCallback((item) => {
    setItems((prev) => {
      const exists = prev.some((existingItem) => existingItem._id === item._id);
      if (!exists) return [item, ...prev];
      return prev.map((existingItem) => (existingItem._id === item._id ? item : existingItem));
    });
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item._id !== id));
  }, []);

  const updateItem = useCallback((updatedItem) => {
    setItems((prev) => {
      const exists = prev.some((item) => item._id === updatedItem._id);
      if (!exists) return [updatedItem, ...prev];
      return prev.map((item) => (item._id === updatedItem._id ? updatedItem : item));
    });
  }, []);

  // Load saved outfits from backend on startup
  const loadSavedOutfits = useCallback(async () => {
    try {
      const outfits = await fetchSavedOutfits();
      // Normalize _id to id for consistency with frontend
      const normalized = outfits.map((o) => ({
        ...o,
        id: o._id,
        savedAt: o.savedAt || new Date().toISOString(),
      }));
      setSavedOutfits(normalized);
    } catch (err) {
      console.log('Could not load saved outfits — backend may not be running');
    }
  }, []);

  const saveOutfit = useCallback(async (outfit) => {
    try {
      const saved = await saveSavedOutfit(outfit);
      const normalized = {
        ...saved,
        id: saved._id,
        savedAt: saved.savedAt || new Date().toISOString(),
      };
      setSavedOutfits((prev) => [normalized, ...prev]);
      return normalized;
    } catch (err) {
      // Fallback to local save if backend unreachable
      const local = {
        ...outfit,
        savedAt: new Date().toISOString(),
        id: Date.now().toString(),
      };
      setSavedOutfits((prev) => [local, ...prev]);
      return local;
    }
  }, []);

  const removeSavedOutfit = useCallback(async (id) => {
    // Remove from local state immediately
    setSavedOutfits((prev) => prev.filter((o) => o.id !== id));
    // Then delete from backend
    try {
      await deleteSavedOutfitApi(id);
    } catch (err) {
      console.log('Could not delete saved outfit from backend');
    }
  }, []);

  const getItemsByType = useCallback(
    (type) => {
      if (type === 'all') return items;
      return items.filter((item) => item.type === type);
    },
    [items]
  );

  return (
    <WardrobeContext.Provider
      value={{
        items,
        savedOutfits,
        loading,
        error,
        setLoading,
        setError,
        addItem,
        removeItem,
        updateItem,
        saveOutfit,
        removeSavedOutfit,
        loadSavedOutfits,
        getItemsByType,
      }}
    >
      {children}
    </WardrobeContext.Provider>
  );
}

export function useWardrobe() {
  const ctx = useContext(WardrobeContext);
  if (!ctx) throw new Error('useWardrobe must be used inside WardrobeProvider');
  return ctx;
}