import React, { createContext, useContext, useState, useCallback } from 'react';

const WardrobeContext = createContext(null);

export function WardrobeProvider({ children }) {
  const [items, setItems] = useState([]);
  const [savedOutfits, setSavedOutfits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addItem = useCallback((item) => {
    setItems((prev) => [item, ...prev]);
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item._id !== id));
  }, []);

  const updateItem = useCallback((updatedItem) => {
    setItems((prev) =>
      prev.map((item) => (item._id === updatedItem._id ? updatedItem : item))
    );
  }, []);

  const saveOutfit = useCallback((outfit) => {
    const saved = {
      ...outfit,
      savedAt: new Date().toISOString(),
      id: Date.now().toString(),
    };
    setSavedOutfits((prev) => [saved, ...prev]);
    return saved;
  }, []);

  const removeSavedOutfit = useCallback((id) => {
    setSavedOutfits((prev) => prev.filter((o) => o.id !== id));
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