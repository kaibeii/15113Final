import React, { useState } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, COLOR_SWATCHES, COLOR_LABELS, CATEGORY_LABELS } from '../constants/theme';

function ColorDot({ color }) {
  const swatch = COLOR_SWATCHES[color];

  if (color === 'multicolor') {
    return (
      <View style={[styles.colorDot, styles.colorDotMulti]}>
        <View style={[styles.dotHalf, { backgroundColor: '#e53935' }]} />
        <View style={[styles.dotHalf, { backgroundColor: '#2196f3' }]} />
      </View>
    );
  }

  if (color === 'pattern') {
    return (
      <View style={[styles.colorDot, { backgroundColor: '#f5f5f5', borderWidth: 1, borderColor: '#ccc' }]}>
        <Text style={{ fontSize: 8 }}>≋</Text>
      </View>
    );
  }

  return (
    <View style={[
      styles.colorDot,
      { backgroundColor: swatch || '#ccc' },
      color === 'white' && { borderWidth: 1, borderColor: '#ddd' },
    ]} />
  );
}

function ItemDetailModal({ item, visible, onClose, onDelete }) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} hitSlop={8}>
            <Ionicons name="close" size={24} color={COLORS.black} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Item details</Text>
          <TouchableOpacity
            onPress={() => {
              onClose();
              Alert.alert('Remove item', 'Delete this item from your wardrobe?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => onDelete(item._id) },
              ]);
            }}
            hitSlop={8}
          >
            <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.modalContent}>
          {/* Image */}
          <View style={styles.modalImageWrap}>
            {item.imageUrl ? (
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.modalImage}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.modalImagePlaceholder}>
                <Ionicons name="shirt-outline" size={60} color={COLORS.gray200} />
              </View>
            )}
          </View>

          {/* Tags row */}
          <View style={styles.tagsRow}>
            {/* Type badge */}
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>
                {CATEGORY_LABELS[item.type] || item.type}
              </Text>
            </View>

            {/* Color badge */}
            <View style={styles.colorBadge}>
              <ColorDot color={item.color} />
              <Text style={styles.colorBadgeText}>
                {COLOR_LABELS[item.color] || item.color}
              </Text>
            </View>
          </View>

          {/* Description */}
          {item.description ? (
            <View style={styles.descriptionBox}>
              <Text style={styles.descriptionLabel}>Description</Text>
              <Text style={styles.descriptionText}>{item.description}</Text>
            </View>
          ) : (
            <View style={styles.descriptionBox}>
              <Text style={styles.descriptionLabel}>Description</Text>
              <Text style={styles.descriptionEmpty}>No description added</Text>
            </View>
          )}

          {/* Date added */}
          <Text style={styles.dateText}>
            Added {new Date(item.createdAt).toLocaleDateString('en-US', {
              month: 'long', day: 'numeric', year: 'numeric'
            })}
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );
}

export default function ClothingItem({ item, onDelete, size = 100 }) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={[styles.card, { width: size, height: size }]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="contain" />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="shirt-outline" size={28} color={COLORS.gray200} />
          </View>
        )}

        {/* Color dot badge */}
        {item.color && item.color !== 'unknown' && (
          <View style={styles.colorDotWrap}>
            <ColorDot color={item.color} />
          </View>
        )}
      </TouchableOpacity>

      <ItemDetailModal
        item={item}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onDelete={(id) => {
          setModalVisible(false);
          onDelete(id);
        }}
      />
    </>
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
  colorDotWrap: {
    position: 'absolute',
    bottom: 5,
    right: 5,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  colorDotMulti: {
    overflow: 'hidden',
  },
  dotHalf: {
    flex: 1,
    height: '100%',
  },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.gray100,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.black,
  },
  modalContent: {
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  modalImageWrap: {
    width: '100%',
    height: 300,
    backgroundColor: COLORS.gray50,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  modalImagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    flexWrap: 'wrap',
  },
  typeBadge: {
    backgroundColor: COLORS.purple50,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
  },
  typeBadgeText: {
    fontSize: 13,
    color: COLORS.purple800,
    fontWeight: '500',
  },
  colorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.gray50,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderWidth: 0.5,
    borderColor: COLORS.gray100,
  },
  colorBadgeText: {
    fontSize: 13,
    color: COLORS.gray600,
    fontWeight: '500',
  },
  descriptionBox: {
    backgroundColor: COLORS.gray50,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  descriptionLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.gray400,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  descriptionText: {
    fontSize: 15,
    color: COLORS.black,
    lineHeight: 22,
  },
  descriptionEmpty: {
    fontSize: 14,
    color: COLORS.gray200,
    fontStyle: 'italic',
  },
  dateText: {
    fontSize: 12,
    color: COLORS.gray400,
    textAlign: 'center',
  },
});