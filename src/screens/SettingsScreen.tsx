import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import SettingItem from '../components/SettingItem';
import { styles } from '../styles/SettingsScreenStyles';
import { useTheme } from '../context/ThemeContext';
import { useAdsContext } from '../context/AdsContext';

type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  GeneralSettings: undefined;
  ThemeSelection: undefined;
  DailyCheckInReminder: undefined;
  ArchivedHabits: undefined;
  PrivacyPolicy: undefined;
  TermsOfUse: undefined;
};

type SettingsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Settings'
>;

const SettingsScreen = ({ navigation }: SettingsScreenProps) => {
  const { theme } = useTheme();
  const { adsRemoved } = useAdsContext();

  // TOTAL SETTINGS ITEMS YOU HAVE
  const items = [0, 1, 2, 3, 4];

  // Animated values for each row
  const animations = useRef(
    items.map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(-20),
    }))
  ).current;

  // Run animation when screen mounts
  useEffect(() => {
    const animationSequence = items.map((_, index) =>
      Animated.parallel([
        Animated.timing(animations[index].opacity, {
          toValue: 1,
          duration: 350,
          delay: index * 120,
          useNativeDriver: true,
        }),
        Animated.timing(animations[index].translateY, {
          toValue: 0,
          duration: 350,
          delay: index * 120,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
      ])
    );

    Animated.stagger(100, animationSequence).start();
  }, []);

  // Helper to wrap each item
  const animatedWrapper = (index: number, child: React.ReactNode) => (
    <Animated.View
      style={{
        opacity: animations[index].opacity,
        transform: [{ translateY: animations[index].translateY }],
      }}
    >
      {child}
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={theme.text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: '#22c55e' }]}>
          Settings
        </Text>

        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>

          {animatedWrapper(
            0,
            <SettingItem
              icon="theme-light-dark"
              iconBackgroundColor="#007AFF"
              title="Theme"
              onPress={() => navigation.navigate('ThemeSelection')}
            />
          )}

          {animatedWrapper(
            1,
            <SettingItem
              icon="cog"
              iconBackgroundColor="#8e8e93"
              title="General"
              onPress={() => navigation.navigate('GeneralSettings')}
            />
          )}

          {animatedWrapper(
            2,
            <SettingItem
              icon="archive"
              iconBackgroundColor="#5856D6"
              title="Archived Habits"
              onPress={() => navigation.navigate('ArchivedHabits')}
            />
          )}

          {animatedWrapper(
            3,
            <SettingItem
              icon="bell"
              iconBackgroundColor="#FF9500"
              title="Reminders"
              onPress={() => navigation.navigate('DailyCheckInReminder')}
            />
          )}

          {animatedWrapper(
            4,
            <SettingItem
              icon="home"
              iconBackgroundColor="#007AFF"
              title="Home"
              onPress={() => navigation.navigate('Home')}
            />
          )}

        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;
