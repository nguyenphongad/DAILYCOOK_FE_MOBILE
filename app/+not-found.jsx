import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>404 - Route Not Found</Text>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.replace('/onboarding/SelectTypeAccount')}
      >
        <Text style={styles.buttonText}>Go to SelectTypeAccount</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: '#E86F50' }]}
        onPress={() => router.replace('/(auth)/Login')}
      >
        <Text style={styles.buttonText}>Go to Login</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: '#4A90E2' }]}
        onPress={() => router.replace('/(tabs)')}
      >
        <Text style={styles.buttonText}>Go to Tabs</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F7F1E5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#35A55E',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    minWidth: 200,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
