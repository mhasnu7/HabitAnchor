import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

interface HomeButtonProps {
  iconColor: string;
}

const HomeButton: React.FC<HomeButtonProps> = ({ iconColor }) => {
  const navigation = useNavigation();
  const { theme } = useTheme();

  const handleGoHome = () => {
    navigation.navigate('Home' as never); // Type assertion needed for generic navigation
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleGoHome}>
      <Icon name="home" size={28} color={iconColor} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
});

export default HomeButton;