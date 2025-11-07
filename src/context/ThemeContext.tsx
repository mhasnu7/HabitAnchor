import React, { createContext, useState, useContext, ReactNode } from 'react';
import { DARK_THEME, LIGHT_THEME, Theme } from '../theme/constants';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (themeName: 'dark' | 'light') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(DARK_THEME);

  const toggleTheme = () => {
    setCurrentTheme((prevTheme) => (prevTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME));
  };

  const setTheme = (themeName: 'dark' | 'light') => {
    setCurrentTheme(themeName === 'dark' ? DARK_THEME : LIGHT_THEME);
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