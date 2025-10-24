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
import Icon from 'react-native-vector-icons/Ionicons';
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
      'leaf', 'walk', 'water', 'bicycle', 'hammer', 'cloudy', 'sunny',
      'rainy', 'moon', 'earth', 'flame', 'fast-food', 'pizza', 'beer',
      'cafe', 'ice-cream', 'football', 'basketball', 'american-football',
      'car-sport', 'build', 'school', 'heart', 'star', 'paw', 'pencil',
      'musical-notes', 'camera', 'image', 'film', 'happy', 'sad', 'alarm',
      'time', 'mail', 'document', 'folder', 'trash', 'checkmark', 'close',
      'search', 'settings', 'information', 'help', 'warning', 'alert',
      'add', 'remove', 'arrow-up', 'arrow-down', 'arrow-back', 'arrow-forward',
      'home', 'bed', 'cart', 'boat', 'airplane', 'bus', 'train', 'subway',
      'walk', 'car', 'bicycle', 'fitness', 'barbell', 'tennisball', 'golf',
      'baseball', 'basketball', 'football', 'american-football', 'trophy',
      'medal', 'ribbon', 'sparkles', 'gift', 'wallet', 'cash', 'card',
      'pricetag', 'bookmark', 'flag', 'pin', 'location', 'map', 'navigate',
      'compass', 'globe', 'planet', 'cloud', 'thunderstorm', 'snow', 'partly-sunny',
      'contrast', 'color-palette', 'brush', 'cut', 'copy', 'attach', 'link',
      'share', 'send', 'chatbubbles', 'chatbox', 'call', 'videocam', 'mic',
      'volume-high', 'volume-low', 'volume-mute', 'notifications', 'notifications-off',
      'key', 'lock-closed', 'lock-open', 'eye', 'eye-off', 'person', 'people',
      'person-add', 'person-remove', 'body', 'accessibility', 'hand-right', 'hand-left',
      'finger-print', 'id-card', 'at', 'calendar', 'today', 'timer', 'stopwatch',
      'hourglass', 'watch', 'battery-full', 'battery-half', 'battery-dead', 'power',
      'reload', 'refresh', 'sync', 'cloud-upload', 'cloud-download', 'save', 'print',
      'qr-code', 'barcode', 'scan', 'wifi', 'bluetooth', 'data', 'cellular', 'globe',
      'language', 'translate', 'options', 'funnel', 'filter', 'funnel-outline', 'filter-outline',
      'grid', 'list', 'reorder-four', 'reorder-three', 'reorder-two', 'menu', 'ellipsis-horizontal',
      'ellipsis-vertical', 'add-circle', 'remove-circle', 'close-circle', 'checkmark-circle',
      'alert-circle', 'information-circle', 'help-circle', 'warning-circle', 'star-half',
      'heart-half', 'bookmark-outline', 'flag-outline', 'pin-outline', 'location-outline',
      'map-outline', 'navigate-outline', 'compass-outline', 'globe-outline', 'planet-outline',
      'cloud-outline', 'thunderstorm-outline', 'snow-outline', 'partly-sunny-outline',
      'contrast-outline', 'color-palette-outline', 'brush-outline', 'cut-outline', 'copy-outline',
      'attach-outline', 'link-outline', 'share-outline', 'send-outline', 'chatbubbles-outline',
      'chatbox-outline', 'call-outline', 'videocam-outline', 'mic-outline', 'volume-high-outline',
      'volume-low-outline', 'volume-mute-outline', 'notifications-outline', 'notifications-off-outline',
      'key-outline', 'lock-closed-outline', 'lock-open-outline', 'eye-outline', 'eye-off-outline',
      'person-outline', 'people-outline', 'person-add-outline', 'person-remove-outline', 'body-outline',
      'accessibility-outline', 'hand-right-outline', 'hand-left-outline', 'finger-print-outline',
      'id-card-outline', 'at-outline', 'calendar-outline', 'today-outline', 'timer-outline',
      'stopwatch-outline', 'hourglass-outline', 'watch-outline', 'battery-full-outline',
      'battery-half-outline', 'battery-dead-outline', 'power-outline', 'reload-outline',
      'refresh-outline', 'sync-outline', 'cloud-upload-outline', 'cloud-download-outline',
      'save-outline', 'print-outline', 'qr-code-outline', 'barcode-outline', 'scan-outline',
      'wifi-outline', 'bluetooth-outline', 'data-outline', 'cellular-outline', 'globe-outline',
      'language-outline', 'translate-outline', 'options-outline', 'funnel-outline', 'filter-outline',
      'grid-outline', 'list-outline', 'reorder-four-outline', 'reorder-three-outline',
      'reorder-two-outline', 'menu-outline', 'ellipsis-horizontal-outline', 'ellipsis-vertical-outline',
      'add-circle-outline', 'remove-circle-outline', 'close-circle-outline', 'checkmark-circle-outline',
      'alert-circle-outline', 'information-circle-outline', 'help-circle-outline', 'warning-circle-outline',
      'star-half-outline', 'heart-half-outline',
    ],
  },
  {
    title: 'Sports',
    icons: [
      'american-football', 'basketball', 'baseball', 'tennisball', 'golf', 'football',
      'barbell', 'bicycle', 'walk', 'run', 'swim', 'boat', 'fitness', 'heart',
      'medal', 'trophy', 'ribbon', 'sparkles',
    ],
  },
  {
    title: 'Food and Beverages',
    icons: [
      'fast-food', 'pizza', 'beer', 'cafe', 'ice-cream', 'nutrition', 'restaurant',
      'wine', 'water', 'egg', 'fish', 'meat', 'bread', 'pizza', 'cookie', 'cake',
      'cup', 'cafe', 'nutrition', 'restaurant', 'wine', 'water', 'egg', 'fish',
      'meat', 'bread', 'pizza', 'cookie', 'cake', 'cup', 'cafe',
    ],
  },
  {
    title: 'Art',
    icons: [
      'brush', 'color-palette', 'image', 'film', 'musical-notes', 'pencil', 'camera',
      'easel', 'mic', 'headset', 'volume-high', 'volume-low', 'volume-mute',
    ],
  },
  {
    title: 'Financial',
    icons: [
      'wallet', 'cash', 'card', 'pricetag', 'logo-bitcoin', 'logo-usd', 'logo-euro',
      'logo-yen', 'logo-pound', 'calculator', 'receipt', 'bar-chart', 'pie-chart',
      'trending-up', 'trending-down', 'analytics',
    ],
  },
  {
    title: 'Miscellaneous',
    icons: [
      'bug', 'build', 'cloud', 'desktop', 'globe', 'hammer', 'home', 'information',
      'key', 'leaf', 'lock-closed', 'lock-open', 'mail', 'map', 'moon', 'notifications',
      'paw', 'pencil', 'person', 'planet', 'power', 'print', 'qr-code', 'rainy',
      'refresh', 'reload', 'search', 'send', 'settings', 'share', 'star', 'sunny',
      'sync', 'time', 'timer', 'today', 'trash', 'walk', 'warning', 'water', 'wifi',
      'add', 'remove', 'close', 'checkmark', 'alert', 'help', 'arrow-up', 'arrow-down',
      'arrow-back', 'arrow-forward', 'ellipsis-horizontal', 'ellipsis-vertical',
      'add-circle', 'remove-circle', 'close-circle', 'checkmark-circle', 'alert-circle',
      'information-circle', 'help-circle', 'warning-circle', 'star-half', 'heart-half',
      'bookmark-outline', 'flag-outline', 'pin-outline', 'location-outline', 'map-outline',
      'navigate-outline', 'compass-outline', 'globe-outline', 'planet-outline', 'cloud-outline',
      'thunderstorm-outline', 'snow-outline', 'partly-sunny-outline', 'contrast-outline',
      'color-palette-outline', 'brush-outline', 'cut-outline', 'copy-outline', 'attach-outline',
      'link-outline', 'share-outline', 'send-outline', 'chatbubbles-outline', 'chatbox-outline',
      'call-outline', 'videocam-outline', 'mic-outline', 'volume-high-outline', 'volume-low-outline',
      'volume-mute-outline', 'notifications-outline', 'notifications-off-outline', 'key-outline',
      'lock-closed-outline', 'lock-open-outline', 'eye-outline', 'eye-off-outline', 'person-outline',
      'people-outline', 'person-add-outline', 'person-remove-outline', 'body-outline',
      'accessibility-outline', 'hand-right-outline', 'hand-left-outline', 'finger-print-outline',
      'id-card-outline', 'at-outline', 'calendar-outline', 'today-outline', 'timer-outline',
      'stopwatch-outline', 'hourglass-outline', 'watch-outline', 'battery-full-outline',
      'battery-half-outline', 'battery-dead-outline', 'power-outline', 'reload-outline',
      'refresh-outline', 'sync-outline', 'cloud-upload-outline', 'cloud-download-outline',
      'save-outline', 'print-outline', 'qr-code-outline', 'barcode-outline', 'scan-outline',
      'wifi-outline', 'bluetooth-outline', 'data-outline', 'cellular-outline', 'globe-outline',
      'language-outline', 'translate-outline', 'options-outline', 'funnel-outline', 'filter-outline',
      'grid-outline', 'list-outline', 'reorder-four-outline', 'reorder-three-outline',
      'reorder-two-outline', 'menu-outline', 'ellipsis-horizontal-outline', 'ellipsis-vertical-outline',
      'add-circle-outline', 'remove-circle-outline', 'close-circle-outline', 'checkmark-circle-outline',
      'alert-circle-outline', 'information-circle-outline', 'help-circle-outline', 'warning-circle-outline',
      'star-half-outline', 'heart-half-outline',
    ],
  },
];


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
            <Icon name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={{ width: 24 }} />
        </View>

        {filteredIcons.length > 0 ? (
          <SectionList
            sections={filteredIcons.map(category => ({
              title: category.title,
              data: category.icons,
            }))}
            renderItem={({ item, section, index }) => {
              if (index === 0) {
                return (
                  <FlatList
                    data={section.data}
                    renderItem={renderIconItem}
                    keyExtractor={(iconItem) => iconItem}
                    numColumns={6}
                    columnWrapperStyle={styles.row}
                    scrollEnabled={false}
                  />
                );
              }
              return null;
            }}
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
    paddingTop: 16, // Adjusted for SafeAreaView
    paddingBottom: 16,
  },
  searchInput: {
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
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