import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giới thiệu</Text>
      <View style={styles.separator} />
      <Text style={styles.content}>Thông tin giới thiệu về ứng dụng</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  content: {
    fontSize: 16,
    color: '#34495e',
    marginTop: 10,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
    backgroundColor: '#e0e0e0',
  },
});
