import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWardrobe } from '../context/WardrobeContext';
import { fetchWardrobeItems, deleteClothingItem } from '../api/wardrobeApi';
import ClothingItem from '../components/ClothingItem';
import styles from '../styles/index';
import { COLORS, CATEGORY_LABELS, CATEGORY_ORDER, FILTER_OPTIONS } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_GAP = 8;
const H_PAD = 16;
const ITEM_SIZE = Math.floor((SCREEN_WIDTH - H_PAD * 2 - ITEM_GAP * 2) / 3);

export default function WardrobeScreen() {
  const { items, addItem, removeItem, setLoading, loading, loadSavedOutfits } = useWardrobe();
  const [activeFilter, setActiveFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      const fetched = await fetchWardrobeItems();
      fetched.forEach((item) => addItem(item));
    } catch (e) {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    // Load both wardrobe items and saved outfits on startup
    loadItems();
    loadSavedOutfits();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadItems();
    await loadSavedOutfits();
    setRefreshing(false);
  };

  const handleDelete = async (id) => {
    removeItem(id);
    try { await deleteClothingItem(id); } catch (_) {}
  };

  const filteredItems =
    activeFilter === 'all' ? items : items.filter((i) => i.type === activeFilter);

  const grouped = CATEGORY_ORDER.reduce((acc, type) => {
    const cat = items.filter((i) => i.type === type);
    if (cat.length > 0) acc[type] = cat;
    return acc;
  }, {});

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>My wardrobe</Text>
        <Text style={styles.screenSubtitle}>
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.wardrobeFilterRow}
        style={styles.wardrobeFilterScroll}
      >
        {FILTER_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.chip, activeFilter === opt.value && styles.chipActive]}
            onPress={() => setActiveFilter(opt.value)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, activeFilter === opt.value && styles.chipTextActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading && !refreshing ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={COLORS.purple600} />
      ) : (
        <ScrollView
          style={styles.wardrobeScroll}
          contentContainerStyle={styles.wardrobeScrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
        >
          {activeFilter === 'all' ? (
            Object.keys(grouped).length === 0 ? (
              <EmptyState />
            ) : (
              Object.entries(grouped).map(([type, catItems]) => (
                <View key={type} style={styles.wardrobeSection}>
                  <Text style={styles.wardrobeSectionLabel}>{CATEGORY_LABELS[type]}</Text>
                  <View style={styles.wardrobeGrid}>
                    {catItems.map((item) => (
                      <ClothingItem
                        key={item._id}
                        item={item}
                        onDelete={handleDelete}
                        size={ITEM_SIZE}
                      />
                    ))}
                  </View>
                </View>
              ))
            )
          ) : filteredItems.length === 0 ? (
            <EmptyState filter={activeFilter} />
          ) : (
            <View style={styles.wardrobeGrid}>
              {filteredItems.map((item) => (
                <ClothingItem
                  key={item._id}
                  item={item}
                  onDelete={handleDelete}
                  size={ITEM_SIZE}
                />
              ))}
            </View>
          )}
          <View style={{ height: 16 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function EmptyState({ filter }) {
  return (
    <View style={styles.emptyState}>
      <Text style={{ fontSize: 40 }}>👕</Text>
      <Text style={styles.emptyStateTitle}>No items yet</Text>
      <Text style={styles.emptyStateText}>
        {filter
          ? `No ${CATEGORY_LABELS[filter]?.toLowerCase()} in your wardrobe.`
          : 'Tap the + button to scan your first clothing item.'}
      </Text>
    </View>
  );
}