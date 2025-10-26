import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
}

const SettingItem: React.FC<SettingItemProps> = ({ icon, title, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View>
        <Ionicons name={icon} size={24} color="black" />
        <Text>{title}</Text>
        <Ionicons name="chevron-forward" size={24} color="black" />
      </View>
    </TouchableOpacity>
  );
};

export default SettingItem;