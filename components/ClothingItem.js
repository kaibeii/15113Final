import React, { useState } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/index';
import { COLORS, RADIUS, COLOR_SWATCHES, COLOR_LABELS, CATEGORY_LABELS } from '../constants/theme';
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

function ColorPicker({ selected, onSelect }) {
  return (
    <View style={styles.colorPickerWrap}>
      {COLOR_OPTIONS.map((color) => (
        <TouchableOpacity
          key={color}
          style={[styles.colorPickerItem, selected === color && styles.colorPickerItemSelected]}
          onPress={() => onSelect(color)}
          activeOpacity={0.7}
        >
          <ColorDot color={color} size={22} />
          <Text style={[styles.colorPickerLabel, selected === color && styles.colorPickerLabelSelected]}>
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

  // Update local state when item changes (e.g., after successful save)
  React.useEffect(() => {
    if (!editMode) {
      setEditType(item.type);
      setEditColor(item.color);
      setEditDescription(item.description || '');
    }
  }, [item, editMode]);

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
      // If backend didn't return description, add it from local state
      const itemWithDescription = {
        ...updated,
        description: updated.description || editDescription,
      };
      updateItem(itemWithDescription);
      setEditMode(false);
    } catch (e) {
      // Still update locally even if backend fails
      const localUpdate = { ...item, type: editType, color: editColor, description: editDescription };
      updateItem(localUpdate);
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
        style={[styles.itemCard, { width: size, height: size }]}
        onPress={openModal}
        activeOpacity={0.8}
      >
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.itemImage} resizeMode="contain" />
        ) : (
          <View style={styles.itemPlaceholder}>
            <Ionicons name="shirt-outline" size={28} color={COLORS.gray200} />
          </View>
        )}
        {item.color && item.color !== 'unknown' && (
          <View style={styles.itemColorDotWrap}>
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
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeModal} hitSlop={8}>
              <Ionicons name="close" size={24} color={COLORS.black} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{editMode ? 'Edit item' : 'Item details'}</Text>
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
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.itemModalImageWrap}>
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.itemModalImage} resizeMode="contain" />
              ) : (
                <View style={styles.itemModalImagePlaceholder}>
                  <Ionicons name="shirt-outline" size={60} color={COLORS.gray200} />
                </View>
              )}
            </View>

            {editMode ? (
              <>
                <Text style={styles.sectionLabel}>Type</Text>
                <View style={styles.tagsRow}>
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

                <Text style={styles.sectionLabel}>Color</Text>
                <ColorPicker selected={editColor} onSelect={setEditColor} />

                <Text style={styles.sectionLabel}>
                  Description <Text style={styles.optional}>(optional)</Text>
                </Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. favourite going out top..."
                  placeholderTextColor={COLORS.gray200}
                  value={editDescription}
                  onChangeText={setEditDescription}
                  multiline
                  maxLength={200}
                />

                <TouchableOpacity
                  style={[styles.primaryBtn, saving && styles.primaryBtnDisabled]}
                  onPress={handleSaveEdit}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator color={COLORS.white} />
                  ) : (
                    <>
                      <Ionicons name="checkmark" size={18} color={COLORS.white} />
                      <Text style={styles.primaryBtnText}>Save changes</Text>
                    </>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.tagsRow}>
                  <View style={styles.typeBadge}>
                    <Text style={styles.typeBadgeText}>{CATEGORY_LABELS[item.type] || item.type}</Text>
                  </View>
                  <View style={styles.colorBadge}>
                    <ColorDot color={item.color} size={14} />
                    <Text style={styles.colorBadgeText}>{COLOR_LABELS[item.color] || item.color}</Text>
                  </View>
                </View>

                <View style={styles.itemDescriptionBox}>
                  <Text style={styles.itemDescriptionLabel}>Description</Text>
                  {item.description ? (
                    <Text style={styles.itemDescriptionText}>{item.description}</Text>
                  ) : (
                    <Text style={styles.itemDescriptionEmpty}>No description added</Text>
                  )}
                </View>

                <Text style={styles.itemDateText}>
                  Added {new Date(item.createdAt).toLocaleDateString('en-US', {
                    month: 'long', day: 'numeric', year: 'numeric',
                  })}
                </Text>

                <TouchableOpacity
                  style={styles.outlineBtn}
                  onPress={() => setEditMode(true)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="pencil-outline" size={16} color={COLORS.purple600} />
                  <Text style={styles.outlineBtnText}>Edit item</Text>
                </TouchableOpacity>
              </>
            )}
            <View style={{ height: 32 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}