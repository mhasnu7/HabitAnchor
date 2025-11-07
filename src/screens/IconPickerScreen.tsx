import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
  SectionList,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  AddHabit: { selectedIcon: string } | undefined;
  IconPicker: { onSelectIcon: (icon: string) => void };
};

type IconPickerScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'IconPicker'
>;
type IconPickerScreenRouteProp = RouteProp<RootStackParamList, 'IconPicker'>;

interface IconCategory {
  title: string;
  icons: string[];
}

const allIcons: IconCategory[] = [
  {
    title: 'Habits',
    icons: [
      // Fitness/Movement
      'run', 'walk', 'dumbbell', 'bike', 'yoga', 'swim', 'meditation',
      // Food/Drink
      'coffee', 'tea', 'food-apple', 'water', 'cup', 'glass-cocktail',
      // Hobbies/Creative
      'brush', 'palette', 'music', 'book', 'pencil', 'camera', 'movie', 'pottery', 'gamepad-variant',
      // Daily/Misc
      'car-side', 'briefcase', 'home', 'sleep', 'weather-sunny', 'weather-night', 'tools', 'leaf', 'heart',
      // Adventure/Sports
      'hiking', 'tent', 'football', 'basketball', 'tennis',
    ],
  },
];

// No need for duplicate filtering as the list is manually curated


const IconPickerScreen = () => {
  const navigation = useNavigation<IconPickerScreenNavigationProp>();
  const route = useRoute<IconPickerScreenRouteProp>();
  const { onSelectIcon } = route.params;

  const [searchQuery, setSearchQuery] = useState('');
  const filteredIcons = allIcons
    .map(category => ({
      ...category,
      icons: category.icons.filter(iconName =>
        iconName.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter(category => category.icons.length > 0);

  const renderListHeader = () => (
    <View>
      <TextInput
        style={styles.searchInput}
        placeholder="Type a search term"
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
    </View>
  );

  const handleSelect = (item: string) => {
    onSelectIcon(item);
    navigation.goBack();
  };

  const renderIconItem = ({ item }: { item: string }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => handleSelect(item)}>
      <Icon name={item} size={32} color="#fff" />
    </TouchableOpacity>
  );


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={{ width: 24 }} />
        </View>

        {filteredIcons.length > 0 ? (
          <SectionList
            sections={filteredIcons.map(category => ({
              title: category.title,
              data: category.icons,
            }))}
            renderItem={({ section }) => (
              <FlatList
                data={section.data}
                renderItem={renderIconItem}
                keyExtractor={(iconItem) => iconItem}
                numColumns={6}
                columnWrapperStyle={styles.row}
                scrollEnabled={false}
              />
            )}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.categoryTitle}>{title}</Text>
            )}
            keyExtractor={(item, index) => item + index}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={renderListHeader()}
            contentContainerStyle={styles.listContentContainer}
          />
        ) : (
          <View style={styles.noResultsContainer}>
            {renderListHeader()}
            <Text style={styles.noResultsText}>No icons found for "{searchQuery}".</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#111',
  },
  container: {
    flex: 1,
    backgroundColor: '#111',
    paddingHorizontal: 16, // Apply horizontal padding here
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 48, // Increased for better spacing
    paddingBottom: 16,
  },
  searchInput: {
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginTop: 16, // Added margin to bring it down
    marginBottom: 16,
  },
  listContentContainer: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  row: {
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  itemContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
    backgroundColor: '#222',
    borderRadius: 8,
  },
  // Removed category filter styles
  noResultsText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default IconPickerScreen;