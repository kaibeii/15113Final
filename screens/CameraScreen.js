import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWardrobe } from '../context/WardrobeContext';
import { uploadClothingItem } from '../api/wardrobeApi';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

const TYPES = [
  { value: 'top',    label: 'Top',     icon: 'shirt-outline' },
  { value: 'bottom', label: 'Bottom',  icon: 'reorder-three-outline' },
  { value: 'shoes',  label: 'Shoes',   icon: 'footsteps-outline' },
  { value: 'hat',    label: 'Hat',     icon: 'umbrella-outline' },
  { value: 'other',  label: 'Other',   icon: 'ellipsis-horizontal-outline' },
];

export default function CameraScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedUri, setCapturedUri] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [aiSuggested, setAiSuggested] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [facing, setFacing] = useState('back');
  const cameraRef = useRef(null);
  const { addItem } = useWardrobe();

  useEffect(() => {
    // Simulate AI suggestion after capture (Phase 4 will call real Vision API)
    if (capturedUri && !aiSuggested) {
      const suggestions = ['top', 'bottom', 'shoes', 'hat'];
      const mock = suggestions[Math.floor(Math.random() * suggestions.length)];
      setTimeout(() => {
        setAiSuggested(mock);
        setSelectedType(mock);
      }, 600);
    }
  }, [capturedUri]);

  if (!permission) return <View style={styles.center} />;

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.center}>
        <Ionicons name="camera-outline" size={48} color={COLORS.gray200} />
        <Text style={styles.permTitle}>Camera access needed</Text>
        <Text style={styles.permSub}>
          We need camera access to photograph your clothing items.
        </Text>
        <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
          <Text style={styles.permBtnText}>Allow camera</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
    setCapturedUri(photo.uri);
    setAiSuggested(null);
    setSelectedType(null);
  };

  const pickFromLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setCapturedUri(result.assets[0].uri);
      setAiSuggested(null);
      setSelectedType(null);
    }
  };

  const retake = () => {
    setCapturedUri(null);
    setSelectedType(null);
    setAiSuggested(null);
  };

  const confirmAndUpload = async () => {
    if (!selectedType) {
      Alert.alert('Select a type', 'Please choose what type of clothing this is.');
      return;
    }
    setUploading(true);
    try {
      const item = await uploadClothingItem(capturedUri, selectedType);
      addItem(item);
      setCapturedUri(null);
      setSelectedType(null);
      setAiSuggested(null);
      navigation.navigate('Wardrobe');
    } catch (e) {
      // Dev fallback — save locally without backend
      const mockItem = {
        _id: Date.now().toString(),
        imageUrl: capturedUri,
        type: selectedType,
        createdAt: new Date().toISOString(),
      };
      addItem(mockItem);
      setCapturedUri(null);
      setSelectedType(null);
      setAiSuggested(null);
      navigation.navigate('Wardrobe');
    } finally {
      setUploading(false);
    }
  };

  // --- Preview + confirm screen ---
  if (capturedUri) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.previewHeader}>
          <TouchableOpacity onPress={retake} hitSlop={8}>
            <Ionicons name="arrow-back" size={24} color={COLORS.black} />
          </TouchableOpacity>
          <Text style={styles.previewTitle}>Confirm item</Text>
          <View style={{ width: 24 }} />
        </View>

        <Image source={{ uri: capturedUri }} style={styles.preview} resizeMode="contain" />

        <View style={styles.confirmPanel}>
          {/* AI suggestion banner */}
          {aiSuggested ? (
            <View style={styles.aiBanner}>
              <Ionicons name="sparkles-outline" size={14} color={COLORS.purple600} />
              <Text style={styles.aiBannerText}>
                AI suggests:{' '}
                <Text style={styles.aiBannerBold}>
                  {TYPES.find((t) => t.value === aiSuggested)?.label}
                </Text>
              </Text>
              <Text style={styles.aiBannerHint}>Tap to change</Text>
            </View>
          ) : (
            <View style={styles.aiBanner}>
              <ActivityIndicator size="small" color={COLORS.purple400} />
              <Text style={styles.aiBannerText}>Analysing clothing type…</Text>
            </View>
          )}

          {/* Type selector */}
          <Text style={styles.typeLabel}>Type</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.typeRow}
          >
            {TYPES.map((t) => (
              <TouchableOpacity
                key={t.value}
                style={[
                  styles.typeChip,
                  selectedType === t.value && styles.typeChipActive,
                  t.value === aiSuggested && selectedType !== t.value && styles.typeChipSuggested,
                ]}
                onPress={() => setSelectedType(t.value)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={t.icon}
                  size={16}
                  color={
                    selectedType === t.value ? COLORS.purple800 : COLORS.gray400
                  }
                />
                <Text
                  style={[
                    styles.typeChipText,
                    selectedType === t.value && styles.typeChipTextActive,
                  ]}
                >
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Save button */}
          <TouchableOpacity
            style={[styles.saveBtn, (!selectedType || uploading) && styles.saveBtnDisabled]}
            onPress={confirmAndUpload}
            disabled={!selectedType || uploading}
          >
            {uploading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <Ionicons name="checkmark" size={18} color={COLORS.white} />
                <Text style={styles.saveBtnText}>Save to wardrobe</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // --- Camera viewfinder ---
  return (
    <View style={styles.cameraContainer}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        {/* Top controls */}
        <SafeAreaView edges={['top']}>
          <View style={styles.camTopBar}>
            <TouchableOpacity
              style={styles.camIconBtn}
              onPress={() => setFacing((f) => (f === 'back' ? 'front' : 'back'))}
            >
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

        {/* Viewfinder corners */}
        <View style={styles.viewfinder}>
          <View style={[styles.corner, styles.tl]} />
          <View style={[styles.corner, styles.tr]} />
          <View style={[styles.corner, styles.bl]} />
          <View style={[styles.corner, styles.br]} />
        </View>

        {/* Shutter */}
        <SafeAreaView edges={['bottom']} style={styles.shutterArea}>
          <TouchableOpacity style={styles.shutter} onPress={takePicture} activeOpacity={0.8}>
            <View style={styles.shutterInner} />
          </TouchableOpacity>
        </SafeAreaView>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl, gap: SPACING.md, backgroundColor: COLORS.white },
  cameraContainer: { flex: 1 },
  camera: { flex: 1 },

  // Camera controls
  camTopBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm },
  camIconBtn: { padding: SPACING.sm },
  camHintPill: { backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: RADIUS.full, paddingHorizontal: SPACING.md, paddingVertical: 5 },
  camHintText: { color: COLORS.white, fontSize: 12 },

  // Viewfinder corners
  viewfinder: { position: 'absolute', top: '25%', left: '12%', right: '12%', bottom: '25%' },
  corner: { position: 'absolute', width: 22, height: 22 },
  tl: { top: 0, left: 0, borderTopWidth: 2.5, borderLeftWidth: 2.5, borderColor: COLORS.purple200, borderTopLeftRadius: 4 },
  tr: { top: 0, right: 0, borderTopWidth: 2.5, borderRightWidth: 2.5, borderColor: COLORS.purple200, borderTopRightRadius: 4 },
  bl: { bottom: 0, left: 0, borderBottomWidth: 2.5, borderLeftWidth: 2.5, borderColor: COLORS.purple200, borderBottomLeftRadius: 4 },
  br: { bottom: 0, right: 0, borderBottomWidth: 2.5, borderRightWidth: 2.5, borderColor: COLORS.purple200, borderBottomRightRadius: 4 },

  // Shutter
  shutterArea: { position: 'absolute', bottom: 0, left: 0, right: 0, alignItems: 'center', paddingBottom: SPACING.xl + 8 },
  shutter: { width: 68, height: 68, borderRadius: 34, borderWidth: 3, borderColor: 'rgba(255,255,255,0.8)', alignItems: 'center', justifyContent: 'center' },
  shutterInner: { width: 52, height: 52, borderRadius: 26, backgroundColor: COLORS.white },

  // Permission screen
  permTitle: { fontSize: 18, fontWeight: '500', color: COLORS.black, textAlign: 'center' },
  permSub: { fontSize: 14, color: COLORS.gray400, textAlign: 'center', lineHeight: 22 },
  permBtn: { backgroundColor: COLORS.purple600, borderRadius: RADIUS.lg, paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md },
  permBtnText: { color: COLORS.white, fontSize: 15, fontWeight: '500' },

  // Preview + confirm
  previewHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm },
  previewTitle: { fontSize: 16, fontWeight: '500', color: COLORS.black },
  preview: { flex: 1, backgroundColor: COLORS.gray50 },

  confirmPanel: { backgroundColor: COLORS.white, borderTopWidth: 0.5, borderTopColor: COLORS.gray100, padding: SPACING.lg, gap: SPACING.md },

  aiBanner: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, backgroundColor: COLORS.purple50, borderRadius: RADIUS.md, padding: SPACING.sm },
  aiBannerText: { fontSize: 13, color: COLORS.purple800, flex: 1 },
  aiBannerBold: { fontWeight: '500' },
  aiBannerHint: { fontSize: 11, color: COLORS.purple400 },

  typeLabel: { fontSize: 13, fontWeight: '500', color: COLORS.gray600 },
  typeRow: { flexDirection: 'row', gap: SPACING.sm },
  typeChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: SPACING.md, paddingVertical: 8, borderRadius: RADIUS.full, backgroundColor: COLORS.gray50, borderWidth: 0.5, borderColor: COLORS.gray100 },
  typeChipActive: { backgroundColor: COLORS.purple50, borderColor: COLORS.purple400 },
  typeChipSuggested: { borderColor: COLORS.purple200 },
  typeChipText: { fontSize: 13, color: COLORS.gray600 },
  typeChipTextActive: { color: COLORS.purple800, fontWeight: '500' },

  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.purple600, borderRadius: RADIUS.lg, paddingVertical: 14 },
  saveBtnDisabled: { backgroundColor: COLORS.gray100 },
  saveBtnText: { color: COLORS.white, fontSize: 15, fontWeight: '500' },
});
