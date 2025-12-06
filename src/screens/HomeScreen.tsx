import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useHabitStore } from '../store/habits';
import HabitCard from '../components/HabitCard';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import { Alert } from 'react-native';
import React, { useState, useRef, useCallback } from 'react';
import ThanosSnapAnimation from '../components/ThanosSnapAnimation';

// ⭐ Import Banner Ad Component
import BannerAdView from '../components/BannerAdView';

type RootStackParamList = {
  Home: undefined;
  AddHabit: undefined;
  HabitCalendar: undefined;
  HabitDetails: undefined;
  Menu: undefined;
  Settings: undefined;
  HabitInsights: undefined;
};

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const { habits, archiveHabit } = useHabitStore();
  const { theme } = useTheme();

  const [isAnimating, setIsAnimating] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);

  // 🔥 Animated navbar values
  const navbarTranslate = useRef(new Animated.Value(0)).current;
  const navbarOpacity = useRef(new Animated.Value(1)).current;

  const lastScrollY = useRef(0);

  const hideNavbar = () => {
    Animated.parallel([
      Animated.timing(navbarTranslate, {
        toValue: 100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(navbarOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const showNavbar = () => {
    Animated.parallel([
      Animated.timing(navbarTranslate, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(navbarOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentY = event.nativeEvent.contentOffset.y;

      if (currentY > lastScrollY.current + 12) hideNavbar();
      if (currentY < lastScrollY.current - 12) showNavbar();

      lastScrollY.current = currentY;
    },
    []
  );

  const handleDeleteHabit = (habitId: string) => {
    Alert.alert(
      'Archive Habit',
      'Are you sure you want to archive this habit? You can restore it later from settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Archive',
          onPress: () => {
            setHabitToDelete(habitId);
            setIsAnimating(true);
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>

      {/* ⭐ Remove Top Padding + Move Logo Up */}
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* SNAP ANIMATION */}
      {isAnimating && habitToDelete ? (
        <ThanosSnapAnimation
          isVisible={isAnimating}
          onAnimationEnd={() => {
            if (habitToDelete) {
              archiveHabit(habitToDelete);
              setIsAnimating(false);
              setHabitToDelete(null);
            }
          }}
        >
          <HabitCard
            habit={habits.find(h => h.id === habitToDelete)!}
            onPress={() => {}}
            onDelete={() => {}}
            showRestoreButton={false}
          />
        </ThanosSnapAnimation>
      ) : (
        <>
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
              <Icon name="menu" size={24} color={theme.text} />
            </TouchableOpacity>

            <Image
              source={require('../../assets/logo/Newlogo1.png')}
              style={styles.logo}
            />

            <View style={styles.headerRight} />
          </View>

          {/* HABIT LIST */}
          {habits.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <Text style={[styles.emptyStateText, { color: theme.text }]}>
                Click + button to add habit
              </Text>
            </View>
          ) : (
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={{ paddingBottom: 250 }}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              {habits.map(habit => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onPress={() => navigation.navigate('HabitDetails')}
                  onDelete={handleDeleteHabit}
                />
              ))}
            </ScrollView>
          )}

          {/* ⭐ BANNER AD */}
          <View style={styles.bannerContainer}>
            <BannerAdView />
          </View>

          {/* 🔥 NAVBAR */}
          <Animated.View
            style={[
              styles.bottomNavBarContainer,
              {
                opacity: navbarOpacity,
                transform: [{ translateY: navbarTranslate }],
              },
            ]}
          >
            <View
              style={[
                styles.bottomNavBar,
                {
                  backgroundColor: theme.cardBackground,
                  shadowColor: theme.background,
                },
              ]}
            >
              <TouchableOpacity
                style={styles.navButton}
                onPress={() => navigation.navigate('HabitInsights')}
              >
                <Icon name="chart-bar" size={24} color={'#8a2be2'} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navButton}
                onPress={() => navigation.navigate('AddHabit')}
              >
                <Icon name="plus-circle" size={24} color={'green'} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navButton}
                onPress={() => navigation.navigate('HabitDetails')}
              >
                <Icon name="format-list-bulleted" size={24} color={theme.subtleText} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: -20,     // 🔥 Moves logo upward cleanly
    marginBottom: -80,  // Reduces gap below logo
  },

  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 16 },

  scrollView: { paddingHorizontal: 16 },

  emptyStateContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  emptyStateText: { fontSize: 18, textAlign: 'center' },

  bannerContainer: {
    position: 'absolute',
    bottom: 110,
    width: '100%',
    alignItems: 'center',
  },

  bottomNavBarContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },

  bottomNavBar: {
    flexDirection: 'row',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 20,
    justifyContent: 'space-around',
    width: '80%',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 5,
  },

  navButton: { padding: 8 },

  logo: {
    width: 250,
    height: 200,  // slightly smaller + visually higher
    resizeMode: 'contain',
  },
});

export default HomeScreen;
