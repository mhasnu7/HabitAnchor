import React, { createContext, useState, useContext, ReactNode } from 'react';
import { darkTheme, lightTheme, Theme } from '../styles/themes';

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
  const [currentTheme, setCurrentTheme] = useState<Theme>(darkTheme);

  const toggleTheme = () => {
    setCurrentTheme((prevTheme) => (prevTheme === darkTheme ? lightTheme : darkTheme));
  };

  const setTheme = (themeName: 'dark' | 'light') => {
    setCurrentTheme(themeName === 'dark' ? darkTheme : lightTheme);
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