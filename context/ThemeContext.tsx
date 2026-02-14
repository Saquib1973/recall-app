// context/ThemeContext.tsx
import { colors } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: 'light' | 'dark';
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  colors: typeof colors.light & typeof colors; // Combine types
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useSystemColorScheme();
  const [mode, setMode] = useState<ThemeMode>('system');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const storedMode = await AsyncStorage.getItem('themeMode');
      if (storedMode) setMode(storedMode as ThemeMode);
    } catch (e) {
      console.log('Failed to load theme', e);
    }
  };

  const updateMode = async (newMode: ThemeMode) => {
    setMode(newMode);
    await AsyncStorage.setItem('themeMode', newMode);
  };

  // Determine the active theme string
  const activeTheme = mode === 'system' ? (systemScheme || 'light') : mode;

  // Merge the base palette (primary, etc) with the active theme colors (bg, text)
  const activeColors = {
    ...colors, // shared colors
    ...colors[activeTheme], // light or dark specific overrides
  };

  return (
    <ThemeContext.Provider value={{
      theme: activeTheme,
      mode,
      setMode: updateMode,
      colors: activeColors
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};