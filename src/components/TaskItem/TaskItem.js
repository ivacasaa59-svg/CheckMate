import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Tarjeta de tarea individual. Soporta iOS, Android y Web.
 *
 * Usa `Pressable` en lugar de `TouchableOpacity` para:
 * - Evitar el delay de reconocimiento de gesto dentro de FlatList.
 * - Funcionar correctamente en Web (cursor pointer, sin conflicto de scroll).
 * - Obtener retroalimentación de ripple nativa en Android.
 *
 * @param {string}   title        - Título de la tarea.
 * @param {string}   description  - Descripción opcional.
 * @param {boolean}  isCompleted  - Estado de completado.
 * @param {string}   date         - Fecha/hora formateada a mostrar.
 * @param {Function} onPress      - Toggle del estado completado.
 * @param {Function} onDelete     - Elimina la tarea del estado global.
 */
export default function TaskItem({ title, description, isCompleted, date, onPress, onDelete }) {
  /**
   * Controla el modo de confirmación inline del botón eliminar.
   * Cuando es `true`, el ícono cambia a un check rojo pidiendo confirmación.
   * Si el usuario no confirma en 3 segundos, se cancela automáticamente.
   */
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  /**
   * Primer tap: activa el modo de confirmación (muestra ícono check).
   * Segundo tap o Alert (native): ejecuta el borrado definitivo.
   */
  const handleDeletePress = () => {
    if (Platform.OS === 'web') {
      // En web usamos confirmación inline de dos-tap para evitar
      // problemas con window.confirm() que bloquea el hilo en algunos browsers.
      if (confirmingDelete) {
        setConfirmingDelete(false);
        onDelete();
      } else {
        setConfirmingDelete(true);
        // Auto-cancelar si el usuario no confirma en 3 segundos
        setTimeout(() => setConfirmingDelete(false), 3000);
      }
    } else {
      // En native usamos el dialog nativo que funciona perfectamente
      Alert.alert(
        'Eliminar tarea',
        `¿Eliminar "${title}"? Esta acción no se puede deshacer.`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Eliminar', style: 'destructive', onPress: onDelete },
        ],
        { cancelable: true }
      );
    }
  };

  return (
    <View style={[styles.container, isCompleted && styles.containerCompleted]}>

      {/* ── Área clickeable principal (toggle completado) ── */}
      <Pressable
        style={({ pressed }) => [
          styles.taskTouchArea,
          pressed && styles.taskAreaPressed,
        ]}
        onPress={onPress}
        android_ripple={{ color: '#E8EAFF', borderless: false }}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isCompleted }}
        accessibilityLabel={`Tarea: ${title}. ${isCompleted ? 'Completada' : 'Pendiente'}. Toca para cambiar estado.`}
      >
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text
              style={[styles.title, isCompleted && styles.textCompleted]}
              numberOfLines={2}
            >
              {title}
            </Text>
            <Ionicons
              name={isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
              size={24}
              color={isCompleted ? '#4CAF50' : '#CBD5E1'}
            />
          </View>

          {description ? (
            <Text
              style={[styles.description, isCompleted && styles.textCompleted]}
              numberOfLines={2}
            >
              {description}
            </Text>
          ) : null}

          {date ? (
            <View style={styles.footerRow}>
              <Ionicons name="calendar-outline" size={13} color="#94A3B8" style={styles.dateIcon} />
              <Text style={styles.dateText}>{date}</Text>
            </View>
          ) : null}
        </View>
      </Pressable>

      {/* ── Botón eliminar ── */}
      <Pressable
        style={({ pressed }) => [
          styles.deleteButton,
          confirmingDelete && styles.deleteButtonConfirming,
          pressed && styles.deleteButtonPressed,
        ]}
        onPress={handleDeletePress}
        android_ripple={{ color: '#FFCDD2', borderless: false }}
        hitSlop={{ top: 8, bottom: 8, left: 4, right: 8 }}
        accessibilityLabel={
          confirmingDelete
            ? 'Confirmar eliminación. Toca de nuevo para eliminar.'
            : `Eliminar tarea: ${title}`
        }
        accessibilityRole="button"
      >
        <Ionicons
          name={confirmingDelete ? 'checkmark-circle' : 'trash-outline'}
          size={21}
          color={confirmingDelete ? '#C62828' : '#EF5350'}
        />
        {/* Etiqueta pequeña de confirmación solo en web */}
        {confirmingDelete && Platform.OS === 'web' && (
          <Text style={styles.confirmLabel}>¿Seguro?</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginVertical: 6,
    marginHorizontal: 16,
    // Sombra iOS
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    // Sombra Android / web elevation
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#6366F1',
    flexDirection: 'row',
    alignItems: 'stretch', // El botón de eliminar ocupa toda la altura
    overflow: 'hidden',    // Para que el ripple de Android se recorte al borde
  },
  containerCompleted: {
    opacity: 0.72,
    borderLeftColor: '#4CAF50',
  },
  taskTouchArea: {
    flex: 1,
    // cursor pointer en web
    ...Platform.select({ web: { cursor: 'pointer' } }),
  },
  taskAreaPressed: {
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
    lineHeight: 22,
  },
  description: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
    lineHeight: 20,
  },
  textCompleted: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  dateIcon: {
    marginRight: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  // ── Botón eliminar ─────────────────────────────────────────────────────────
  deleteButton: {
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#FFE0E0',
    backgroundColor: '#FFF5F5',
    minWidth: 52,
    gap: 4,
    // cursor pointer en web
    ...Platform.select({ web: { cursor: 'pointer' } }),
  },
  deleteButtonConfirming: {
    // Feedback visual cuando está esperando confirmación (solo web)
    backgroundColor: '#FFEBEE',
    borderLeftColor: '#EF9A9A',
  },
  deleteButtonPressed: {
    backgroundColor: '#FFCDD2',
  },
  confirmLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#C62828',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
