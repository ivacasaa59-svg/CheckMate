import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const formatDisplayDate = (date) => {
  const dayPart = date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
  const timePart = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });
  return `${dayPart} · ${timePart}`;
};

export default function DatePickerField({ value, onChange }) {
  const { theme, isDark } = useTheme();

  const [tempDate, setTempDate] = useState(value);
  const [showModal, setShowModal] = useState(false);

  const [androidMode, setAndroidMode] = useState('date');
  const [showAndroid, setShowAndroid] = useState(false);

  const openPicker = () => {
    setTempDate(value);
    if (Platform.OS === 'ios') {
      setShowModal(true);
    } else {
      setAndroidMode('date');
      setShowAndroid(true);
    }
  };

  const handleIOSChange = (_event, date) => {
    if (date) setTempDate(date);
  };

  const confirmIOS = () => {
    onChange(tempDate);
    setShowModal(false);
  };

  const cancelIOS = () => setShowModal(false);

  const handleAndroidChange = (event, date) => {
    setShowAndroid(false);
    if (event.type === 'dismissed' || !date) return;

    const updated = new Date(value);
    if (androidMode === 'date') {
      updated.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
      onChange(updated);
      setAndroidMode('time');
      setShowAndroid(true);
    } else {
      updated.setHours(date.getHours(), date.getMinutes());
      onChange(updated);
      setAndroidMode('date');
    }
  };

  const s = makeStyles(theme, isDark);

  return (
    <>
      {/* Botón que muestra la fecha */}
      <Pressable
        style={({ pressed }) => [s.dateButton, pressed && s.dateButtonPressed]}
        onPress={openPicker}
        accessibilityLabel="Seleccionar fecha y hora"
        accessibilityRole="button"
      >
        <Ionicons name="calendar" size={20} color={theme.accent} style={s.icon} />
        <Text style={s.dateText}>{formatDisplayDate(value)}</Text>
        <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
      </Pressable>

      {/* Modal iOS */}
      {Platform.OS === 'ios' && (
        <Modal
          visible={showModal}
          transparent
          animationType="slide"
          onRequestClose={cancelIOS}
        >
          <Pressable style={s.overlay} onPress={cancelIOS} />
          <View style={s.sheet}>
            <View style={s.toolbar}>
              <Pressable onPress={cancelIOS} style={s.toolbarBtn}>
                <Text style={s.cancelText}>Cancelar</Text>
              </Pressable>
              <Text style={s.toolbarTitle}>Fecha y hora</Text>
              <Pressable onPress={confirmIOS} style={s.toolbarBtn}>
                <Text style={s.confirmText}>Listo</Text>
              </Pressable>
            </View>
            <DateTimePicker
              value={tempDate}
              mode="datetime"
              display="spinner"
              onChange={handleIOSChange}
              locale="es-ES"
              style={s.picker}
              themeVariant={isDark ? "dark" : "light"}
            />
          </View>
        </Modal>
      )}

      {/* Dialog nativo Android */}
      {Platform.OS === 'android' && showAndroid && (
        <DateTimePicker
          value={value}
          mode={androidMode}
          display="default"
          onChange={handleAndroidChange}
        />
      )}
    </>
  );
}

const makeStyles = (t, isDark) =>
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
    // Modal iOS
    overlay: {
      flex: 1,
      backgroundColor: isDark ? 'rgba(0,0,0,0.65)' : 'rgba(0,0,0,0.4)',
    },
    sheet: {
      backgroundColor: t.bgCard,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingBottom: 40,
      borderTopWidth: 1,
      borderColor: t.border,
    },
    toolbar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: t.border,
    },
    toolbarTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: t.textPrimary,
    },
    toolbarBtn: {
      paddingVertical: 4,
      paddingHorizontal: 4,
      minWidth: 64,
    },
    cancelText: {
      fontSize: 15,
      color: t.textSecondary,
      fontWeight: '500',
    },
    confirmText: {
      fontSize: 15,
      color: t.accent,
      fontWeight: '700',
      textAlign: 'right',
    },
    picker: {
      width: '100%',
    },
  });
