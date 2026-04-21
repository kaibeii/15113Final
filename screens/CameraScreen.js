import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  TextInput,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWardrobe } from '../context/WardrobeContext';
import { uploadClothingItem } from '../api/wardrobeApi';
import styles from '../styles/index';
import { COLORS, RADIUS, COLOR_SWATCHES, COLOR_LABELS } from '../constants/theme';

const TYPES = [
  { value: 'top',    label: 'Top',    icon: 'shirt-outline' },
  { value: 'bottom', label: 'Bottom', icon: 'reorder-three-outline' },
  { value: 'shoes',  label: 'Shoes',  icon: 'footsteps-outline' },
  { value: 'hat',    label: 'Hat',    icon: 'umbrella-outline' },
  { value: 'other',  label: 'Other',  icon: 'ellipsis-horizontal-outline' },
];

const COLOR_OPTIONS = [
  'black', 'white', 'grey', 'navy', 'blue', 'red',
  'green', 'yellow', 'orange', 'pink', 'purple',
  'brown', 'beige', 'multicolor', 'pattern',
];

function ColorDot({ color, size = 18 }) {
  const swatch = COLOR_SWATCHES[color];
  if (color === 'multicolor') {
    return (
      <View style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden', flexDirection: 'row' }}>
        <View style={{ flex: 1, backgroundColor: '#e53935' }} />
        <View style={{ flex: 1, backgroundColor: '#2196f3' }} />
      </View>
    );
  }
  if (color === 'pattern') {
    return (
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: '#f5f5f5', borderWidth: 1, borderColor: '#ccc', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: size * 0.55 }}>≋</Text>
      </View>
    );
  }
  return (
    <View style={[
      { width: size, height: size, borderRadius: size / 2, backgroundColor: swatch || '#ccc' },
      color === 'white' && { borderWidth: 1, borderColor: '#ddd' },
    ]} />
  );
}

export default function CameraScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedUri, setCapturedUri] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [facing, setFacing] = useState('back');
  const [cameraKey, setCameraKey] = useState(0);
  const cameraRef = useRef(null);
  const { addItem } = useWardrobe();

  if (!permission) return <View style={styles.center} />;

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.center}>
        <Ionicons name="camera-outline" size={48} color={COLORS.gray200} />
        <Text style={styles.permTitle}>Camera access needed</Text>
        <Text style={styles.permSub}>We need camera access to photograph your clothing items.</Text>
        <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
          <Text style={styles.permBtnText}>Allow camera</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      setCapturedUri(photo.uri);
      setSelectedType(null);
      setSelectedColor(null);
      setDescription('');
    } catch (e) {
      Alert.alert('Camera error', 'Could not take photo. Please try again.');
      setCapturedUri(null);
    }
  };

  const pickFromLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setCapturedUri(result.assets[0].uri);
      setSelectedType(null);
      setSelectedColor(null);
      setDescription('');
    }
  };

  const retake = () => {
    setCapturedUri(null);
    setSelectedType(null);
    setSelectedColor(null);
    setDescription('');
    setCameraKey((k) => k + 1);
  };

  const confirmAndUpload = async () => {
    if (!selectedType) {
      Alert.alert('Select a type', 'Please choose what type of clothing this is.');
      return;
    }
    setUploading(true);
    try {
      const colorToSend = selectedColor || 'unknown';
      const { item, suggestedColor: detected } = await uploadClothingItem(
        capturedUri, selectedType, colorToSend, description
      );
      if (!selectedColor && detected) item.color = detected;
      addItem(item);
      retake();
      navigation.navigate('Wardrobe');
    } catch (e) {
      const mockItem = {
        _id: Date.now().toString(),
        imageUrl: capturedUri,
        type: selectedType,
        color: selectedColor || 'unknown',
        description,
        createdAt: new Date().toISOString(),
      };
      addItem(mockItem);
      retake();
      navigation.navigate('Wardrobe');
    } finally {
      setUploading(false);
    }
  };

  if (capturedUri) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.previewHeader}>
          <TouchableOpacity onPress={retake} hitSlop={8}>
            <Ionicons name="arrow-back" size={24} color={COLORS.black} />
          </TouchableOpacity>
          <Text style={styles.previewTitle}>Add item</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          style={styles.previewScroll}
          contentContainerStyle={styles.previewScrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Image source={{ uri: capturedUri }} style={styles.previewImage} resizeMode="contain" />

          <Text style={styles.sectionLabel}>Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.typeRow}>
            {TYPES.map((t) => (
              <TouchableOpacity
                key={t.value}
                style={[styles.typeChip, selectedType === t.value && styles.typeChipActive]}
                onPress={() => setSelectedType(t.value)}
                activeOpacity={0.7}
              >
                <Ionicons name={t.icon} size={16} color={selectedType === t.value ? COLORS.purple800 : COLORS.gray400} />
                <Text style={[styles.typeChipText, selectedType === t.value && styles.typeChipTextActive]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.colorHeader}>
            <Text style={styles.sectionLabel}>Color</Text>
            <Text style={styles.colorHint}>
              {selectedColor ? `Selected: ${COLOR_LABELS[selectedColor]}` : 'Auto-detected after saving — or pick manually'}
            </Text>
          </View>
          <View style={styles.colorGrid}>
            {COLOR_OPTIONS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[styles.colorOption, selectedColor === color && styles.colorOptionSelected]}
                onPress={() => setSelectedColor(selectedColor === color ? null : color)}
                activeOpacity={0.7}
              >
                <ColorDot color={color} size={20} />
                <Text style={[styles.colorOptionLabel, selectedColor === color && styles.colorOptionLabelSelected]}>
                  {COLOR_LABELS[color]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionLabel}>
            Description <Text style={styles.optional}>(optional)</Text>
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. favourite going out top..."
            placeholderTextColor={COLORS.gray200}
            value={description}
            onChangeText={setDescription}
            multiline
            maxLength={200}
          />

          <TouchableOpacity
            style={[styles.primaryBtn, (!selectedType || uploading) && styles.primaryBtnDisabled]}
            onPress={confirmAndUpload}
            disabled={!selectedType || uploading}
          >
            {uploading ? (
              <>
                <ActivityIndicator color={COLORS.white} />
                <Text style={styles.primaryBtnText}>Processing image...</Text>
              </>
            ) : (
              <>
                <Ionicons name="checkmark" size={18} color={COLORS.white} />
                <Text style={styles.primaryBtnText}>Save to wardrobe</Text>
              </>
            )}
          </TouchableOpacity>
          <View style={{ height: 32 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.cameraContainer}>
      <CameraView key={cameraKey} ref={cameraRef} style={styles.camera} facing={facing}>
        <SafeAreaView edges={['top']}>
          <View style={styles.camTopBar}>
            <TouchableOpacity style={styles.camIconBtn} onPress={() => setFacing((f) => (f === 'back' ? 'front' : 'back'))}>
              <Ionicons name="camera-reverse-outline" size={26} color={COLORS.white} />
            </TouchableOpacity>
            <View style={styles.camHintPill}>
              <Text style={styles.camHintText}>Centre your item in frame</Text>
            </View>
            <TouchableOpacity style={styles.camIconBtn} onPress={pickFromLibrary}>
              <Ionicons name="images-outline" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <View style={styles.viewfinder}>
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />
        </View>

        <SafeAreaView edges={['bottom']} style={styles.shutterArea}>
          <TouchableOpacity style={styles.shutter} onPress={takePicture} activeOpacity={0.8}>
            <View style={styles.shutterInner} />
          </TouchableOpacity>
        </SafeAreaView>
      </CameraView>
    </View>
  );
}