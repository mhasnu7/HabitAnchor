export const COLORS = {
  deepNavy: '#0B0C10',
  electricBlue: '#007AFF',
  coralRed: '#FF6B6B',
  limeGreen: '#A3FF00',
  skyCyan: '#00E0FF',
  white: '#FFFFFF',
  white90: 'rgba(255, 255, 255, 0.9)',
};

export const FONTS = {
  heading: 'Poppins-SemiBold',
  body: 'Inter-Regular',
};

export const SIZES = {
  small: 8,
  medium: 16,
  large: 24,
  icon: 24,
  borderRadius: 10,
  circularBox: 48, // For habit grid items
};

export const DARK_THEME = {
  background: COLORS.deepNavy,
  primary: COLORS.electricBlue,
  secondary: COLORS.coralRed,
  accentGreen: COLORS.limeGreen,
  accentCyan: COLORS.skyCyan,
  text: COLORS.white,
  subtleText: COLORS.white90,
  cardBackground: '#1A1A1A', // A slightly lighter dark for cards
};

export const LIGHT_THEME = {
  background: COLORS.white,
  primary: COLORS.electricBlue,
  secondary: COLORS.coralRed,
  accentGreen: COLORS.limeGreen,
  accentCyan: COLORS.skyCyan,
  text: COLORS.deepNavy,
  subtleText: 'rgba(11, 12, 16, 0.7)', // Deep navy with 70% opacity for subtle text in light mode
  cardBackground: '#F2F2F7', // A slightly darker light for cards
};

export type Theme = typeof DARK_THEME;