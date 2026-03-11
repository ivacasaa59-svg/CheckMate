import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView, StatusBar, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TaskItem from '../components/TaskItem/TaskItem';
import { useTasks } from '../context/TaskContext';

export default function HomeScreen({ navigation }) {
  const { tasks, toggleTaskCompletion, deleteTask } = useTasks();

  const renderTask = ({ item }) => (
    <TaskItem
      title={item.title}
      description={item.description}
      isCompleted={item.isCompleted}
      date={item.date}
      onPress={() => toggleTaskCompletion(item.id)}
      onDelete={() => deleteTask(item.id)}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hola,</Text>
            <Text style={styles.title}>Mis Tareas</Text>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.taskCount}>
              {tasks.filter(t => !t.isCompleted).length}
            </Text>
            <Text style={styles.countLabel}>hoy</Text>
          </View>
        </View>

        <FlatList
          data={tasks}
          keyExtractor={item => item.id}
          renderItem={renderTask}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="document-text-outline" size={60} color="#CBD5E1" />
              </View>
              <Text style={styles.emptyText}>No tienes tareas aún.</Text>
              <Text style={styles.emptySubtext}>¡Empieza agregando una nueva!</Text>
            </View>
          }
        />

        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('AddTask')}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={32} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748B',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  countBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  taskCount: {
    fontSize: 18,
    color: '#6366F1',
    fontWeight: '800',
  },
  countLabel: {
    fontSize: 10,
    color: '#6366F1',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  listContainer: {
    paddingHorizontal: 8,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 15,
    color: '#94A3B8',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  }
});
