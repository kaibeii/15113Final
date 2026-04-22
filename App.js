import React, { useCallback } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import { WardrobeProvider } from './context/WardrobeContext';
import WardrobeScreen from './screens/WardrobeScreen';
import CameraScreen from './screens/CameraScreen';
import OutfitsScreen from './screens/OutfitsScreen';
import { COLORS, SPACING } from './constants/theme';
import styles from './styles/index';

SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();

function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const isCamera = route.name === 'Camera';

        const onPress = () => {
          if (isCamera && isFocused) {
            navigation.navigate('Wardrobe');
            return;
          }
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
  const [fontsLoaded] = useFonts({
    'Inter-Light':    require('./assets/fonts/Inter-Light.ttf'),
    'Inter-Regular':  require('./assets/fonts/Inter-Regular.ttf'),
    'Inter-Medium':   require('./assets/fonts/Inter-Medium.ttf'),
    'OffBit-DotBold': require('./assets/fonts/OffBit-DotBold.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
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