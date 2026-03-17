import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import TaskItem from '../components/TaskItem/TaskItem';
import { useTasks } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';

const FILTERS = [
  { key: 'all',     label: 'Todas' },
  { key: 'pending', label: 'Pendientes' },
  { key: 'done',    label: 'Completadas' },
];

function getGreetingIcon() {
  const hour = new Date().getHours();
  if (hour < 12) return { label: 'Buenos días',    icon: 'sunny-outline' };
  if (hour < 18) return { label: 'Buenas tardes',  icon: 'partly-sunny-outline' };
  return           { label: 'Buenas noches',  icon: 'moon-outline' };
}

export default function HomeScreen({ navigation }) {
  const { tasks, toggleTaskCompletion, deleteTask } = useTasks();
  const { theme, isDark, toggleTheme } = useTheme();
  const [activeFilter, setActiveFilter] = useState('all');

  const totalTasks   = tasks.length;
  const doneTasks    = tasks.filter((t) => t.isCompleted).length;
  const pendingTasks = totalTasks - doneTasks;
  const progress     = totalTasks > 0 ? doneTasks / totalTasks : 0;
  const greeting     = getGreetingIcon();

  const filteredTasks = tasks.filter((t) => {
    if (activeFilter === 'pending') return !t.isCompleted;
    if (activeFilter === 'done')    return t.isCompleted;
    return true;
  });

  const renderTask = ({ item }) => (
    <TaskItem
      title={item.title}
      description={item.description}
      isCompleted={item.isCompleted}
      date={item.date}
      priority={item.priority}
      themeVersion={isDark}
      onPress={() => toggleTaskCompletion(item.id)}
      onDelete={() => deleteTask(item.id)}
    />
  );

  const s = makeStyles(theme);

  return (
    <SafeAreaView style={s.safeArea}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'light-content'}
        backgroundColor={isDark ? '#0F0F18' : theme.accent}
      />

      {/* ── Header con gradiente ── */}
      <LinearGradient colors={theme.headerGradient} style={s.headerGradient}>

        {/* Top row: saludo + CheckMate + toggle */}
        <View style={s.headerTop}>
          <View>
            <View style={s.greetingRow}>
              <Ionicons name={greeting.icon} size={14} color={isDark ? '#8888AA' : '#D0CCFF'} style={s.greetingIcon} />
              <Text style={s.greeting}>{greeting.label}</Text>
            </View>
            <Text style={s.title}>CheckMate</Text>
          </View>

          <View style={s.headerActions}>
            {/* Toggle tema */}
            <TouchableOpacity style={s.iconBtn} onPress={toggleTheme} activeOpacity={0.75}>
              <Ionicons
                name={isDark ? 'sunny-outline' : 'moon-outline'}
                size={20}
                color={isDark ? '#8888AA' : '#D0CCFF'}
              />
            </TouchableOpacity>
            {/* Avatar */}
            <View style={s.avatarCircle}>
              <Ionicons name="checkmark-done" size={21} color={isDark ? theme.accent : '#FFFFFF'} />
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={s.statsRow}>
          <View style={s.statCard}>
            <Text style={s.statNumber}>{totalTasks}</Text>
            <Text style={s.statLabel}>Total</Text>
          </View>
          <View style={[s.statCard, s.statCardAccent]}>
            <Text style={[s.statNumber, s.statNumberAccent]}>{pendingTasks}</Text>
            <Text style={[s.statLabel, s.statLabelAccent]}>Pendientes</Text>
          </View>
          <View style={s.statCard}>
            <Text style={s.statNumber}>{doneTasks}</Text>
            <Text style={s.statLabel}>Hechas</Text>
          </View>
        </View>

        {/* Progreso */}
        {totalTasks > 0 && (
          <View style={s.progressContainer}>
            <View style={s.progressBg}>
              <View style={[s.progressFill, { width: `${progress * 100}%` }]} />
            </View>
            <Text style={s.progressLabel}>{Math.round(progress * 100)}% completado</Text>
          </View>
        )}

        {/* Filtros */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.filtersRow}
        >
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[s.filterChip, activeFilter === f.key && s.filterChipActive]}
              onPress={() => setActiveFilter(f.key)}
              activeOpacity={0.7}
            >
              <Text style={[s.filterChipText, activeFilter === f.key && s.filterChipTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      {/* ── Lista ── */}
      <View style={s.listWrapper}>
        <FlatList
          data={filteredTasks}
          extraData={isDark}
          keyExtractor={(item) => `${item.id}-${isDark ? 'dark' : 'light'}`}
          renderItem={renderTask}
          contentContainerStyle={s.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={s.emptyContainer}>
              <LinearGradient colors={theme.emptyCircleColors} style={s.emptyIconCircle}>
                <Ionicons
                  name={activeFilter === 'done' ? 'trophy-outline' : 'checkmark-done-outline'}
                  size={52}
                  color={theme.accent}
                />
              </LinearGradient>
              <Text style={s.emptyText}>
                {activeFilter === 'done'    ? 'Aún no completaste nada.'
                 : activeFilter === 'pending' ? '¡Todo al día!'
                 : 'Sin tareas todavía.'}
              </Text>
              {activeFilter === 'all' && (
                <Text style={s.emptySubtext}>Toca el + para agregar tu primera tarea.</Text>
              )}
            </View>
          }
        />
      </View>

      {/* ── FAB ── */}
      <TouchableOpacity
        style={s.fabWrapper}
        onPress={() => navigation.navigate('AddTask')}
        activeOpacity={0.85}
      >
        <LinearGradient colors={theme.accentGradient} style={s.fab} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Ionicons name="add" size={32} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// Estilos generados dinámicamente con los colores del tema
const makeStyles = (t) =>
  StyleSheet.create({
    safeArea:        { flex: 1, backgroundColor: t.bg },
    headerGradient:  { paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 16 : 50, paddingHorizontal: 20, paddingBottom: 16 },
    headerTop:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    greetingRow:     { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
    greetingIcon:    { marginRight: 5 },
    greeting:        { fontSize: 14, color: t.dark ? '#8888AA' : '#D0CCFF', fontWeight: '500' },
    title:           { fontSize: 30, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.5 },
    headerActions:   { flexDirection: 'row', alignItems: 'center', gap: 10 },
    iconBtn: {
      width: 40, height: 40, borderRadius: 20,
      backgroundColor: t.dark ? '#252535' : 'rgba(255,255,255,0.2)',
      borderWidth: 1, borderColor: t.dark ? '#7C6EFA55' : 'rgba(255,255,255,0.3)',
      justifyContent: 'center', alignItems: 'center',
    },
    avatarCircle: {
      width: 40, height: 40, borderRadius: 20,
      backgroundColor: t.dark ? '#252535' : 'rgba(255,255,255,0.2)',
      borderWidth: 1, borderColor: t.dark ? '#7C6EFA55' : 'rgba(255,255,255,0.3)',
      justifyContent: 'center', alignItems: 'center',
    },
    statsRow:        { flexDirection: 'row', gap: 10, marginBottom: 16 },
    statCard:        { flex: 1, backgroundColor: t.dark ? '#1E1E30' : 'rgba(255,255,255,0.25)', borderRadius: 14, paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: t.dark ? '#2A2A40' : 'rgba(255,255,255,0.3)' },
    statCardAccent:  { backgroundColor: t.dark ? '#2A2040' : 'rgba(255,255,255,0.35)', borderColor: t.dark ? '#7C6EFA55' : 'rgba(255,255,255,0.5)' },
    statNumber:      { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
    statNumberAccent:{ color: t.dark ? '#9B8FF5' : '#EDE8FF' },
    statLabel:       { fontSize: 11, color: t.dark ? '#5555AA' : 'rgba(255,255,255,0.7)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4, marginTop: 2 },
    statLabelAccent: { color: t.dark ? '#7C6EFA' : '#EDE8FF' },
    progressContainer:{ marginBottom: 16, gap: 6 },
    progressBg:      { height: 6, backgroundColor: t.dark ? '#1E1E30' : 'rgba(255,255,255,0.25)', borderRadius: 3, overflow: 'hidden' },
    progressFill:    { height: '100%', backgroundColor: t.dark ? '#7C6EFA' : '#FFFFFF', borderRadius: 3 },
    progressLabel:   { fontSize: 11, color: t.dark ? '#5555AA' : 'rgba(255,255,255,0.7)', fontWeight: '600', textAlign: 'right' },
    filtersRow:      { gap: 8, paddingBottom: 2 },
    filterChip:      { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, backgroundColor: t.dark ? '#1E1E30' : 'rgba(255,255,255,0.2)', borderWidth: 1, borderColor: t.dark ? '#2A2A40' : 'rgba(255,255,255,0.3)' },
    filterChipActive:{ backgroundColor: t.dark ? '#7C6EFA' : '#FFFFFF', borderColor: t.dark ? '#7C6EFA' : '#FFFFFF' },
    filterChipText:  { fontSize: 13, fontWeight: '600', color: t.dark ? '#5555AA' : 'rgba(255,255,255,0.7)' },
    filterChipTextActive: { color: t.dark ? '#FFFFFF' : t.accent },
    listWrapper:     { flex: 1, backgroundColor: t.bg },
    listContainer:   { paddingTop: 12, paddingBottom: 110, paddingHorizontal: 4 },
    emptyContainer:  { alignItems: 'center', marginTop: 70, paddingHorizontal: 40, gap: 12 },
    emptyIconCircle: { width: 110, height: 110, borderRadius: 55, justifyContent: 'center', alignItems: 'center', marginBottom: 8, borderWidth: 1, borderColor: t.accentBorder },
    emptyText:       { fontSize: 18, fontWeight: '700', color: t.textSecondary, textAlign: 'center' },
    emptySubtext:    { fontSize: 14, color: t.textMuted, textAlign: 'center' },
    fabWrapper:      { position: 'absolute', right: 24, bottom: 36, shadowColor: t.accent, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.55, shadowRadius: 16, elevation: 12 },
    fab:             { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center' },
  });
