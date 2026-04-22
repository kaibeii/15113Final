import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles/index';
import { COLORS, CATEGORY_LABELS, COLOR_LABELS, COLOR_SWATCHES } from '../constants/theme';

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

function ColorDot({ color, size = 16 }) {
  const swatch = COLOR_SWATCHES[color];
  if (color === 'multicolor') {
    return (
      <View style={[styles.colorDot, { width: size, height: size, borderRadius: size / 2 }]}>
        <View style={[styles.colorDotHalf, { backgroundColor: '#e53935' }]} />
        <View style={[styles.colorDotHalf, { backgroundColor: '#2196f3' }]} />
      </View>
    );
  }
  if (color === 'pattern') {
    return (
      <View style={[styles.colorDot, { width: size, height: size, borderRadius: size / 2, backgroundColor: '#f5f5f5', borderWidth: 1, borderColor: '#ccc' }]}>
        <Text style={{ fontSize: size * 0.6 }}>≋</Text>
      </View>
    );
  }
  return (
    <View style={[
      styles.colorDot,
      { width: size, height: size, borderRadius: size / 2, backgroundColor: swatch || '#ccc' },
      color === 'white' && { borderWidth: 1, borderColor: '#ddd' },
    ]} />
  );
}

function OutfitItem({ item, label }) {
  if (!item) {
    return (
      <View style={styles.outfitModalItem}>
        <View style={styles.outfitModalItemImage}>
          <Ionicons name="shirt-outline" size={60} color={COLORS.gray200} />
        </View>
        <View style={styles.outfitModalItemMeta}>
          <Text style={styles.outfitModalItemLabel}>{label}</Text>
          <Text style={styles.outfitModalItemEmpty}>No {label.toLowerCase()} selected</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.outfitModalItem}>
      <View style={styles.outfitModalItemImage}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.outfitModalItemImageContent} resizeMode="contain" />
        ) : (
          <Ionicons name="shirt-outline" size={60} color={COLORS.gray200} />
        )}
      </View>
      <View style={styles.outfitModalItemMeta}>
        <Text style={styles.outfitModalItemLabel}>{label}</Text>
        <Text style={styles.outfitModalItemType}>{CATEGORY_LABELS[item.type] || item.type}</Text>
        <View style={styles.outfitModalItemColor}>
          <ColorDot color={item.color} size={14} />
          <Text style={styles.outfitModalItemColorText}>{COLOR_LABELS[item.color] || item.color}</Text>
        </View>
        {item.description && (
          <Text style={styles.outfitModalItemDescription}>{item.description}</Text>
        )}
      </View>
    </View>
  );
}

export default function OutfitCard({ outfit, onDelete, showDate = true }) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleDelete = () => {
    Alert.alert('Remove outfit', 'Delete this saved outfit?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(outfit.id) },
    ]);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const dateLabel = outfit.savedAt
    ? new Date(outfit.savedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null;

  return (
    <>
      <TouchableOpacity style={styles.outfitCard} onPress={openModal} activeOpacity={0.8}>
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
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
       <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeModal} hitSlop={8}>
              <Ionicons name="close" size={24} color={COLORS.black} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Outfit Details</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView
            contentContainerStyle={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.outfitModalTitle}>
              {outfit.name || 'Saved Outfit'}
            </Text>
            {dateLabel && (
              <Text style={styles.outfitModalDate}>Saved on {dateLabel}</Text>
            )}

            <View style={styles.outfitModalItems}>
              <OutfitItem item={outfit.top} label="Top" />
              <OutfitItem item={outfit.bottom} label="Bottom" />
              <OutfitItem item={outfit.shoes} label="Shoes" />
            </View>

            <View style={{ height: 32 }} />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  );
}