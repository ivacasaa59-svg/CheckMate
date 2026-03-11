import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TaskItem({ title, description, isCompleted, date, onPress, onDelete }) {
  return (
    <View style={[styles.container, isCompleted && styles.containerCompleted]}>
      <TouchableOpacity 
        style={styles.taskTouchArea} 
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={[styles.title, isCompleted && styles.textCompleted]}>
              {title}
            </Text>
            {isCompleted ? (
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            ) : (
              <Ionicons name="ellipse-outline" size={24} color="#ccc" />
            )}
          </View>
          
          {description ? (
            <Text style={[styles.description, isCompleted && styles.textCompleted]} numberOfLines={2}>
              {description}
            </Text>
          ) : null}
          
          {date ? (
            <View style={styles.footerRow}>
              <Ionicons name="calendar-outline" size={14} color="#888" style={styles.dateIcon}/>
              <Text style={styles.dateText}>{date}</Text>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
      
      {/* Botón de eliminar, solo se muestra si la tarea está completada */}
      {isCompleted && (
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={onDelete}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={22} color="#F44336" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, 
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
    flexDirection: 'row', // Para colocar el botón al lado
    alignItems: 'center',
  },
  taskTouchArea: {
    flex: 1, // Toma todo el espacio excepto el de los botones de la derecha
  },
  containerCompleted: {
    opacity: 0.7,
    borderLeftColor: '#4CAF50',
  },
  content: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1, 
    marginRight: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
  textCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dateIcon: {
    marginRight: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#888',
  },
  deleteButton: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
