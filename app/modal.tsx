import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông tin</Text>
      <View style={styles.separator} />
      <Text style={styles.content}>
        Đây là màn hình modal của ứng dụng Daily Cook.
      </Text>

      {/* Luôn sử dụng status bar kiểu light */}
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF', // Đảm bảo nền trắng
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  content: {
    fontSize: 16,
    color: '#34495e',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
    backgroundColor: '#e0e0e0', // Màu phân cách nhẹ
  },
});
