import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  Platform,
  Animated,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const PRIORITY_CONFIG = {
  alta:  { icon: 'flame',        label: 'Alta'  },
  media: { icon: 'alert-circle', label: 'Media' },
  baja:  { icon: 'leaf',         label: 'Baja'  },
};

export default function TaskItem({ title, description, isCompleted, date, priority = 'media', themeVersion, onPress, onDelete }) {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const priorityCfg  = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.media;
  const priorityColor = isCompleted ? theme.textMuted : theme.priorityBar[priority] || theme.accent;

  const handlePressIn = () =>
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true, speed: 50, bounciness: 4 }).start();

  const handlePressOut = () =>
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 6 }).start();

  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  const handleDeletePress = () => {
    if (Platform.OS === 'web') {
      if (window.confirm(`¿Eliminar "${title}"?`)) onDelete();
    } else {
      setShowDeleteModal(true);
    }
  };

  const confirmDelete = () => {
    setShowDeleteModal(false);
    onDelete();
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const s = React.useMemo(() => makeStyles(theme, isCompleted), [theme, isCompleted]);

  return (
    <Animated.View style={[s.wrapper, { transform: [{ scale: scaleAnim }] }]}>
      <View style={s.container}>
        {/* Borde izquierdo de prioridad */}
        <View style={[s.priorityBar, { backgroundColor: priorityColor }]} />

        {/* Área principal */}
        <Pressable
          style={s.taskTouchArea}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          android_ripple={{ color: theme.accentSoft }}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isCompleted }}
          accessibilityLabel={`Tarea: ${title}. ${isCompleted ? 'Completada' : 'Pendiente'}.`}
        >
          <View style={s.content}>
            {/* Título + check */}
            <View style={s.headerRow}>
              <Text style={s.title} numberOfLines={2}>{title}</Text>
              <View style={s.checkCircle}>
                {isCompleted && <Ionicons name="checkmark" size={13} color="#fff" />}
              </View>
            </View>

            {/* Descripción */}
            {description ? (
              <Text style={s.description} numberOfLines={2}>{description}</Text>
            ) : null}

            {/* Footer */}
            <View style={s.footerRow}>
              {!isCompleted ? (
                <View style={[s.priorityBadge, { backgroundColor: priorityColor + '22', borderColor: priorityColor + '55' }]}>
                  <Ionicons name={priorityCfg.icon} size={11} color={priorityColor} />
                  <Text style={[s.priorityText, { color: priorityColor }]}>{priorityCfg.label}</Text>
                </View>
              ) : (
                <View style={s.completedBadge}>
                  <Ionicons name="checkmark-circle-outline" size={12} color={theme.cyan} />
                  <Text style={s.completedBadgeText}>Completada</Text>
                </View>
              )}
              {date ? (
                <View style={s.dateBadge}>
                  <Ionicons name="time-outline" size={11} color={theme.textMuted} />
                  <Text style={s.dateText}>{date}</Text>
                </View>
              ) : null}
            </View>
          </View>
        </Pressable>

        {/* Botón eliminar */}
        <Pressable
          style={({ pressed }) => [
            s.deleteButton,
            { 
              backgroundColor: pressed ? (theme.dark ? '#2A1020' : '#FFE5EA') : theme.deleteBtn,
              borderLeftColor: theme.deleteBorder
            }
          ]}
          onPress={handleDeletePress}
          android_ripple={{ color: '#FF5E7A33' }}
          hitSlop={{ top: 8, bottom: 8, left: 4, right: 8 }}
          accessibilityLabel={`Eliminar tarea: ${title}`}
          accessibilityRole="button"
        >
          <Ionicons name="trash-outline" size={19} color="#FF5E7A" />
        </Pressable>
      </View>

      {/* ── Modal de confirmación de eliminación ── */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={cancelDelete}
      >
        <Pressable style={s.modalOverlay} onPress={cancelDelete} />
        <View style={s.modalContainerWrapper}>
          <View style={s.modalContent}>
            <View style={s.modalIconCircle}>
              <Ionicons name="trash" size={32} color="#FF5E7A" />
            </View>
            <Text style={s.modalTitle}>¿Eliminar tarea?</Text>
            <Text style={s.modalMessage}>
              Estás a punto de eliminar <Text style={{ fontWeight: '700', color: theme.textPrimary }}>"{title}"</Text>. Esta acción no se puede deshacer.
            </Text>
            
            <View style={s.modalActions}>
              <Pressable style={[s.modalBtn, s.modalBtnCancel]} onPress={cancelDelete}>
                <Text style={s.modalBtnCancelText}>Cancelar</Text>
              </Pressable>
              <Pressable style={[s.modalBtn, s.modalBtnDelete]} onPress={confirmDelete}>
                <Text style={s.modalBtnDeleteText}>Eliminar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

    </Animated.View>
  );
}

