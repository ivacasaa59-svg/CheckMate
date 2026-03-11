import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
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
 * Convierte un Date al formato requerido por <input type="datetime-local">
 * Ejemplo: "2024-03-12T15:30"
 * @param {Date} date
 * @returns {string}
 */
const toDatetimeLocalValue = (date) => {
  const pad = (n) => String(n).padStart(2, '0');
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
};

/**
 * Selector de fecha/hora para Web.
 * Superpone un <input type="datetime-local"> invisible sobre el botón estilizado,
 * de modo que al hacer clic se abre el selector nativo del browser sin código extra.
 *
 * @param {Date}     value     - Fecha actualmente seleccionada.
 * @param {Function} onChange  - Callback con la nueva Date al confirmar.
 */
export default function DatePickerField({ value, onChange }) {
  const inputRef = useRef(null);

  /**
   * Intenta abrir el picker nativo del browser mediante showPicker().
   * Si el browser no lo soporta (fallback), el click en el input invisible
   * igual abre el selector de forma nativa.
   */
  const handlePress = () => {
    try {
      inputRef.current?.showPicker();
    } catch {
      // showPicker() no disponible en todos los browsers — el input invisible
      // igual recibe el click y abre el picker nativo.
    }
  };

  const handleChange = (event) => {
    const parsed = new Date(event.target.value);
    if (!isNaN(parsed.getTime())) {
      onChange(parsed);
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.dateButton, pressed && styles.dateButtonPressed]}
      onPress={handlePress}
      accessibilityLabel="Seleccionar fecha y hora"
      accessibilityRole="button"
    >
      <Ionicons name="calendar" size={22} color="#6366F1" style={styles.icon} />
      <Text style={styles.dateText}>{formatDisplayDate(value)}</Text>
      <Ionicons name="chevron-forward" size={18} color="#94A3B8" />

      {/*
        Input invisible superpuesto sobre el botón.
        Recibe eventos de pointer del browser y activa el date picker nativo
        sin necesidad de librerías adicionales. opacity:0 lo oculta visualmente
        pero sigue siendo clickeable para los eventos del DOM.
      */}
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
        }}
      />
    </Pressable>
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
    overflow: 'hidden',
    // Cursor pointer en web
    cursor: 'pointer',
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
});
