import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTasks } from '../context/TaskContext';

export default function AddTaskScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [isDescFocused, setIsDescFocused] = useState(false);
  
  const { addTask } = useTasks();

  const handleSave = () => {
    if (title.trim().length === 0) {
      Alert.alert('¡Ups!', 'El título de la tarea es obligatorio.');
      return;
    }

    const newTask = {
      title: title.trim(),
      description: description.trim(),
      date: new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' }),
    };

    addTask(newTask);
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crear Nueva Tarea</Text>
        <View style={{ width: 40 }} /> {/* Spacer to center title */}
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.illustrationContainer}>
            <View style={styles.iconCircle}>
              <Ionicons name="create" size={40} color="#6366F1" />
            </View>
            <Text style={styles.subtitle}>Organiza tu día agregando una nueva meta.</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>¿Qué tienes planeado?</Text>
              <View style={[
                styles.inputWrapper, 
                isTitleFocused && styles.inputWrapperFocused
              ]}>
                <Ionicons name="pencil-outline" size={20} color={isTitleFocused ? "#6366F1" : "#94A3B8"} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ej. Comprar materiales de React"
                  placeholderTextColor="#94A3B8"
                  value={title}
                  onChangeText={setTitle}
                  onFocus={() => setIsTitleFocused(true)}
                  onBlur={() => setIsTitleFocused(false)}
                  maxLength={60}
                  autoFocus
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Notas adicionales (opcional)</Text>
              <View style={[
                styles.inputWrapper, 
                styles.textAreaWrapper,
                isDescFocused && styles.inputWrapperFocused
              ]}>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Detalles que no quieras olvidar..."
                  placeholderTextColor="#94A3B8"
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
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>Guardar Tarea</Text>
          <Ionicons name="checkmark-circle" size={24} color="#fff" style={styles.saveIcon} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    backgroundColor: '#F8FAFC',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  form: {
    gap: 24,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    height: 56,
  },
  inputWrapperFocused: {
    borderColor: '#6366F1',
    backgroundColor: '#FFF',
    borderWidth: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },
  textAreaWrapper: {
    height: 140,
    alignItems: 'flex-start',
    paddingTop: 16,
  },
  textArea: {
    height: '100%',
    textAlignVertical: 'top',
  },
  footer: {
    padding: 24,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  saveButton: {
    backgroundColor: '#6366F1',
    borderRadius: 18,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 10,
  },
  saveIcon: {
    marginLeft: 2,
  },
});
