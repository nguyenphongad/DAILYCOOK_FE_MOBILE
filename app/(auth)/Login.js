import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  // Animation cho các phần tử trong login screen
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const bottomSectionAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    // Chạy animation khi component mount
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        delay: 100,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
        delay: 100,
      }),
      Animated.timing(bottomSectionAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
        delay: 200,
      }),
    ]).start();
  }, []);

  const handleGoogleLogin = () => {
    // Tạm thời chỉ điều hướng đến home mà không thực sự đăng nhập
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Phần hình ảnh phía trên không bị mờ */}
      <View style={styles.topSection}>
        <Image
          source={require('../../assets/images/image_top.jpg')}
          style={styles.backgroundImage}
        />
        
        {/* Thêm lớp phủ màu đen đen */}
        <View style={styles.darkOverlay} />
        
        <Animated.View 
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>DAILY COOK</Text>
          <Text style={styles.subtitle}>Thực đơn nhà mình</Text>
        </Animated.View>

        {/* Thay thế LinearGradient bằng View có màu nền */}
        <View style={styles.overlayBottom} />
      </View>

      <Animated.View 
        style={[
          styles.bottomSection,
          {
            transform: [{ translateY: bottomSectionAnim }],
            opacity: fadeAnim
          }
        ]}
      >
        <View style={styles.loginContainer}>
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <View style={styles.loginLabelContainer}>
              <Text style={styles.loginLabel}>ĐĂNG NHẬP</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleLogin}
            activeOpacity={0.8} // Thêm feedback khi nhấn nút
          >
            <Image
              source={require('../../assets/images/google_icon.png')}
              style={styles.googleIcon}
            />
            <Text style={styles.googleText}>Đăng nhập bằng Google</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#35A55E',
  },
  topSection: {
    height: '100%',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 0,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  // Thêm lớp phủ màu đen đen
  darkOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu đen với độ trong suốt 0.5
    zIndex: 1, // Đảm bảo lớp phủ nằm trên hình ảnh
  },
  contentContainer: {
    alignItems: 'center',
    position: 'absolute',
    top: '15%',
    width: '100%',
    zIndex: 2, // Tăng zIndex để đảm bảo content hiện lên trên lớp phủ đen
  },
  logoContainer: {
    width: 120,
    height: 120,
    backgroundColor: 'transparent', // Bỏ nền trắng
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center', // Đảm bảo căn giữa text
    marginBottom: 10, // Thêm margin để tạo khoảng cách với các phần tử khác
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '29%', 
    backgroundColor: '#35A55E',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 25,
    paddingVertical: 30,
    zIndex: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
  },
  loginContainer: {
    width: '100%',
    marginTop: 10,
  },
  dividerContainer: {
    position: 'relative',
    width: '100%',
    alignItems: 'center',
    marginBottom: 25,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.3)',
    position: 'absolute', // Thay đổi thành absolute
    top: 12, // Đặt vị trí của đường gạch ngang tại giữa của label
  },
  loginLabelContainer: {
    paddingHorizontal: 20,
    backgroundColor: '#35A55E',
    zIndex: 1, // Thêm zIndex để đảm bảo text hiện lên trên đường gạch ngang
  },
  loginLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingVertical: 14,
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  }
});