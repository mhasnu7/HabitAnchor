import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import { RootStackParamList } from '../../App';

type ColorPickerScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ColorPicker'>;
type ColorPickerScreenRouteProp = RouteProp<RootStackParamList, 'ColorPicker'>;

const allColors = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981',
  '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7',
  '#d946ef', '#ec4899', '#f43f5e',
  '#FF6347', '#FFD700', '#ADFF2F', '#7FFFD4', '#40E0D0', '#6495ED', '#DA70D6',
  '#FF69B4', '#CD5C5C', '#F08080', '#FFA07A', '#FFDAB9', '#EEE8AA', '#98FB98',
  '#8FBC8F', '#B0E0E6', '#ADD8E6', '#87CEFA', '#6A5ACD', '#9370DB', '#BA55D3',
  '#FF00FF', '#C71585', '#FF1493', '#FF4500', '#FF8C00', '#FFD700', '#ADFF2F',
  '#7FFF00', '#3CB371', '#20B2AA', '#00CED1', '#1E90FF', '#4169E1', '#8A2BE2',
  '#9400D3', '#FF00FF', '#FF69B4', '#FFC0CB', '#DC143C',
  '#FF5733', '#C70039', '#900C3F', '#581845', '#FFC300', '#FF5733', '#DAF7A6',
  '#33FF57', '#33FFC7', '#33C7FF', '#3357FF', '#5733FF', '#C733FF', '#FF33C7',
  '#FF3357', '#FF3333', '#FF8333', '#FFC733', '#C7FF33', '#83FF33', '#33FF33',
  '#33FF83', '#33FFC7', '#33C7FF', '#3383FF', '#3333FF', '#8333FF', '#C733FF',
  '#FF33C7', '#FF3383', '#FF3333',
].filter((value, index, self) => self.indexOf(value) === index); // Filter out duplicates

const ColorPickerScreen = () => {
  const navigation = useNavigation<ColorPickerScreenNavigationProp>();
  const route = useRoute<ColorPickerScreenRouteProp>();
  const { theme } = useTheme();

  const handleSelectColor = (color: string) => {
    route.params.onSelectColor(color);
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Select Color</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.colorGrid}>
        {allColors.map(color => (
          <TouchableOpacity
            key={color}
            style={[styles.colorCircle, { backgroundColor: color }]}
            onPress={() => handleSelectColor(color)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  colorCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
});

export default ColorPickerScreen;