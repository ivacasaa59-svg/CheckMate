import { StyleSheet, Text, View } from 'react-native';

export default function AddTaskScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nueva Tarea</Text>
      <Text>Aquí irá el formulario para crear una tarea.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  }
});
