import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = 'CHECKMATE_THEME';

// ── Paleta oscura ─────────────────────────────────────────────────────────────
export const darkPalette = {
  dark: true,
  bg: '#0F0F18',
  bgCard: '#1A1A28',
  bgCardAlt: '#252535',
  headerGradient: ['#1A1A2E', '#16213E', '#0F0F18'],
  accent: '#7C6EFA',
  accentSoft: '#7C6EFA22',
  accentBorder: '#7C6EFA55',
  accentGradient: ['#9B8FF5', '#7C6EFA', '#5A4EE8'],
  cyan: '#4ECDF5',
  cyanSoft: '#4ECDF511',
  cyanBorder: '#4ECDF533',
  textPrimary: '#E8E8F8',
  textSecondary: '#8888AA',
  textMuted: '#44445A',
  border: '#2A2A3E',
  borderLight: '#1E1E2E',
  inputBg: '#1A1A28',
  inputFocusBg: '#1E1A30',
  deleteBtn: '#1E1420',
  deleteBorder: '#2A1A2A',
  statCard: '#1E1E30',
  statCardAccent: '#2A2040',
  statCardBorder: '#2A2A40',
  progressBg: '#1E1E30',
  filterChip: '#1E1E30',
  filterChipBorder: '#2A2A40',
  emptyCircleColors: ['#1E1E30', '#252535'],
  priorityBar: {
    alta:  '#FF5E7A',
    media: '#FFC844',
    baja:  '#4ECDF5',
  },
};

// ── Paleta clara ──────────────────────────────────────────────────────────────
export const lightPalette = {
  dark: false,
  bg: '#F2F2FF',
  bgCard: '#FFFFFF',
  bgCardAlt: '#EDEDFF',
  headerGradient: ['#7C6EFA', '#6A5CE8', '#5A4EE8'],
  accent: '#7C6EFA',
  accentSoft: '#7C6EFA18',
  accentBorder: '#7C6EFA55',
  accentGradient: ['#9B8FF5', '#7C6EFA', '#5A4EE8'],
  cyan: '#009FC5',
  cyanSoft: '#009FC511',
  cyanBorder: '#009FC533',
  textPrimary: '#1A1030',
  textSecondary: '#5A4E8A',
  textMuted: '#9990C0',
  border: '#DDD8FF',
  borderLight: '#EAE8FF',
  inputBg: '#FFFFFF',
  inputFocusBg: '#F5F3FF',
  deleteBtn: '#FFF5F8',
  deleteBorder: '#FFD6E0',
  statCard: '#FFFFFF',
  statCardAccent: '#EDE8FF',
  statCardBorder: '#DDD8FF',
  progressBg: '#DDD8FF',
  filterChip: '#FFFFFF',
  filterChipBorder: '#DDD8FF',
  emptyCircleColors: ['#EDEDFF', '#E5E2FF'],
  priorityBar: {
    alta:  '#FF5E7A',
    media: '#E8A000',
    baja:  '#009FC5',
  },
};

// ── Contexto ──────────────────────────────────────────────────────────────────
const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((stored) => {
      if (stored !== null) setIsDark(stored === 'dark');
    });
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      // Disparar en background para no bloquear la actualización de UI
      setTimeout(() => {
        AsyncStorage.setItem(THEME_KEY, next ? 'dark' : 'light').catch(console.warn);
      }, 0);
      return next;
    });
  };

  const theme = isDark ? darkPalette : lightPalette;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
