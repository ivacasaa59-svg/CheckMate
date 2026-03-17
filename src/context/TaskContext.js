import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'CHECKMATE_TASKS';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

// Tareas demo que se usan SOLO cuando no hay datos guardados
const DEFAULT_TASKS = [
  {
    id: '1',
    title: 'Comprar víveres',
    description: 'Leche, huevos, pan, vegetales para la semana.',
    isCompleted: false,
    date: 'Mañana, 10:00 AM',
    priority: 'media',
  },
  {
    id: '2',
    title: 'Terminar el proyecto de React Native',
    description: 'Implementar el componente de la lista de tareas y crear el diseño visual.',
    isCompleted: true,
    date: 'Hoy',
    priority: 'alta',
  },
  {
    id: '3',
    title: 'Llamar al médico',
    description: 'Programar cita anual.',
    isCompleted: false,
    date: 'Viernes, 3:00 PM',
    priority: 'baja',
  },
];

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar tareas desde AsyncStorage al iniciar la app
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored !== null) {
          setTasks(JSON.parse(stored));
        } else {
          // Primera vez: cargar tareas demo
          setTasks(DEFAULT_TASKS);
        }
      } catch (e) {
        console.warn('Error cargando tareas:', e);
        setTasks(DEFAULT_TASKS);
      } finally {
        setIsLoaded(true);
      }
    };
    loadTasks();
  }, []);

  // Guardar tareas en AsyncStorage cada vez que cambien
  useEffect(() => {
    if (!isLoaded) return; // Evitar sobrescribir antes de cargar
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } catch (e) {
        console.warn('Error guardando tareas:', e);
      }
    };
    saveTasks();
  }, [tasks, isLoaded]);

  const addTask = (newTask) => {
    setTasks((prev) => [
      {
        ...newTask,
        id: Date.now().toString(),
        isCompleted: false,
        priority: newTask.priority || 'media',
      },
      ...prev,
    ]);
  };

  const toggleTaskCompletion = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, toggleTaskCompletion, deleteTask, isLoaded }}>
      {children}
    </TaskContext.Provider>
  );
};
