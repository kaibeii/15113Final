import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useWardrobe } from '../context/WardrobeContext';
import { generateOutfit } from '../api/wardrobeApi';
import OutfitCard from '../components/OutfitCard';
import styles from '../styles/index';
import { COLORS } from '../constants/theme';

// Pulsing skeleton slot shown while generating
function SkeletonSlot() {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  return (
    <View style={styles.outfitSlotWrap}>
      <Animated.View
        style={[
          styles.outfitSlot,
          { backgroundColor: COLORS.gray100, opacity },
        ]}
      />
      <Animated.View
        style={{
          height: 8,
          width: 36,
          borderRadius: 4,
          backgroundColor: COLORS.gray100,
          marginTop: 5,
          opacity,
        }}
      />
    </View>
  );
}

function OutfitSlot({ item, label }) {
  return (
    <View style={styles.outfitSlotWrap}>
      <View style={styles.outfitSlot}>
        {item?.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.outfitSlotImage}
            resizeMode="contain"
          />
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

  const btnScale = useRef(new Animated.Value(1)).current;

  const animateBtn = () => {
    Animated.sequence([
      Animated.timing(btnScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(btnScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hasEnoughItems = () => {
    return (
      items.filter((i) => i.type === 'top' || i.type === 'sweater').length > 0 &&
      items.filter((i) => i.type === 'bottom').length > 0 &&
      items.filter((i) => i.type === 'shoes').length > 0
    );
  };

  const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const getRefreshedOutfit = (outfit) => {
    if (!outfit) return null;
    return {
      ...outfit,
      top:    outfit.top    ? items.find((i) => i._id === outfit.top._id)    || outfit.top    : null,
      bottom: outfit.bottom ? items.find((i) => i._id === outfit.bottom._id) || outfit.bottom : null,
      shoes:  outfit.shoes  ? items.find((i) => i._id === outfit.shoes._id)  || outfit.shoes  : null,
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

    animateBtn();
    setGenerating(true);
    setIsSaved(false);
    setCurrentOutfit(null);

    try {
      const outfit = await generateOutfit();
      setCurrentOutfit(outfit);
    } catch (_) {
      const tops    = items.filter((i) => i.type === 'top' || i.type === 'sweater');
      const bottoms = items.filter((i) => i.type === 'bottom');
      const shoes   = items.filter((i) => i.type === 'shoes');
      setCurrentOutfit({
        top:    pickRandom(tops),
        bottom: pickRandom(bottoms),
        shoes:  pickRandom(shoes),
      });
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
        {/* Generated outfit card */}
        <View style={styles.outfitGeneratedCard}>
          {generating ? (
            <>
              <Text style={styles.outfitGeneratedTitle}>Finding your outfit…</Text>
              <View style={styles.outfitSlots}>
                <SkeletonSlot />
                <SkeletonSlot />
                <SkeletonSlot />
              </View>
            </>
          ) : currentOutfit ? (
            <View>
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
                  <Ionicons
                    name={isSaved ? 'checkmark' : 'bookmark-outline'}
                    size={16}
                    color={COLORS.white}
                  />
                  <Text style={styles.outfitActionTextPrimary}>
                    {isSaved ? 'Saved' : 'Save outfit'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.outfitActionSecondary}
                  onPress={handleGenerate}
                >
                  <Ionicons name="refresh-outline" size={16} color={COLORS.black} />
                  <Text style={styles.outfitActionTextSecondary}>Regenerate</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.outfitEmptyWrap}>
              <View style={styles.outfitEmptySlots}>
                {['Top', 'Bottom', 'Shoes'].map((l) => (
                  <View key={l} style={styles.outfitEmptySlot}>
                    <Ionicons name="shirt-outline" size={22} color={COLORS.gray100} />
                  </View>
                ))}
              </View>
              <Text style={styles.outfitEmptyText}>
                Tap below to generate your first outfit
              </Text>
            </View>
          )}
        </View>

        {/* Generate button with press animation */}
        <Animated.View style={{ transform: [{ scale: btnScale }] }}>
          <TouchableOpacity
            style={[styles.generateBtn, generating && styles.generateBtnDisabled]}
            onPress={handleGenerate}
            disabled={generating}
            activeOpacity={0.85}
          >
            <Ionicons name="sparkles-outline" size={18} color={COLORS.white} />
            <Text style={styles.generateBtnText}>Generate outfit</Text>
          </TouchableOpacity>
        </Animated.View>

        {!hasEnoughItems() && (
          <Text style={styles.generateHintText}>
            Add at least 1 top, 1 bottom, and 1 pair of shoes to get started.
          </Text>
        )}

        {/* Saved outfits */}
        {savedOutfits.length > 0 && (
          <View style={styles.savedSection}>
            <Text style={styles.savedSectionTitle}>Saved outfits</Text>
            {savedOutfits.map((outfit) => (
              <View key={outfit.id}>
                <OutfitCard
                  outfit={getRefreshedOutfit(outfit)}
                  onDelete={removeSavedOutfit}
                />
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}