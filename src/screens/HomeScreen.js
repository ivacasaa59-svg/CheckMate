import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TaskItem from '../components/TaskItem/TaskItem';
import { useTasks } from '../context/TaskContext'; // Importar el hook del contexto

export default function HomeScreen({ navigation }) {
  // Consumir el estado y las funciones del contexto
  const { tasks, toggleTaskCompletion, deleteTask } = useTasks();

  const renderTask = ({ item }) => (
    <TaskItem 
      title={item.title}
      description={item.description}
      isCompleted={item.isCompleted}
      date={item.date}
      onPress={() => toggleTaskCompletion(item.id)}
      onDelete={() => deleteTask(item.id)} // Pasamos la función de eliminar al componente
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hola,</Text>
            <Text style={styles.title}>Mis Tareas</Text>
          </View>
          <Text style={styles.taskCount}>
            {tasks.filter(t => !t.isCompleted).length} pendientes
          </Text>
        </View>

        <FlatList
          data={tasks}
          keyExtractor={item => item.id}
          renderItem={renderTask}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No tienes tareas aún.</Text>
            </View>
          }
        />

        <TouchableOpacity 
          style={styles.fab} 
          onPress={() => navigation.navigate('AddTask')}
        >
          <Ionicons name="add" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  greeting: {
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  taskCount: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '600',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    overflow: 'hidden',
  },
  listContainer: {
    paddingBottom: 80, // Espacio para el botón flotante
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#999',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30, // Posicionado arriba si hay un tab bar, o en la esquina si no lo hay
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  }
});
