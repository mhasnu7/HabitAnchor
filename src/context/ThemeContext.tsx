import React, { createContext, useState, useContext, ReactNode } from 'react';
import { DARK_THEME, LIGHT_THEME, CREAM_THEME, Theme } from '../theme/constants';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (themeName: 'dark' | 'light' | 'cream') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(DARK_THEME);

  const toggleTheme = () => {
    setCurrentTheme((prevTheme) => {
      if (prevTheme === DARK_THEME) return LIGHT_THEME;
      if (prevTheme === LIGHT_THEME) return CREAM_THEME;
      return DARK_THEME;
    });
  };

  const setTheme = (themeName: 'dark' | 'light' | 'cream') => {
    if (themeName === 'dark') {
      setCurrentTheme(DARK_THEME);
    } else if (themeName === 'light') {
      setCurrentTheme(LIGHT_THEME);
    } else {
      setCurrentTheme(CREAM_THEME);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};