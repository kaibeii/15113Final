import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/index';
import { COLORS } from '../constants/theme';

function SlotPreview({ item }) {
  if (!item) {
    return (
      <View style={styles.outfitCardSlot}>
        <Ionicons name="shirt-outline" size={18} color={COLORS.gray200} />
      </View>
    );
  }
  return (
    <View style={styles.outfitCardSlot}>
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.outfitCardSlotImage} resizeMode="contain" />
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
    <View style={styles.outfitCard}>
      <View style={styles.outfitCardSlots}>
        <SlotPreview item={outfit.top} />
        <SlotPreview item={outfit.bottom} />
        <SlotPreview item={outfit.shoes} />
      </View>
      <View style={styles.outfitCardMeta}>
        <Text style={styles.outfitCardTitle} numberOfLines={1}>
          {outfit.name || 'Saved outfit'}
        </Text>
        {showDate && dateLabel && (
          <Text style={styles.outfitCardDate}>Saved {dateLabel}</Text>
        )}
        <View style={styles.outfitCardBadge}>
          <Text style={styles.outfitCardBadgeText}>Saved</Text>
        </View>
      </View>
      {onDelete && (
        <TouchableOpacity style={styles.outfitCardDeleteBtn} onPress={handleDelete} hitSlop={8}>
          <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
        </TouchableOpacity>
      )}
    </View>
  );
}