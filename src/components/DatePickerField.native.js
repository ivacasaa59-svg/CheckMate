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

/**
 * Formatea un Date para mostrarlo en el botón.
 * @param {Date} date
 * @returns {string}
 */
const formatDisplayDate = (date) => {
  const dayPart = date.toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
  const timePart = date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  return `${dayPart} · ${timePart}`;
};

/**
 * Selector de fecha/hora para iOS y Android.
 * Usa @react-native-community/datetimepicker:
 *  - iOS: Modal con spinner datetime
 *  - Android: diálogos nativos secuenciales (fecha → hora)
 *
 * @param {Date}     value     - Fecha actualmente seleccionada.
 * @param {Function} onChange  - Callback con la nueva Date al confirmar.
 */
export default function DatePickerField({ value, onChange }) {
  /** Copia temporal: no se confirma hasta que el usuario presiona "Listo" (iOS). */
  const [tempDate, setTempDate] = useState(value);
  const [showModal, setShowModal] = useState(false);

  // Android: necesita dos pasos secuenciales
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
      // Abrir picker de hora como segundo paso
      setAndroidMode('time');
      setShowAndroid(true);
    } else {
      updated.setHours(date.getHours(), date.getMinutes());
      onChange(updated);
      setAndroidMode('date');
    }
  };

  return (
    <>
      {/* ── Botón que muestra la fecha y abre el picker ── */}
      <Pressable
        style={({ pressed }) => [styles.dateButton, pressed && styles.dateButtonPressed]}
        onPress={openPicker}
        accessibilityLabel="Seleccionar fecha y hora"
        accessibilityRole="button"
      >
        <Ionicons name="calendar" size={22} color="#6366F1" style={styles.icon} />
        <Text style={styles.dateText}>{formatDisplayDate(value)}</Text>
        <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
      </Pressable>

      {/* ── Modal iOS ── */}
      {Platform.OS === 'ios' && (
        <Modal
          visible={showModal}
          transparent
          animationType="slide"
          onRequestClose={cancelIOS}
        >
          <Pressable style={styles.overlay} onPress={cancelIOS} />
          <View style={styles.sheet}>
            <View style={styles.toolbar}>
              <Pressable onPress={cancelIOS} style={styles.toolbarBtn}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </Pressable>
              <Text style={styles.toolbarTitle}>Elige fecha y hora</Text>
              <Pressable onPress={confirmIOS} style={styles.toolbarBtn}>
                <Text style={styles.confirmText}>Listo</Text>
              </Pressable>
            </View>
            <DateTimePicker
              value={tempDate}
              mode="datetime"
              display="spinner"
              onChange={handleIOSChange}
              locale="es-ES"
              style={styles.picker}
            />
          </View>
        </Modal>
      )}

      {/* ── Dialog nativo Android ── */}
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

const styles = StyleSheet.create({
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E0E7FF',
    paddingHorizontal: 16,
    height: 56,
  },
  dateButtonPressed: {
    backgroundColor: '#F5F3FF',
  },
  icon: {
    marginRight: 12,
  },
  dateText: {
    flex: 1,
    fontSize: 15,
    color: '#1E293B',
    fontWeight: '500',
  },
  // Modal iOS
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  toolbarTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  toolbarBtn: {
    paddingVertical: 4,
    paddingHorizontal: 4,
    minWidth: 64,
  },
  cancelText: {
    fontSize: 15,
    color: '#94A3B8',
    fontWeight: '500',
  },
  confirmText: {
    fontSize: 15,
    color: '#6366F1',
    fontWeight: '700',
    textAlign: 'right',
  },
  picker: {
    width: '100%',
  },
});
