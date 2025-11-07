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
    title: 'Activities',
    icons: [
      'briefcase', 'headset', 'book', 'code', 'desktop', 'game-controller',
      'leaf', 'walk', 'water', 'bicycle', 'hammer', 'cloudy', 'weather-sunny',
      'weather-rainy', 'moon-waning-crescent', 'earth', 'fire', 'food-fork-drink', 'pizza', 'beer',
      'coffee', 'ice-cream', 'football', 'basketball', 'american-football',
      'car-sport', 'tools', 'school', 'heart', 'star', 'paw', 'pencil',
      'music', 'camera', 'image', 'movie', 'emoticon-happy', 'emoticon-sad', 'alarm',
      'clock', 'email', 'file-document', 'folder', 'trash-can', 'check', 'close',
      'magnify', 'cog', 'information', 'help-circle', 'alert', 'alert-circle',
      'plus', 'minus', 'arrow-up', 'arrow-down', 'arrow-left', 'arrow-right',
      'home', 'bed', 'cart', 'boat', 'airplane', 'bus', 'train', 'subway',
    ],
  },
  {
    title: 'Sports',
    icons: [
      'american-football', 'basketball', 'baseball', 'tennis', 'golf', 'soccer',
      'dumbbell', 'bike', 'walk', 'run', 'swim', 'rowing', 'fitness-center', 'heart-pulse',
      'medal', 'trophy', 'ribbon', 'sparkles',
    ],
  },
  {
    title: 'Food and Beverages',
    icons: [
      'fast-food', 'pizza', 'beer', 'coffee', 'ice-cream', 'nutrition', 'restaurant',
      'wine', 'water', 'egg', 'fish', 'meat', 'bread-slice', 'cookie', 'cake',
      'cup',
    ],
  },
  {
    title: 'Art',
    icons: [
      'brush', 'palette', 'image', 'movie', 'music', 'pencil', 'camera',
      'easel', 'microphone', 'headphones', 'volume-high', 'volume-low', 'volume-mute',
    ],
  },
  {
    title: 'Financial',
    icons: [
      'wallet', 'cash', 'credit-card', 'tag', 'bitcoin', 'currency-usd', 'currency-eur',
      'currency-jpy', 'currency-gbp', 'calculator', 'receipt', 'chart-bar', 'chart-pie',
      'trending-up', 'trending-down', 'chart-areaspline',
    ],
  },
  {
    title: 'Miscellaneous',
    icons: [
      'bug', 'tools', 'cloud', 'desktop-mac', 'globe-model', 'hammer', 'home', 'information',
      'key', 'leaf', 'lock', 'lock-open', 'email', 'map', 'moon-waning-crescent', 'bell',
      'paw', 'pencil', 'account', 'planet', 'power', 'printer', 'qrcode', 'weather-rainy',
      'refresh', 'reload', 'magnify', 'send', 'cog', 'share-variant', 'star', 'weather-sunny',
      'sync', 'clock', 'timer', 'calendar-today', 'trash-can', 'walk', 'alert', 'water', 'wifi',
      'plus-circle', 'minus-circle', 'close-circle', 'check-circle', 'alert-circle',
      'information-circle', 'help-circle', 'warning-circle', 'star-half-full', 'heart-half-full',
    ],
  },
];

// Filter out duplicate icons within each category and across categories
allIcons.forEach(category => {
  category.icons = category.icons.filter((value, index, self) => self.indexOf(value) === index);
});


const IconPickerScreen = () => {
  const navigation = useNavigation<IconPickerScreenNavigationProp>();
  const route = useRoute<IconPickerScreenRouteProp>();
  const { onSelectIcon } = route.params;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
 
  const filteredIcons = allIcons
    .map(category => ({
      ...category,
      icons: category.icons.filter(iconName =>
        iconName.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter(category => category.icons.length > 0)
    .filter(category => selectedCategory === 'All' || category.title === selectedCategory);

  const renderListHeader = () => (
    <View>
      <TextInput
        style={styles.searchInput}
        placeholder="Type a search term"
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryFilterContainer}>
        <TouchableOpacity
          style={[styles.categoryButton, selectedCategory === 'All' && styles.activeCategoryButton]}
          onPress={() => setSelectedCategory('All')}
        >
          <Text style={styles.categoryButtonText}>All</Text>
        </TouchableOpacity>
        {allIcons.map(category => (
          <TouchableOpacity
            key={category.title}
            style={[styles.categoryButton, selectedCategory === category.title && styles.activeCategoryButton]}
            onPress={() => setSelectedCategory(category.title)}
          >
            <Text style={styles.categoryButtonText}>{category.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
            <Text style={styles.noResultsText}>No icons found for "{searchQuery}" in "{selectedCategory}" category.</Text>
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
  categoryFilterContainer: {
    marginBottom: 16,
    // No horizontal padding here, as it's handled by the main container
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#222',
    marginRight: 8,
  },
  activeCategoryButton: {
    backgroundColor: '#8a2be2',
  },
  categoryButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  noResultsText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default IconPickerScreen;