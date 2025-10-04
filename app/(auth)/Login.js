import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
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
        
        {/* Thay thế LinearGradient bằng View có màu nền */}
        <View style={styles.overlayBottom} />
      </View>
      
      <View style={styles.bottomSection}>
        {/* Logo và text đặt ở giữa màn hình theo chiều dọc */}
        <View style={styles.contentContainer}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/images/logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          
          <Text style={styles.title}>DAILY COOK</Text>
          <Text style={styles.subtitle}>Thực đơn nhà mình</Text>
        </View>
        
        <View style={styles.loginContainer}>
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <View style={styles.loginLabelContainer}>
              <Text style={styles.loginLabel}>Đăng nhập</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.googleButton}
            onPress={handleGoogleLogin}
          >
            <Image 
              source={require('../../assets/images/google_icon.png')}
              style={styles.googleIcon}
            />
            <Text style={styles.googleText}>Đăng nhập bằng Google</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  overlayBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 50,
    backgroundColor: '#35A55E',
    opacity: 0.95,
  },
  bottomSection: {
    flex: 1,
    backgroundColor: '#35A55E',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 50,
    opacity: 0.85,
    zIndex: 1,
    // Thay đổi justifyContent từ space-between để logo và title ở giữa màn hình
    justifyContent: 'center', 
    marginTop: 300
  },
  contentContainer: {
    alignItems: 'center',
    // Đặt logo và tiêu đề ở giữa màn hình theo chiều dọc
    // marginBottom: height * 0.1, // Đẩy lên một chút từ chính giữa
  },
  logoContainer: {
    width: 150,
    height: 500,
    // backgroundColor: '#FFFFFF',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom: -20,
    marginTop: -480,
    // Bỏ border mờ bằng cách thêm shadow nhỏ hơn
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,
  },
  logo: {
    width: 120,
    height: 120,
    // borderRadius: 200,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: -150,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600', // Đậm hơn
    color: '#FFFFFF',
    marginTop:-10,
  },
  loginContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 80,
    left: 40,
    right: 40,
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
  },
  loginLabelContainer: {
    position: 'absolute',
    top: -15, // Điều chỉnh vị trí để phù hợp với text size lớn hơn
    paddingHorizontal: 20,
    backgroundColor: 'transparent', // Nền trong suốt
  },
  loginLabel: {
    fontSize: 22, // To hơn
    fontWeight: '700', // Đậm hơn
    color: '#FFFFFF',
    textAlign: 'center',
    // Thêm shadow để text nổi bật hơn trên nền trong suốt
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    paddingVertical: 14, // Cao hơn một chút
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