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
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  COLORS,
  RADIUS,
  SPACING,
  COLOR_SWATCHES,
  COLOR_LABELS,
  CATEGORY_LABELS,
} from '../constants/theme';
import { updateClothingItem, deleteClothingItem } from '../api/wardrobeApi';
import { useWardrobe } from '../context/WardrobeContext';

const TYPES = [
  { value: 'top',    label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'shoes',  label: 'Shoes' },
  { value: 'hat',    label: 'Hat' },
  { value: 'other',  label: 'Other' },
];

const COLOR_OPTIONS = [
  'black', 'white', 'grey', 'navy', 'blue', 'red',
  'green', 'yellow', 'orange', 'pink', 'purple',
  'brown', 'beige', 'multicolor', 'pattern',
];

function ColorDot({ color, size = 16 }) {
  const swatch = COLOR_SWATCHES[color];

  if (color === 'multicolor') {
    return (
      <View style={[styles.colorDot, { width: size, height: size, borderRadius: size / 2 }]}>
        <View style={[styles.dotHalf, { backgroundColor: '#e53935' }]} />
        <View style={[styles.dotHalf, { backgroundColor: '#2196f3' }]} />
      </View>
    );
  }

  if (color === 'pattern') {
    return (
      <View style={[
        styles.colorDot,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: '#f5f5f5', borderWidth: 1, borderColor: '#ccc' }
      ]}>
        <Text style={{ fontSize: size * 0.6, lineHeight: size }}>≋</Text>
      </View>
    );
  }

  return (
    <View style={[
      styles.colorDot,
      {
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: swatch || '#ccc',
      },
      color === 'white' && { borderWidth: 1, borderColor: '#ddd' },
    ]} />
  );
}

