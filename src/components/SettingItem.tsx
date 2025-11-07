import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../context/ThemeContext';

interface SettingItemProps {
  icon: string;
  iconBackgroundColor: string;
  title: string;
  onPress: () => void;
}

const SettingItem: React.FC<SettingItemProps> = ({ icon, iconBackgroundColor, title, onPress }) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity onPress={onPress} style={[styles.itemContainer, { backgroundColor: theme.cardBackground }]}>
      <View style={[styles.itemIconContainer, { backgroundColor: iconBackgroundColor }]}>
        {icon === 'wrench' ? ( // This condition is no longer needed as 'cog' is a MaterialCommunityIcons icon
          <Icon name="cog" size={20} color="#fff" />
        ) : (
          <Icon name={icon} size={20} color="#fff" />
        )}
      </View>
      <Text style={[styles.itemTitle, { color: theme.text }]}>{title}</Text>
      <Icon name="arrow-right" size={20} color={theme.text} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 16,
    marginBottom: 8,
  },
  itemIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  itemTitle: {
    fontSize: 17,
    flex: 1,
  },
  itemArrow: {
  },
});

export default SettingItem;