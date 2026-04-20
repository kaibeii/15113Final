import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWardrobe } from '../context/WardrobeContext';
import { fetchWardrobeItems, deleteClothingItem } from '../api/wardrobeApi';
import ClothingItem from '../components/ClothingItem';
import {
  COLORS,
  RADIUS,
  SPACING,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  FILTER_OPTIONS,
} from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_GAP = 8;
const H_PAD = SPACING.lg;
const ITEM_SIZE = Math.floor((SCREEN_WIDTH - H_PAD * 2 - ITEM_GAP * 2) / 3);

export default function WardrobeScreen() {
  const { items, addItem, removeItem, setLoading, loading } = useWardrobe();
  const [activeFilter, setActiveFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      const fetched = await fetchWardrobeItems();
      fetched.forEach((item) => addItem(item));
    } catch (e) {
      // Backend not running yet — silently ignore in dev
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadItems();
    setRefreshing(false);
  };

  const handleDelete = async (id) => {
    removeItem(id);
    try {
      await deleteClothingItem(id);
    } catch (_) {}
  };

  const filteredItems =
    activeFilter === 'all' ? items : items.filter((i) => i.type === activeFilter);

  // Group items by category for the "All" view
  const grouped = CATEGORY_ORDER.reduce((acc, type) => {
    const cat = items.filter((i) => i.type === type);
    if (cat.length > 0) acc[type] = cat;
    return acc;
  }, {});

  const totalCount = items.length;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My wardrobe</Text>
          <Text style={styles.subtitle}>
            {totalCount} {totalCount === 1 ? 'item' : 'items'}
          </Text>
        </View>
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        style={styles.filterScroll}
      >
        {FILTER_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.chip, activeFilter === opt.value && styles.chipActive]}
            onPress={() => setActiveFilter(opt.value)}
            activeOpacity={0.7}
          >
            <Text
              style={[styles.chipText, activeFilter === opt.value && styles.chipTextActive]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading && !refreshing ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={COLORS.purple600} />
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
        >
          {activeFilter === 'all' ? (
            // Grouped sections
            Object.keys(grouped).length === 0 ? (
              <EmptyState />
            ) : (
              Object.entries(grouped).map(([type, catItems]) => (
                <View key={type} style={styles.section}>
                  <Text style={styles.sectionLabel}>{CATEGORY_LABELS[type]}</Text>
                  <View style={styles.grid}>
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
            // Flat grid for filtered view
            <View style={styles.grid}>
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
    <View style={styles.empty}>
      <Text style={styles.emptyIcon}>👕</Text>
      <Text style={styles.emptyTitle}>No items yet</Text>
      <Text style={styles.emptyText}>
        {filter
          ? `No ${CATEGORY_LABELS[filter]?.toLowerCase()} in your wardrobe.`
          : 'Tap the + button to scan your first clothing item.'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: H_PAD,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
  },
  title: {
    fontSize: 22,
    fontWeight: '500',
    color: COLORS.black,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.gray400,
    marginTop: 2,
  },
  filterScroll: {
    flexGrow: 0,
  },
  filterRow: {
    paddingHorizontal: H_PAD,
    paddingBottom: SPACING.sm,
    gap: SPACING.xs,
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.gray50,
    borderWidth: 0.5,
    borderColor: COLORS.gray100,
  },
  chipActive: {
    backgroundColor: COLORS.purple50,
    borderColor: COLORS.purple200,
  },
  chipText: {
    fontSize: 13,
    color: COLORS.gray600,
    fontWeight: '400',
  },
  chipTextActive: {
    color: COLORS.purple800,
    fontWeight: '500',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: H_PAD,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.gray600,
    marginBottom: SPACING.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ITEM_GAP,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: SPACING.xl,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.black,
    marginBottom: SPACING.xs,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.gray400,
    textAlign: 'center',
    lineHeight: 22,
  },
});
