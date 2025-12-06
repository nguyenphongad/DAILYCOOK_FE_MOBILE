import { useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';

export default function IndexScreen() {
  const router = useRouter();
  const { user, isLoading } = useSelector(state => state.auth);
  const { isOnboardingCompleted, loading } = useSelector(state => state.survey);

  useEffect(() => {
    // Fallback timeout - nếu sau 3 giây vẫn chưa redirect thì tự động xử lý
    const timeout = setTimeout(() => {
      if (!user) {
        router.replace('/(auth)/Login');
      } else if (isOnboardingCompleted === false) {
        router.replace('/onboarding');
      } else {
        router.replace('/(tabs)');
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [user, isOnboardingCompleted, router]);

  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: '#F7F1E5' 
    }}>
      <ActivityIndicator size="large" color="#35A55E" />
      <Text style={{ marginTop: 20, color: '#666', textAlign: 'center' }}>
        Đang khởi tạo...
      </Text>
      
      {/* Debug info */}
      {__DEV__ && (
        <View style={{ marginTop: 20, padding: 10 }}>
          <Text style={{ fontSize: 10, color: '#999' }}>
            User: {user ? 'Yes' : 'No'}
          </Text>
          <Text style={{ fontSize: 10, color: '#999' }}>
            Auth Loading: {isLoading ? 'Yes' : 'No'}
          </Text>
          <Text style={{ fontSize: 10, color: '#999' }}>
            Survey Loading: {loading ? 'Yes' : 'No'}
          </Text>
          <Text style={{ fontSize: 10, color: '#999' }}>
            Onboarding: {isOnboardingCompleted === null ? 'null' : isOnboardingCompleted ? 'completed' : 'not completed'}
          </Text>
        </View>
      )}
    </View>
  );
}
