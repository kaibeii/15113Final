import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useWardrobe } from '../context/WardrobeContext';
import { generateOutfit } from '../api/wardrobeApi';
import OutfitCard from '../components/OutfitCard';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

const TABS = ['Generated', 'Saved'];

function OutfitSlot({ item, label }) {
  return (
    <View style={styles.bigSlotWrap}>
      <View style={styles.bigSlot}>
        {item?.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.bigSlotImage} resizeMode="contain" />
        ) : (
          <View style={styles.bigSlotEmpty}>
            <Ionicons name="shirt-outline" size={28} color={COLORS.gray200} />
            <Text style={styles.bigSlotEmptyText}>{label}</Text>
          </View>
        )}
      </View>
      <Text style={styles.bigSlotLabel}>{label}</Text>
    </View>
  );
}

export default function OutfitsScreen({ navigation }) {
  const { items, savedOutfits, saveOutfit, removeSavedOutfit } = useWardrobe();
  const [activeTab, setActiveTab] = useState('Generated');
  const [currentOutfit, setCurrentOutfit] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const hasEnoughItems = () => {
    const tops   = items.filter((i) => i.type === 'top');
    const bottoms = items.filter((i) => i.type === 'bottom');
    const shoes  = items.filter((i) => i.type === 'shoes');
    return tops.length > 0 && bottoms.length > 0 && shoes.length > 0;
  };

  const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const handleGenerate = async () => {
    if (!hasEnoughItems()) {
      Alert.alert(
        'Not enough items',
        'You need at least 1 top, 1 bottom, and 1 pair of shoes to generate an outfit.',
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
      // Fallback: local random generation when backend is not running
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
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Outfits</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'Generated' ? (
          <>
            {/* Generated outfit card */}
            <View style={styles.outfitCard}>
              {generating ? (
                <View style={styles.generatingState}>
                  <ActivityIndicator size="large" color={COLORS.purple600} />
                  <Text style={styles.generatingText}>Picking your outfit…</Text>
                </View>
              ) : currentOutfit ? (
                <>
                  <Text style={styles.outfitCardTitle}>Today's outfit</Text>
                  <View style={styles.outfitSlots}>
                    <OutfitSlot item={currentOutfit.top}    label="Top" />
                    <OutfitSlot item={currentOutfit.bottom} label="Bottom" />
                    <OutfitSlot item={currentOutfit.shoes}  label="Shoes" />
                  </View>
                  <View style={styles.outfitActions}>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.actionBtnPrimary, isSaved && styles.actionBtnSaved]}
                      onPress={handleSave}
                      disabled={isSaved}
                    >
                      <Ionicons
                        name={isSaved ? 'checkmark' : 'bookmark-outline'}
                        size={16}
                        color={COLORS.white}
                      />
                      <Text style={styles.actionBtnTextPrimary}>
                        {isSaved ? 'Saved' : 'Save outfit'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.actionBtnSecondary]}
                      onPress={handleGenerate}
                    >
                      <Ionicons name="refresh-outline" size={16} color={COLORS.purple600} />
                      <Text style={styles.actionBtnTextSecondary}>Regenerate</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <View style={styles.emptyOutfit}>
                  <View style={styles.emptySlots}>
                    {['Top', 'Bottom', 'Shoes'].map((l) => (
                      <View key={l} style={styles.bigSlotEmpty2}>
                        <Ionicons name="shirt-outline" size={22} color={COLORS.gray100} />
                      </View>
                    ))}
                  </View>
                  <Text style={styles.emptyOutfitText}>
                    Tap below to generate your first outfit
                  </Text>
                </View>
              )}
            </View>

            {/* Generate button */}
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
              <Text style={styles.hintText}>
                Add at least 1 top, 1 bottom, and 1 pair of shoes to get started.
              </Text>
            )}
          </>
        ) : (
          <>
            {savedOutfits.length === 0 ? (
              <View style={styles.emptySaved}>
                <Ionicons name="bookmark-outline" size={40} color={COLORS.gray100} />
                <Text style={styles.emptySavedTitle}>No saved outfits</Text>
                <Text style={styles.emptySavedText}>
                  Generate an outfit and tap "Save outfit" to keep it here.
                </Text>
              </View>
            ) : (
              savedOutfits.map((outfit) => (
                <OutfitCard
                  key={outfit.id}
                  outfit={outfit}
                  onDelete={removeSavedOutfit}
                />
              ))
            )}
          </>
        )}
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  header: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.sm, paddingBottom: SPACING.sm },
  title: { fontSize: 22, fontWeight: '500', color: COLORS.black },

  tabRow: { flexDirection: 'row', paddingHorizontal: SPACING.lg, gap: SPACING.sm, marginBottom: SPACING.md },
  tab: { paddingHorizontal: SPACING.md, paddingVertical: 6, borderRadius: RADIUS.full, backgroundColor: COLORS.gray50, borderWidth: 0.5, borderColor: COLORS.gray100 },
  tabActive: { backgroundColor: COLORS.purple50, borderColor: COLORS.purple200 },
  tabText: { fontSize: 13, color: COLORS.gray600 },
  tabTextActive: { color: COLORS.purple800, fontWeight: '500' },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: SPACING.lg },

  outfitCard: { backgroundColor: COLORS.purple50, borderRadius: RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.md, minHeight: 200, justifyContent: 'center' },
  outfitCardTitle: { fontSize: 13, fontWeight: '500', color: COLORS.purple800, marginBottom: SPACING.md },

  outfitSlots: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.md },
  bigSlotWrap: { flex: 1, alignItems: 'center', gap: 6 },
  bigSlot: { width: '90%', aspectRatio: 0.8, backgroundColor: COLORS.white, borderRadius: RADIUS.md, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', borderWidth: 0.5, borderColor: COLORS.purple100 },
  bigSlotImage: { width: '100%', height: '100%' },
  bigSlotEmpty: { alignItems: 'center', gap: 4 },
  bigSlotEmptyText: { fontSize: 10, color: COLORS.gray200 },
  bigSlotLabel: { fontSize: 11, color: COLORS.purple600, fontWeight: '500' },

  outfitActions: { flexDirection: 'row', gap: SPACING.sm },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, borderRadius: RADIUS.md, paddingVertical: 10 },
  actionBtnPrimary: { backgroundColor: COLORS.purple600 },
  actionBtnSaved: { backgroundColor: COLORS.teal600 },
  actionBtnSecondary: { backgroundColor: 'transparent', borderWidth: 0.5, borderColor: COLORS.purple400 },
  actionBtnTextPrimary: { color: COLORS.white, fontSize: 13, fontWeight: '500' },
  actionBtnTextSecondary: { color: COLORS.purple600, fontSize: 13, fontWeight: '500' },

  generatingState: { alignItems: 'center', gap: SPACING.md, paddingVertical: SPACING.xl },
  generatingText: { fontSize: 14, color: COLORS.purple600 },

  emptyOutfit: { alignItems: 'center', gap: SPACING.md, paddingVertical: SPACING.lg },
  emptySlots: { flexDirection: 'row', gap: SPACING.sm },
  bigSlotEmpty2: { width: 72, height: 88, backgroundColor: COLORS.white, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center', borderWidth: 0.5, borderColor: COLORS.purple100, opacity: 0.6 },
  emptyOutfitText: { fontSize: 13, color: COLORS.purple400, textAlign: 'center' },

  generateBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.purple600, borderRadius: RADIUS.lg, paddingVertical: 14, marginBottom: SPACING.sm },
  generateBtnDisabled: { backgroundColor: COLORS.gray100 },
  generateBtnText: { color: COLORS.white, fontSize: 15, fontWeight: '500' },

  hintText: { fontSize: 12, color: COLORS.gray400, textAlign: 'center', lineHeight: 20 },

  emptySaved: { alignItems: 'center', paddingTop: 60, gap: SPACING.sm },
  emptySavedTitle: { fontSize: 16, fontWeight: '500', color: COLORS.black },
  emptySavedText: { fontSize: 14, color: COLORS.gray400, textAlign: 'center', lineHeight: 22 },
});
