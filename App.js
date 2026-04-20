import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { WardrobeProvider } from './context/WardrobeContext';
import WardrobeScreen from './screens/WardrobeScreen';
import CameraScreen from './screens/CameraScreen';
import OutfitsScreen from './screens/OutfitsScreen';
import { COLORS, RADIUS, SPACING } from './constants/theme';

const Tab = createBottomTabNavigator();

function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const isCamera = route.name === 'Camera';

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
        };

        if (isCamera) {
          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.plusWrap}
              activeOpacity={0.85}
            >
              <View style={[styles.plusBtn, isFocused && styles.plusBtnActive]}>
                <Ionicons
                  name={isFocused ? 'close' : 'add'}
                  size={28}
                  color={COLORS.white}
                />
              </View>
            </TouchableOpacity>
          );
        }

        const iconName = route.name === 'Wardrobe'
          ? isFocused ? 'grid' : 'grid-outline'
          : isFocused ? 'shirt' : 'shirt-outline';

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabItem}
            activeOpacity={0.7}
          >
            <Ionicons
              name={iconName}
              size={22}
              color={isFocused ? COLORS.purple600 : COLORS.gray400}
            />
            <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <WardrobeProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{ headerShown: false }}
          >
            <Tab.Screen name="Wardrobe" component={WardrobeScreen} />
            <Tab.Screen name="Camera"   component={CameraScreen} />
            <Tab.Screen name="Outfits"  component={OutfitsScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </WardrobeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: COLORS.white,
    borderTopWidth: 0.5,
    borderTopColor: '#E5E5E0',
    paddingBottom: SPACING.sm,
    paddingTop: SPACING.xs,
    paddingHorizontal: SPACING.sm,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    paddingVertical: SPACING.xs,
  },
  tabLabel: {
    fontSize: 10,
    color: COLORS.gray400,
    fontWeight: '400',
  },
  tabLabelActive: {
    color: COLORS.purple600,
    fontWeight: '500',
  },
  plusWrap: {
    flex: 0.8,
    alignItems: 'center',
    paddingBottom: SPACING.sm,
  },
  plusBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.purple600,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
    // Lift it above the tab bar
    marginTop: -20,
    shadowColor: COLORS.purple600,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  plusBtnActive: {
    backgroundColor: COLORS.purple800,
  },
});
