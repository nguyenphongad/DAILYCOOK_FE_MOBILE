import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    SafeAreaView, 
    Image,
    ToastAndroid,
    Platform,
    Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function NotFoundScreen() {
  const router = useRouter();

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.content}>
        {/* Main content */}
        <View style={styles.mainContent}>
          {/* 404 Image */}
          <View style={styles.imageContainer}>
            <Image
              source={require('../assets/images/404.png')}
              style={styles.errorImage}
              resizeMode="contain"
            />
          </View>

          {/* Error text */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>Oops!</Text>
            <Text style={styles.subtitle}>Trang bạn đang tìm kiếm không tồn tại</Text>
            <Text style={styles.description}>
              Có thể đường dẫn đã bị thay đổi hoặc trang đã bị xóa.
            </Text>
          </View>
        </View>

        {/* Bottom section với nút back lớn */}
        <View style={styles.bottomSection}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleGoBack}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={20} color="white" style={styles.buttonIcon} />
            <Text style={styles.primaryButtonText}>Quay lại trang trước</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F1E5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '500',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  imageContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  errorImage: {
    width: 280,
    height: 280,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34495E',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomSection: {
    paddingBottom: 60,
    paddingTop: 20,
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: '#35A55E',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonIcon: {
    marginRight: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
