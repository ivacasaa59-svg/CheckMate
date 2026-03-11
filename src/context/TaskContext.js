import React, { createContext, useState, useContext } from 'react';

// Crear el contexto
const TaskContext = createContext();

// Hook personalizado para usar el contexto más fácilmente
export const useTasks = () => {
  return useContext(TaskContext);
};

// Proveedor del contexto
export const TaskProvider = ({ children }) => {
  // Estado inicial con las tareas de prueba
  const [tasks, setTasks] = useState([
    {
      id: '1',
      title: 'Comprar víveres',
      description: 'Leche, huevos, pan, vegetales para la semana.',
      isCompleted: false,
      date: 'Mañana, 10:00 AM'
    },
    {
      id: '2',
      title: 'Terminar el proyecto de React Native',
      description: 'Implementar el componente de la lista de tareas y crear el diseño visual de cada tarea.',
      isCompleted: true,
      date: 'Hoy'
    },
    {
      id: '3',
      title: 'Llamar al médico',
      description: 'Programar cita anual.',
      isCompleted: false,
      date: 'Viernes, 3:00 PM'
    },
    {
      id: '4',
      title: 'Hacer ejercicio',
      description: 'Rutina de cardio y pesas por 45 minutos.',
      isCompleted: false,
      date: '' 
    }
  ]);

  // Función para agregar una nueva tarea
  const addTask = (newTask) => {
    setTasks((prevTasks) => [
      ...prevTasks,
      {
        ...newTask,
        id: Math.random().toString(), // Generar un ID simple
        isCompleted: false,
      }
    ]);
  };

  // Función para alternar el estado de completado
  const toggleTaskCompletion = (id) => {
    setTasks((prevTasks) => 
      prevTasks.map(task => 
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };

  // Función para eliminar una tarea
  const deleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter(task => task.id !== id));
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, toggleTaskCompletion, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};
