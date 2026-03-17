import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { TaskProvider } from './src/context/TaskContext';
import { ThemeProvider } from './src/context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <AppNavigator />
      </TaskProvider>
    </ThemeProvider>
  );
}
