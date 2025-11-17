import { useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';

export default function IndexScreen() {
  const router = useRouter();

  useEffect(() => {
    // Fallback sau 3 giây nếu OnboardingChecker không redirect
    const timer = setTimeout(() => {
      router.replace('/(auth)/Login');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: '#F7F1E5' 
    }}>
      <ActivityIndicator size="large" color="#35A55E" />
      <Text style={{ marginTop: 20, color: '#666', textAlign: 'center' }}>
        Đang kiểm tra trạng thái đăng nhập...
      </Text>
    </View>
  );
}
