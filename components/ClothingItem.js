import React from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

export default function ClothingItem({ item, onDelete, size = 100 }) {
  const handleLongPress = () => {
    Alert.alert('Remove item', 'Delete this item from your wardrobe?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(item._id) },
    ]);
  };

  return (
    <TouchableOpacity
      style={[styles.card, { width: size, height: size }]}
      onLongPress={handleLongPress}
      activeOpacity={0.8}
    >
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="contain" />
      ) : (
        <View style={styles.placeholder}>
          <Ionicons name="shirt-outline" size={28} color={COLORS.gray200} />
        </View>
      )}
      {item.tags && item.tags.length > 0 && (
        <View style={styles.tagRow}>
          <Text style={styles.tag} numberOfLines={1}>
            {item.tags[0]}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.gray50,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: COLORS.gray100,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tagRow: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    right: 4,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
  },
  tag: {
    fontSize: 9,
    color: COLORS.gray600,
    textAlign: 'center',
  },
});
