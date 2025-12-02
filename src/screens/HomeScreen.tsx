import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useHabitStore } from '../store/habits';
import HabitCard from '../components/HabitCard';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import { Alert } from 'react-native';
import React, { useState, useRef, useCallback } from 'react';
import ThanosSnapAnimation from '../components/ThanosSnapAnimation';

// ✅ Add Emoji detection (required for screens that may use emojis later)
const isEmoji = (str: string) => /\p{Emoji}/u.test(str);

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
  const { habits, showAnalytics, archiveHabit } = useHabitStore();
  const { theme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);
  const [isNavBarVisible, setIsNavBarVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollTimeoutRef = useRef<number | null>(null);

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
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const scrollDirection = currentScrollY > lastScrollY.current ? 'down' : 'up';
    const scrollSpeedThreshold = 10;
    const scrollStopTimeout = 500;

    if (currentScrollY > 0) {
      if (scrollDirection === 'down' && currentScrollY > lastScrollY.current + scrollSpeedThreshold && isNavBarVisible) {
        setIsNavBarVisible(false);
      } else if (scrollDirection === 'up' && currentScrollY < lastScrollY.current - scrollSpeedThreshold && !isNavBarVisible) {
        setIsNavBarVisible(true);
      }
    } else {
      if (!isNavBarVisible) {
        setIsNavBarVisible(true);
      }
    }

    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      setIsNavBarVisible(true);
    }, scrollStopTimeout);

    lastScrollY.current = currentScrollY;
  }, [isNavBarVisible]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
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
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
              <Icon name="menu" size={24} color={theme.text} />
            </TouchableOpacity>

            <Image
              source={require('../../assets/logo/Newlogo1.png')}
              style={[styles.logo, { backgroundColor: 'transparent' }]}
            />

            <View style={styles.headerRight} />
          </View>

          {habits.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <Text style={[styles.emptyStateText, { color: theme.text }]}>
                Click + button to add habit
              </Text>
            </View>
          ) : (
            <ScrollView
              style={styles.scrollView}
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

          {isNavBarVisible && (
            <View style={styles.bottomNavBarContainer}>
              <View style={[styles.bottomNavBar, { backgroundColor: theme.cardBackground, shadowColor: theme.background }]}>

                {/* bottom nav icons are not emojis, so no change needed here */}
                <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('HabitInsights')}>
                  <Icon name="chart-bar" size={24} color={'#8a2be2'} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('AddHabit')}>
                  <Icon name="plus-circle" size={24} color={'green'} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('HabitDetails')}>
                  <Icon name="format-list-bulleted" size={24} color={theme.subtleText} />
                </TouchableOpacity>

              </View>
            </View>
          )}
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
    marginTop: -35,
    marginBottom: -70,
  },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingRight: 10 },
  scrollView: { paddingHorizontal: 16 },
  emptyStateContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  emptyStateText: { fontSize: 18, textAlign: 'center' },
  bottomNavBarContainer: { position: 'absolute', bottom: 30, left: 0, right: 0, alignItems: 'center' },
  bottomNavBar: {
    flexDirection: 'row',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 5,
    justifyContent: 'space-around',
    width: '80%',
  },
  navButton: { padding: 8 },
  logo: { width: 250, height: 220, resizeMode: 'contain' },
});

export default HomeScreen;
