import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const formatDisplayDate = (date) => {
  const dayPart = date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
  const timePart = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });
  return `${dayPart} · ${timePart}`;
};

const toDatetimeLocalValue = (date) => {
  const pad = (n) => String(n).padStart(2, '0');
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
};

export default function DatePickerField({ value, onChange }) {
  const { theme } = useTheme();
  const inputRef = useRef(null);

  const handlePress = () => {
    try {
      inputRef.current?.showPicker();
    } catch {
      // Fallback si showPicker no está soportado.
    }
  };

  const handleChange = (event) => {
    const parsed = new Date(event.target.value);
    if (!isNaN(parsed.getTime())) {
      onChange(parsed);
    }
  };

  const s = makeStyles(theme);

  return (
    <Pressable
      style={({ pressed }) => [s.dateButton, pressed && s.dateButtonPressed]}
      onPress={handlePress}
      accessibilityLabel="Seleccionar fecha y hora"
      accessibilityRole="button"
    >
      <Ionicons name="calendar" size={20} color={theme.accent} style={s.icon} />
      <Text style={s.dateText}>{formatDisplayDate(value)}</Text>
      <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />

      {/* Input invisible */}
      <input
        ref={inputRef}
        type="datetime-local"
        value={toDatetimeLocalValue(value)}
        onChange={handleChange}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          cursor: 'pointer',
          border: 'none',
          background: 'transparent',
          ...(!theme.dark && { colorScheme: 'light' }),
          ...(theme.dark && { colorScheme: 'dark' }), // Forzar al browser nativo
        }}
      />
    </Pressable>
  );
}

const makeStyles = (t) =>
  StyleSheet.create({
    dateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: t.inputBg,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: t.border,
      paddingHorizontal: 14,
      height: 54,
      overflow: 'hidden',
      cursor: 'pointer',
    },
    dateButtonPressed: {
      backgroundColor: t.inputFocusBg,
      borderColor: t.accent,
    },
    icon: {
      marginRight: 10,
    },
    dateText: {
      flex: 1,
      fontSize: 14,
      color: t.textPrimary,
      fontWeight: '500',
    },
  });
