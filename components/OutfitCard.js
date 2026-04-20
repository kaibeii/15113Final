import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

function SlotPreview({ item }) {
  if (!item) {
    return (
      <View style={styles.slot}>
        <Ionicons name="shirt-outline" size={18} color={COLORS.gray200} />
      </View>
    );
  }
  return (
    <View style={styles.slot}>
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.slotImage} resizeMode="contain" />
      ) : (
        <Ionicons name="shirt-outline" size={18} color={COLORS.gray200} />
      )}
    </View>
  );
}

export default function OutfitCard({ outfit, onDelete, showDate = true }) {
  const handleDelete = () => {
    Alert.alert('Remove outfit', 'Delete this saved outfit?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(outfit.id) },
    ]);
  };

  const dateLabel = outfit.savedAt
    ? new Date(outfit.savedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null;

  return (
    <View style={styles.card}>
      <View style={styles.slots}>
        <SlotPreview item={outfit.top} />
        <SlotPreview item={outfit.bottom} />
        <SlotPreview item={outfit.shoes} />
      </View>
      <View style={styles.meta}>
        <Text style={styles.title} numberOfLines={1}>
          {outfit.name || 'Saved outfit'}
        </Text>
        {showDate && dateLabel && (
          <Text style={styles.date}>Saved {dateLabel}</Text>
        )}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Saved</Text>
        </View>
      </View>
      {onDelete && (
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete} hitSlop={8}>
          <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.gray50,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
    borderWidth: 0.5,
    borderColor: COLORS.gray100,
  },
  slots: {
    flexDirection: 'row',
    gap: 4,
  },
  slot: {
    width: 44,
    height: 52,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: COLORS.gray100,
  },
  slotImage: {
    width: '100%',
    height: '100%',
  },
  meta: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.black,
  },
  date: {
    fontSize: 10,
    color: COLORS.gray400,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.teal50,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    marginTop: 2,
  },
  badgeText: {
    fontSize: 9,
    color: COLORS.teal600,
    fontWeight: '500',
  },
  deleteBtn: {
    padding: SPACING.xs,
  },
});