function ColorPicker({ selected, onSelect }) {
  return (
    <View style={styles.colorPickerWrap}>
      {COLOR_OPTIONS.map((color) => (
        <TouchableOpacity
          key={color}
          style={[
            styles.colorPickerItem,
            selected === color && styles.colorPickerItemSelected,
          ]}
          onPress={() => onSelect(color)}
          activeOpacity={0.7}
        >
          <ColorDot color={color} size={22} />
          <Text style={[
            styles.colorPickerLabel,
            selected === color && styles.colorPickerLabelSelected,
          ]}>
            {COLOR_LABELS[color]}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function ClothingItem({ item, onDelete, size = 100 }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editType, setEditType] = useState(item.type);
  const [editColor, setEditColor] = useState(item.color);
  const [editDescription, setEditDescription] = useState(item.description || '');
  const [saving, setSaving] = useState(false);
  const { updateItem } = useWardrobe();

  const openModal = () => {
    setEditType(item.type);
    setEditColor(item.color);
    setEditDescription(item.description || '');
    setEditMode(false);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditMode(false);
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      const updated = await updateClothingItem(item._id, {
        type: editType,
        color: editColor,
        description: editDescription,
      });
      updateItem(updated);
      setEditMode(false);
    } catch (e) {
      // Fallback: update locally if backend unreachable
      updateItem({
        ...item,
        type: editType,
        color: editColor,
        description: editDescription,
      });
      setEditMode(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    closeModal();
    Alert.alert('Remove item', 'Delete this item from your wardrobe?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          onDelete(item._id);
          try { await deleteClothingItem(item._id); } catch (_) {}
        },
      },
    ]);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.card, { width: size, height: size }]}
        onPress={openModal}
        activeOpacity={0.8}
      >
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="contain" />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="shirt-outline" size={28} color={COLORS.gray200} />
          </View>
        )}
        {item.color && item.color !== 'unknown' && (
          <View style={styles.colorDotWrap}>
            <ColorDot color={item.color} size={12} />
          </View>
        )}
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeModal} hitSlop={8}>
              <Ionicons name="close" size={24} color={COLORS.black} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editMode ? 'Edit item' : 'Item details'}
            </Text>
            {editMode ? (
              <TouchableOpacity onPress={() => setEditMode(false)} hitSlop={8}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleDelete} hitSlop={8}>
                <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView
            contentContainerStyle={styles.modalContent}
            keyboardShouldPersistTaps="handled"
          >
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

            {editMode ? (
              <>
                {/* Type selector */}
                <Text style={styles.sectionLabel}>Type</Text>
                <View style={styles.chipRow}>
                  {TYPES.map((t) => (
                    <TouchableOpacity
                      key={t.value}
                      style={[styles.chip, editType === t.value && styles.chipActive]}
                      onPress={() => setEditType(t.value)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.chipText, editType === t.value && styles.chipTextActive]}>
                        {t.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Color picker */}
                <Text style={styles.sectionLabel}>Color</Text>
                <ColorPicker selected={editColor} onSelect={setEditColor} />

                {/* Description */}
                <Text style={styles.sectionLabel}>
                  Description <Text style={styles.optional}>(optional)</Text>
                </Text>
                <TextInput
                  style={styles.descInput}
                  placeholder="e.g. favourite going out top..."
                  placeholderTextColor={COLORS.gray200}
                  value={editDescription}
                  onChangeText={setEditDescription}
                  multiline
                  maxLength={200}
                />

                {/* Save button */}
                <TouchableOpacity
                  style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
                  onPress={handleSaveEdit}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator color={COLORS.white} />
                  ) : (
                    <>
                      <Ionicons name="checkmark" size={18} color={COLORS.white} />
                      <Text style={styles.saveBtnText}>Save changes</Text>
                    </>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <>
                {/* View mode — tags row */}
                <View style={styles.tagsRow}>
                  <View style={styles.typeBadge}>
                    <Text style={styles.typeBadgeText}>
                      {CATEGORY_LABELS[item.type] || item.type}
                    </Text>
                  </View>
                  <View style={styles.colorBadge}>
                    <ColorDot color={item.color} size={14} />
                    <Text style={styles.colorBadgeText}>
                      {COLOR_LABELS[item.color] || item.color}
                    </Text>
                  </View>
                </View>

                {/* Description */}
                <View style={styles.descriptionBox}>
                  <Text style={styles.descriptionLabel}>Description</Text>
                  {item.description ? (
                    <Text style={styles.descriptionText}>{item.description}</Text>
                  ) : (
                    <Text style={styles.descriptionEmpty}>No description added</Text>
                  )}
                </View>

                {/* Date added */}
                <Text style={styles.dateText}>
                  Added {new Date(item.createdAt).toLocaleDateString('en-US', {
                    month: 'long', day: 'numeric', year: 'numeric',
                  })}
                </Text>

                {/* Edit button */}
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => setEditMode(true)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="pencil-outline" size={16} color={COLORS.purple600} />
                  <Text style={styles.editBtnText}>Edit item</Text>
                </TouchableOpacity>
              </>
            )}

            <View style={{ height: 32 }} />
          </ScrollView>
        </View>
      </Modal>
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
  image: { width: '100%', height: '100%' },
  placeholder: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  colorDotWrap: { position: 'absolute', bottom: 5, right: 5 },
  colorDot: { overflow: 'hidden', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  dotHalf: { flex: 1, height: '100%' },

  modalContainer: { flex: 1, backgroundColor: COLORS.white },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
    borderBottomWidth: 0.5, borderBottomColor: COLORS.gray100,
  },
  modalTitle: { fontSize: 16, fontWeight: '500', color: COLORS.black },
  cancelText: { fontSize: 14, color: COLORS.purple600 },
  modalContent: { padding: SPACING.lg, gap: SPACING.md },
  modalImageWrap: {
    width: '100%', height: 300,
    backgroundColor: COLORS.gray50, borderRadius: RADIUS.lg,
    overflow: 'hidden', alignItems: 'center', justifyContent: 'center',
  },
  modalImage: { width: '100%', height: '100%' },
  modalImagePlaceholder: { alignItems: 'center', justifyContent: 'center', flex: 1 },

  tagsRow: { flexDirection: 'row', gap: SPACING.sm, flexWrap: 'wrap' },
  typeBadge: {
    backgroundColor: COLORS.purple50, borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md, paddingVertical: 6,
  },
  typeBadgeText: { fontSize: 13, color: COLORS.purple800, fontWeight: '500' },
  colorBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.gray50, borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md, paddingVertical: 6,
    borderWidth: 0.5, borderColor: COLORS.gray100,
  },
  colorBadgeText: { fontSize: 13, color: COLORS.gray600, fontWeight: '500' },

  descriptionBox: {
    backgroundColor: COLORS.gray50, borderRadius: RADIUS.md,
    padding: SPACING.md, gap: SPACING.xs,
  },
  descriptionLabel: {
    fontSize: 11, fontWeight: '500', color: COLORS.gray400,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  descriptionText: { fontSize: 15, color: COLORS.black, lineHeight: 22 },
  descriptionEmpty: { fontSize: 14, color: COLORS.gray200, fontStyle: 'italic' },
  dateText: { fontSize: 12, color: COLORS.gray400, textAlign: 'center' },

  editBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: SPACING.xs, borderWidth: 0.5, borderColor: COLORS.purple400,
    borderRadius: RADIUS.lg, paddingVertical: 12,
  },
  editBtnText: { fontSize: 14, color: COLORS.purple600, fontWeight: '500' },

  // Edit mode
  sectionLabel: { fontSize: 13, fontWeight: '500', color: COLORS.gray600 },
  optional: { fontWeight: '400', color: COLORS.gray400 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  chip: {
    paddingHorizontal: SPACING.md, paddingVertical: 8,
    borderRadius: RADIUS.full, backgroundColor: COLORS.gray50,
    borderWidth: 0.5, borderColor: COLORS.gray100,
  },
  chipActive: { backgroundColor: COLORS.purple50, borderColor: COLORS.purple400 },
  chipText: { fontSize: 13, color: COLORS.gray600 },
  chipTextActive: { color: COLORS.purple800, fontWeight: '500' },

  colorPickerWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  colorPickerItem: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: SPACING.sm, paddingVertical: 6,
    borderRadius: RADIUS.full, backgroundColor: COLORS.gray50,
    borderWidth: 0.5, borderColor: COLORS.gray100,
  },
  colorPickerItemSelected: {
    backgroundColor: COLORS.purple50, borderColor: COLORS.purple400,
  },
  colorPickerLabel: { fontSize: 12, color: COLORS.gray600 },
  colorPickerLabelSelected: { color: COLORS.purple800, fontWeight: '500' },

  descInput: {
    borderWidth: 0.5, borderColor: COLORS.gray100,
    borderRadius: RADIUS.md, padding: SPACING.md,
    fontSize: 14, color: COLORS.black,
    minHeight: 80, textAlignVertical: 'top',
    backgroundColor: COLORS.gray50,
  },
  saveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: SPACING.sm, backgroundColor: COLORS.purple600,
    borderRadius: RADIUS.lg, paddingVertical: 14,
  },
  saveBtnDisabled: { backgroundColor: COLORS.gray100 },
  saveBtnText: { color: COLORS.white, fontSize: 15, fontWeight: '500' },
});