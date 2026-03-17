import React, { useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { TaskProvider } from './src/context/TaskContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { requestNotificationPermissions } from './src/utils/notifications';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  useEffect(() => {
    requestNotificationPermissions().catch(console.warn);
  }, []);
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <TaskProvider>
          <AppNavigator />
        </TaskProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
