import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTasks } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';
import DatePickerField from '../components/DatePickerField';

const formatSaveDate = (date) => {
  const dayPart = date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
  const timePart = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });
  return `${dayPart} · ${timePart}`;
};

const PRIORITIES = [
  { key: 'alta',  label: 'Alta',  icon: 'flame',        color: '#FF5E7A', bg: '#FF5E7A18', border: '#FF5E7A55' },
  { key: 'media', label: 'Media', icon: 'alert-circle', color: '#FFC844', bg: '#FFC84418', border: '#FFC84455' },
  { key: 'baja',  label: 'Baja',  icon: 'leaf',         color: '#4ECDF5', bg: '#4ECDF518', border: '#4ECDF555' },
];

export default function AddTaskScreen({ navigation }) {
  const [title, setTitle]         = useState('');
  const [description, setDescription] = useState('');
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [isDescFocused, setIsDescFocused]   = useState(false);
  const [selectedDate, setSelectedDate]     = useState(new Date());
  const [priority, setPriority]             = useState('media');

  const { addTask } = useTasks();
  const { theme, isDark } = useTheme();

  const handleSave = () => {
    if (title.trim().length === 0) {
      Alert.alert('¡Ups!', 'El título de la tarea es obligatorio.');
      return;
    }
    addTask({ title: title.trim(), description: description.trim(), date: formatSaveDate(selectedDate), priority });
    navigation.goBack();
  };

  const s = makeStyles(theme, isTitleFocused, isDescFocused);

  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 20}
    >
      <StatusBar barStyle="light-content" backgroundColor={isDark ? '#0F0F18' : theme.accent} />

      {/* ── Header ── */}
      <LinearGradient colors={theme.headerGradient} style={s.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [s.backButton, pressed && s.backButtonPressed]}
          accessibilityRole="button"
          accessibilityLabel="Volver"
        >
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </Pressable>
        <Text style={s.headerTitle}>Nueva Tarea</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={s.scrollContainer} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={s.content}>

          {/* Icono decorativo */}
          <View style={s.illustrationContainer}>
            <LinearGradient colors={isDark ? ['#2A2040', '#1E1A35'] : ['#EDE8FF', '#DDD8FF']} style={s.iconCircle}>
              <Ionicons name="create" size={38} color={theme.accent} />
            </LinearGradient>
            <Text style={s.subtitle}>Organiza tu día, un paso a la vez.</Text>
          </View>

          <View style={s.form}>
            {/* Título */}
            <View style={s.inputGroup}>
              <Text style={s.label}>¿Qué tienes planeado?</Text>
              <View style={[s.inputWrapper, isTitleFocused && s.inputWrapperFocused]}>
                <Ionicons name="pencil-outline" size={18} color={isTitleFocused ? theme.accent : theme.textMuted} style={s.inputIcon} />
                <TextInput
                  style={s.input}
                  placeholder="Ej. Comprar materiales…"
                  placeholderTextColor={theme.textMuted}
                  value={title}
                  onChangeText={setTitle}
                  onFocus={() => setIsTitleFocused(true)}
                  onBlur={() => setIsTitleFocused(false)}
                  maxLength={60}
                />
              </View>
            </View>

            {/* Descripción */}
            <View style={s.inputGroup}>
              <Text style={s.label}>Notas adicionales <Text style={s.optional}>(opcional)</Text></Text>
              <View style={[s.inputWrapper, s.textAreaWrapper, isDescFocused && s.inputWrapperFocused]}>
                <TextInput
                  style={[s.input, s.textArea]}
                  placeholder="Detalles que no quieras olvidar…"
                  placeholderTextColor={theme.textMuted}
                  value={description}
                  onChangeText={setDescription}
                  onFocus={() => setIsDescFocused(true)}
                  onBlur={() => setIsDescFocused(false)}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* Prioridad */}
            <View style={s.inputGroup}>
              <Text style={s.label}>Prioridad</Text>
              <View style={s.priorityRow}>
                {PRIORITIES.map((p) => {
                  const isActive = priority === p.key;
                  return (
                    <TouchableOpacity
                      key={p.key}
                      onPress={() => setPriority(p.key)}
                      activeOpacity={0.75}
                      style={[s.priorityChip, {
                        backgroundColor: isActive ? p.bg : theme.inputBg,
                        borderColor: isActive ? p.border : theme.border,
                      }]}
                    >
                      <Ionicons name={p.icon} size={13} color={isActive ? p.color : theme.textMuted} />
                      <Text style={[s.priorityChipText, { color: isActive ? p.color : theme.textMuted }]}>
                        {p.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Fecha y hora */}
            <View style={s.inputGroup}>
              <Text style={s.label}>Fecha y hora</Text>
              <DatePickerField value={selectedDate} onChange={setSelectedDate} />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Botón guardar */}
      <View style={s.footer}>
        <TouchableOpacity onPress={handleSave} activeOpacity={0.85} style={s.saveWrapper} accessibilityRole="button" accessibilityLabel="Guardar tarea">
          <LinearGradient colors={theme.accentGradient} style={s.saveButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={s.saveButtonText}>Guardar Tarea</Text>
            <Ionicons name="checkmark-circle" size={22} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const makeStyles = (t, titleFocused, descFocused) =>
  StyleSheet.create({
    container:            { flex: 1, backgroundColor: t.bg },
    header:               { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 16 : 60, paddingBottom: 18 },
    backButton:           { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
    backButtonPressed:    { backgroundColor: 'rgba(255,255,255,0.1)' },
    headerTitle:          { fontSize: 18, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.3 },
    scrollContainer:      { flexGrow: 1 },
    content:              { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 },
    illustrationContainer:{ alignItems: 'center', marginBottom: 28, gap: 12 },
    iconCircle:           { width: 76, height: 76, borderRadius: 38, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: t.accentBorder },
    subtitle:             { fontSize: 14, color: t.textMuted, textAlign: 'center', fontStyle: 'italic' },
    form:                 { gap: 22 },
    inputGroup:           { gap: 8 },
    label:                { fontSize: 14, fontWeight: '600', color: t.textSecondary, marginLeft: 4 },
    optional:             { color: t.textMuted, fontWeight: '400' },
    inputWrapper:         { flexDirection: 'row', alignItems: 'center', backgroundColor: t.inputBg, borderRadius: 14, borderWidth: 1.5, borderColor: t.border, paddingHorizontal: 14, height: 54 },
    inputWrapperFocused:  { borderColor: t.accent, backgroundColor: t.inputFocusBg },
    inputIcon:            { marginRight: 10 },
    input:                { flex: 1, fontSize: 15, color: t.textPrimary, fontWeight: '500' },
    textAreaWrapper:      { height: 130, alignItems: 'flex-start', paddingTop: 14 },
    textArea:             { height: '100%', textAlignVertical: 'top' },
    priorityRow:          { flexDirection: 'row', gap: 10 },
    priorityChip:         { flex: 1, flexDirection: 'row', paddingVertical: 10, borderRadius: 12, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', gap: 5 },
    priorityChipText:     { fontSize: 13, fontWeight: '700' },
    footer:               { padding: 20, borderTopWidth: 1, borderTopColor: t.border, backgroundColor: t.bg },
    saveWrapper:          { shadowColor: t.accent, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 14, elevation: 10 },
    saveButton:           { borderRadius: 16, height: 58, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
    saveButtonText:       { color: '#fff', fontSize: 17, fontWeight: '700' },
  });
