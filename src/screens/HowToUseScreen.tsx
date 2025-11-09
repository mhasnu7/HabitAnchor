import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Assuming this icon library is used

const HowToUseScreen = () => {
  const navigation = useNavigation();

  // Dark theme colors assumed for consistency
  const colors = {
    background: '#121212',
    textPrimary: '#FFFFFF',
    textSecondary: '#B0B0B0',
    cardBackground: '#1E1E1E',
    border: '#333333',
  };

  const renderSection = (title: string, content: React.ReactNode) => (
    <View key={title} style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.contentBlock}>{content}</View>
    </View>
  );

  const renderBulletList = (items: string[]) => (
    <View style={styles.bulletList}>
      {items.map((item, index) => (
        <View key={index} style={styles.bulletItem}>
          <Text style={styles.bulletMarker}>•</Text>
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );

  const howToUseContent = (
    <>
      {renderSection('🏠 Home Screen', renderBulletList([
        'Tap the **➕ (plus)** button at the bottom to add a new habit.',
        'Each habit shows its calendar progress.',
        'Tap the **✔️ button** to mark a day as completed.',
      ]))}

      {renderSection('📝 Add Habit Screen', renderBulletList([
        '1. **Enter Habit Name** – Name your habit (required).',
        '2. **Enter Habit Detail** – Describe what this habit is about.',
        '3. **Select Target Date (Optional)** – Pick a date to aim for completion.',
        '4. **Select Color** – Tap the color button to personalize your habit.',
        '5. **Choose Icon** – Select an icon that represents your habit.',
      ]))}

      {renderSection('⚙️ Settings', renderBulletList([
        'Go to **Settings → Theme** to change between light or dark mode.',
        'Use **Reminders** to set daily notifications for your habits.',
        '**Archived Habits** stores completed or old habits.',
      ]))}

      {renderSection('📅 Tracking Progress', renderBulletList([
        'Your habits are shown on a calendar.',
        'Tap any date to toggle completion.',
        'Consistency builds streaks and motivation!',
      ]))}
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>How to Use Anchor Habits</Text>
          {/* Placeholder for right icon if needed, otherwise keep empty for centering */}
          <View style={{ width: 24 }} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {howToUseContent}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 20, // Increased top padding within SafeAreaView for extra space from status bar
  },
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20, // Increased vertical padding for more space below status bar
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scrollViewContent: {
    padding: 16,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#444444',
    paddingBottom: 5,
  },
  contentBlock: {
    padding: 12,
    backgroundColor: '#1E1E1E', // Slightly lighter card background
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333333',
  },
  bulletList: {
    paddingLeft: 10,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bulletMarker: {
    fontSize: 20,
    color: '#FFFFFF',
    marginRight: 8,
    lineHeight: 24, // Adjust line height for better vertical alignment
  },
  bulletText: {
    flex: 1,
    fontSize: 16,
    color: '#B0B0B0',
  },
});

export default HowToUseScreen;