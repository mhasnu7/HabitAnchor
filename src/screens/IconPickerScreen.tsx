import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

// ---- Curated Habit Icons ----
const HABIT_ICONS = Array.from(
  new Set([
    // Fitness
    'run', 'walk', 'dumbbell', 'bike', 'yoga', 'meditation',
    'football', 'basketball', 'tennis', 'swim', 'shoe-sneaker',

    // Health
    'water', 'cup-water', 'food-apple', 'fruit-cherries', 'pill',
    'heart-pulse', 'toothbrush-paste',

    // Sleep
    'power-sleep', 'sleep', 'weather-night', 'white-balance-sunny',

    // Study
    'book-open-variant', 'book-outline', 'notebook',
    'notebook-edit-outline', 'school', 'laptop',

    // Productivity
    'calendar-check', 'clipboard-check-outline', 'check-circle-outline',
    'alarm-check', 'timer-outline', 'briefcase-outline',

    // Finance
    'cash-multiple', 'piggy-bank', 'wallet-outline', 'chart-line',

    // Home & chores
    'home-outline', 'broom', 'washing-machine', 'trash-can-outline',
    'leaf', 'sprout', 'recycle-variant',

    // Creativity & hobbies
    'palette-outline', 'pencil-outline', 'guitar-acoustic', 'music-note',
    'camera-outline', 'movie-open-outline', 'gamepad-variant-outline',

    // Social
    'account-heart-outline', 'account-group-outline',
    'message-text-outline', 'phone-outline',

    // Journaling
    'notebook-heart', 'pen', 'feather',
  ])
);

// ---- Expanded Emoji Set (Smileys + People + Gestures + Misc) ----
const EMOJI_ICONS = [
  // Smileys
  '😀','😁','😂','🤣','😃','😄','😅','😆','😉','😊','😎','🤩','😍','🥰','😘',
  '🙂','🤗','🤔','😐','😑','😶','🙄','😏','😣','😥','😮','😯','😪','🥱','😴',
  '😛','😜','😝','🤤','😒','😓','😔','😕','🙃','😖','😢','😭','😤','😠','😡',
  '🤯','😳','🥵','🥶','😱','😰','🤒','🤕',

  // Gestures
  '👍','👎','👌','✌️','🤞','🤟','🤘','🤙','👋','👏','👐','🙏',

  // People
  '👨','👩','🧑','👧','👦','👶','🧓','👴','👵','🧔',
  '👩‍🎓','👨‍💻','🧑‍🏫','🧑‍🍳','🧑‍🎨','🧑‍🚀','🧑‍🚒',

  // Activities
  '⚽','🏀','🏈','🎾','🏐','🏉','🎳','🏓','🥋','🎯','🎮','🎲','🎻','🎸',

  // Food
  '🍎','🍌','🍊','🍉','🍇','🍓','🍒','🥭','🍍','🥝','🥑','🍔','🍕','🍟','🍜',

  // Nature
  '🌞','🌙','⭐','🌟','🔥','🌈','❄️','☔','🌧️','🍀','🌿','🌱','🌸',

  // Animals
  '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮',

  // Objects
  '💡','📘','📚','✏️','🖊️','💻','🖥️','📱','🎧','🕒',

  // Symbols
  '❤️','🧡','💛','💚','💙','💜','🖤','🤍','✨','⭐','💫','🔥',
];

type IconPickerRouteParams = {
  onSelectIcon?: (icon: string) => void;
};

type IconPickerRouteProp = RouteProp<
  { IconPicker: IconPickerRouteParams },
  'IconPicker'
>;

const IconPickerScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<IconPickerRouteProp>();
  const { theme } = useTheme();

  const onSelectIcon = route.params?.onSelectIcon;

  const handleSelect = (iconName: string) => {
    if (onSelectIcon) onSelectIcon(iconName);
    navigation.goBack();
  };

  const renderHabitIcon = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[styles.iconButton, { backgroundColor: theme.cardBackground }]}
      onPress={() => handleSelect(item)}
    >
      <Icon name={item} size={26} color={theme.text} />
    </TouchableOpacity>
  );

  const renderEmoji = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[styles.iconButton, { backgroundColor: theme.cardBackground }]}
      onPress={() => handleSelect(item)}
    >
      <Text style={{ fontSize: 28 }}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      
      {/* Top Bar with Back Button */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={26} color={theme.text} />
        </TouchableOpacity>

        <Text style={[styles.title, { color: theme.text }]}>
          Select an Icon
        </Text>

        {/* Spacer to balance layout */}
        <View style={{ width: 26 }} />
      </View>

      {/* Habit Icon Section */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Habit Icons
      </Text>
      <FlatList
        data={HABIT_ICONS}
        keyExtractor={(item) => item}
        numColumns={6}
        contentContainerStyle={styles.listContent}
        renderItem={renderHabitIcon}
      />

      {/* Emoji Section */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Emojis
      </Text>
      <FlatList
        data={EMOJI_ICONS}
        keyExtractor={(_, i) => 'emoji-' + i}
        numColumns={6}
        contentContainerStyle={styles.listContent}
        renderItem={renderEmoji}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },

  topBar: {
    paddingTop: 48,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title: {
    fontSize: 20,
    fontWeight: '600',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 8,
  },

  listContent: {
    paddingBottom: 16,
  },

  iconButton: {
    width: 52,
    height: 52,
    borderRadius: 14,
    margin: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default IconPickerScreen;
