import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useWardrobe } from '../context/WardrobeContext';
import { generateOutfit } from '../api/wardrobeApi';
import OutfitCard from '../components/OutfitCard';
import styles from '../styles/index';
import { COLORS } from '../constants/theme';

function OutfitSlot({ item, label }) {
  return (
    <View style={styles.outfitSlotWrap}>
      <View style={styles.outfitSlot}>
        {item?.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.outfitSlotImage} resizeMode="contain" />
        ) : (
          <View>
            <Ionicons name="shirt-outline" size={28} color={COLORS.gray200} />
            <Text style={styles.outfitSlotEmptyText}>{label}</Text>
          </View>
        )}
      </View>
      <Text style={styles.outfitSlotLabel}>{label}</Text>
    </View>
  );
}

export default function OutfitsScreen({ navigation }) {
  const { items, savedOutfits, saveOutfit, removeSavedOutfit } = useWardrobe();
  const [currentOutfit, setCurrentOutfit] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const hasEnoughItems = () => {
    return (
      items.filter((i) => i.type === 'top').length > 0 &&
      items.filter((i) => i.type === 'bottom').length > 0 &&
      items.filter((i) => i.type === 'shoes').length > 0
    );
  };

  const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // Refresh outfit items with latest data from context whenever items change
  const getRefreshedOutfit = (outfit) => {
    if (!outfit) return null;
    return {
      ...outfit,
      top: outfit.top ? items.find((i) => i._id === outfit.top._id) || outfit.top : null,
      bottom: outfit.bottom ? items.find((i) => i._id === outfit.bottom._id) || outfit.bottom : null,
      shoes: outfit.shoes ? items.find((i) => i._id === outfit.shoes._id) || outfit.shoes : null,
    };
  };

  const handleGenerate = async () => {
    if (!hasEnoughItems()) {
      Alert.alert(
        'Not enough items',
        'You need at least 1 top, 1 bottom, and 1 pair of shoes.',
        [
          { text: 'OK' },
          { text: 'Add items', onPress: () => navigation.navigate('Camera') },
        ]
      );
      return;
    }
    setGenerating(true);
    setIsSaved(false);
    try {
      const outfit = await generateOutfit();
      setCurrentOutfit(outfit);
    } catch (_) {
      const tops    = items.filter((i) => i.type === 'top');
      const bottoms = items.filter((i) => i.type === 'bottom');
      const shoes   = items.filter((i) => i.type === 'shoes');
      setCurrentOutfit({ top: pickRandom(tops), bottom: pickRandom(bottoms), shoes: pickRandom(shoes) });
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = () => {
    if (!currentOutfit) return;
    saveOutfit(currentOutfit);
    setIsSaved(true);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>Outfits</Text>
      </View>

      <ScrollView
        style={styles.outfitsScroll}
        contentContainerStyle={styles.outfitsScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Generated outfit section */}
        <View style={styles.outfitGeneratedCard}>
          {generating ? (
            <View style={styles.outfitGeneratingState}>
              <ActivityIndicator size="large" color={COLORS.purple600} />
              <Text style={styles.outfitGeneratingText}>Picking your outfit…</Text>
            </View>
          ) : currentOutfit ? (
            <>
              <Text style={styles.outfitGeneratedTitle}>Today's outfit</Text>
              <View style={styles.outfitSlots}>
                <OutfitSlot item={getRefreshedOutfit(currentOutfit).top}    label="Top" />
                <OutfitSlot item={getRefreshedOutfit(currentOutfit).bottom} label="Bottom" />
                <OutfitSlot item={getRefreshedOutfit(currentOutfit).shoes}  label="Shoes" />
              </View>
              <View style={styles.outfitActions}>
                <TouchableOpacity
                  style={[styles.outfitActionPrimary, isSaved && styles.outfitActionSaved]}
                  onPress={handleSave}
                  disabled={isSaved}
                >
                  <Ionicons name={isSaved ? 'checkmark' : 'bookmark-outline'} size={16} color={COLORS.white} />
                  <Text style={styles.outfitActionTextPrimary}>{isSaved ? 'Saved' : 'Save outfit'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.outfitActionSecondary} onPress={handleGenerate}>
                  <Ionicons name="refresh-outline" size={16} color={COLORS.purple600} />
                  <Text style={styles.outfitActionTextSecondary}>Regenerate</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.outfitEmptyWrap}>
              <View style={styles.outfitEmptySlots}>
                {['Top', 'Bottom', 'Shoes'].map((l) => (
                  <View key={l} style={styles.outfitEmptySlot}>
                    <Ionicons name="shirt-outline" size={22} color={COLORS.gray100} />
                  </View>
                ))}
              </View>
              <Text style={styles.outfitEmptyText}>Tap below to generate your first outfit</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.generateBtn, generating && styles.generateBtnDisabled]}
          onPress={handleGenerate}
          disabled={generating}
          activeOpacity={0.8}
        >
          <Ionicons name="sparkles-outline" size={18} color={COLORS.white} />
          <Text style={styles.generateBtnText}>Generate outfit</Text>
        </TouchableOpacity>

        {!hasEnoughItems() && (
          <Text style={styles.generateHintText}>
            Add at least 1 top, 1 bottom, and 1 pair of shoes to get started.
          </Text>
        )}

        {/* Saved outfits section */}
        {savedOutfits.length > 0 && (
          <View style={styles.savedSection}>
            <Text style={styles.savedSectionTitle}>Saved outfits</Text>
            {savedOutfits.map((outfit) => (
              <OutfitCard key={outfit.id} outfit={getRefreshedOutfit(outfit)} onDelete={removeSavedOutfit} />
            ))}
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}