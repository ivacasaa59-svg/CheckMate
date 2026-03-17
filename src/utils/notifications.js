import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configurar cómo se comportan las notificaciones cuando la app está abierta (foreground)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Solicita permisos al usuario para mostrar notificaciones.
 * Debe llamarse idealmente cuando se inicia la app o justo antes de programar la primera.
 */
export async function requestNotificationPermissions() {
  if (Platform.OS === 'web') return false; // Not supported on current web setup simply

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

/**
 * Programa una notificación local para una fecha específica.
 * @param {string} title Título de la notificación
 * @param {string} body Cuerpo del mensaje
 * @param {Date} date Fecha exacta a la que debe dispararse
 */
export async function scheduleTaskNotification(title, body, date) {
  if (Platform.OS === 'web') return; // Notificaciones locales de Expo no soportadas en web de esta forma

  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return;

  // Solo programar si la fecha está en el futuro
  if (date.getTime() <= Date.now()) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
    },
    trigger: date, // Disparo exacto en la fecha indicada
  });
}
