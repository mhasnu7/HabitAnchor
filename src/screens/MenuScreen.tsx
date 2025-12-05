import React, { useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import { useAdsContext } from '../context/AdsContext';
import { styles } from '../styles/MenuScreenStyles';
import SettingItem from '../components/SettingItem';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

type RootStackParamList = {
  Home: undefined;
  Menu: undefined;
  Settings: undefined;
  HabitDetails: undefined;
  EditHabitsList: undefined;
  PrivacyPolicy: undefined;
  TermsOfUse: undefined;
  HowToUse: undefined;
};

type MenuScreenProps = NativeStackScreenProps<RootStackParamList, 'Menu'>;

const MenuScreen = ({ navigation }: MenuScreenProps) => {
  const { theme } = useTheme();
  const { adsRemoved } = useAdsContext();

  const handlePurchase = useCallback(() => {
    Alert.alert('Coming Soon', 'In-app purchases are temporarily disabled.');
  }, []);

  const handleRestore = useCallback(() => {
    Alert.alert('Coming Soon', 'Purchase restoration is temporarily disabled.');
  }, []);

  const handleRateApp = useCallback(() => {
    console.log('Rate this app pressed');
  }, []);

  const menuItems = [
    { icon: 'cog', bg: '#007AFF', title: 'Settings', nav: 'Settings' },
    { icon: 'pencil', bg: '#FF9500', title: 'Edit Habits', nav: 'EditHabitsList' },
    { icon: 'help-circle', bg: '#2196F3', title: 'How to Use', nav: 'HowToUse' },
    { icon: 'crown', bg: '#FFD60A', title: 'Remove Ads', action: handlePurchase },
    { icon: 'restore', bg: '#007AFF', title: 'Restore Purchases', action: handleRestore },
    { header: 'About' },
    { icon: 'lock', bg: '#FF2D55', title: 'Privacy Policy', nav: 'PrivacyPolicy' },
    { icon: 'file-document', bg: '#FF9500', title: 'Terms of Use', nav: 'TermsOfUse' },
    { icon: 'star', bg: '#FFD60A', title: 'Rate the app', action: handleRateApp },
    { icon: 'home', bg: '#22c55e', title: 'Home', nav: 'Home' },
  ];

  const translateY = menuItems.map(() => useSharedValue(-60));
  const rotateX = menuItems.map(() => useSharedValue(45));
  const opacity = menuItems.map(() => useSharedValue(0));

  useEffect(() => {
    menuItems.forEach((_, index) => {
      translateY[index].value = withDelay(
        index * 120,
        withTiming(0, {
          duration: 600,
          easing: Easing.out(Easing.elastic(1.2)),
        })
      );

      rotateX[index].value = withDelay(
        index * 120,
        withTiming(0, {
          duration: 700,
          easing: Easing.out(Easing.elastic(1.3)),
        })
      );

      opacity[index].value = withDelay(
        index * 120,
        withTiming(1, {
          duration: 300,
          easing: Easing.out(Easing.cubic),
        })
      );
    });
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={theme.text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: '#007AFF' }]}>Menu</Text>

        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {menuItems.map((item, index) => {
          const animatedStyle = useAnimatedStyle(() => ({
            opacity: opacity[index].value,
            transform: [
              { translateY: translateY[index].value },
              { rotateX: `${rotateX[index].value}deg` },
              { perspective: 800 },
            ],
          }));

          if (item.header) {
            return (
              <Animated.View key={`header-${index}`} style={[animatedStyle, { marginTop: 20 }]}>
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionHeaderText, { color: theme.subtleText }]}>
                    {item.header}
                  </Text>
                </View>
              </Animated.View>
            );
          }

          return (
            <Animated.View key={index} style={[animatedStyle]}>
              <SettingItem
                icon={item.icon}
                iconBackgroundColor={item.bg}
                title={item.title}
                onPress={() =>
                  item.nav
                    ? navigation.navigate(item.nav as never)
                    : item.action?.()
                }
              />
            </Animated.View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default MenuScreen;