const makeStyles = (t, isCompleted) =>
  StyleSheet.create({
    wrapper: { marginVertical: 5, marginHorizontal: 16 },
    container: {
      backgroundColor: t.bgCard,
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'stretch',
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: t.border,
      shadowColor: t.dark ? '#000' : '#7C6EFA',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: t.dark ? 0.3 : 0.08,
      shadowRadius: 8,
      elevation: 4,
      opacity: isCompleted ? (t.dark ? 0.6 : 0.7) : 1,
    },
    priorityBar: { width: 4, borderTopLeftRadius: 16, borderBottomLeftRadius: 16 },
    taskTouchArea: { flex: 1, ...Platform.select({ web: { cursor: 'pointer' } }) },
    content: { padding: 14, gap: 6 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 },
    title:     { fontSize: 15, fontWeight: '700', color: isCompleted ? t.textMuted : t.textPrimary, flex: 1, lineHeight: 21, textDecorationLine: isCompleted ? 'line-through' : 'none' },
    description:{ fontSize: 13, color: isCompleted ? t.textMuted : t.textSecondary, lineHeight: 19, textDecorationLine: isCompleted ? 'line-through' : 'none' },
    checkCircle: {
      width: 22, height: 22, borderRadius: 11,
      borderWidth: 2,
      borderColor: isCompleted ? t.accent : t.border,
      backgroundColor: isCompleted ? t.accent : 'transparent',
      justifyContent: 'center', alignItems: 'center', marginTop: 1,
    },
    footerRow:      { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 2 },
    priorityBadge:  { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, borderWidth: 1 },
    priorityText:   { fontSize: 11, fontWeight: '700' },
    completedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, backgroundColor: t.cyanSoft, borderWidth: 1, borderColor: t.cyanBorder },
    completedBadgeText: { fontSize: 11, fontWeight: '700', color: t.cyan },
    dateBadge:      { flexDirection: 'row', alignItems: 'center', gap: 4 },
    dateText:       { fontSize: 11, color: t.textMuted, fontWeight: '500' },
    deleteButton:   { paddingHorizontal: 14, justifyContent: 'center', alignItems: 'center', borderLeftWidth: 1, minWidth: 48, ...Platform.select({ web: { cursor: 'pointer' } }) },

    // Estilos del Modal
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.65)',
    },
    modalContainerWrapper: {
      position: 'absolute',
      top: 0, bottom: 0, left: 0, right: 0,
      justifyContent: 'center',
      alignItems: 'center',
      pointerEvents: 'box-none',
    },
    modalContent: {
      backgroundColor: t.bgCard,
      width: '85%',
      maxWidth: 340,
      borderRadius: 24,
      padding: 24,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: t.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 20,
    },
    modalIconCircle: {
      width: 64, height: 64,
      borderRadius: 32,
      backgroundColor: '#FF5E7A18',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
      borderWidth: 1,
      borderColor: '#FF5E7A44',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '800',
      color: t.textPrimary,
      marginBottom: 8,
    },
    modalMessage: {
      fontSize: 15,
      color: t.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: 24,
    },
    modalActions: {
      flexDirection: 'row',
      gap: 12,
      width: '100%',
    },
    modalBtn: {
      flex: 1,
      height: 48,
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalBtnCancel: {
      backgroundColor: t.inputBg,
      borderWidth: 1.5,
      borderColor: t.border,
    },
    modalBtnCancelText: {
      color: t.textSecondary,
      fontSize: 15,
      fontWeight: '700',
    },
    modalBtnDelete: {
      backgroundColor: '#FF5E7A',
    },
    modalBtnDeleteText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '700',
    },
  });
