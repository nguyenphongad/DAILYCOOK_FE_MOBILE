import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';

type SplashScreenProps = {
  onFinish: () => void;
};

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const fadeAnim = new Animated.Value(0);
  
  useEffect(() => {
    // Animation fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    
    // Chuyển hướng sau 3 giây - CHỈ gọi onFinish và để _layout.tsx xử lý việc chuyển hướng
    const timer = setTimeout(() => {
      onFinish(); // Gọi callback để thông báo splash đã kết thúc
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [onFinish]);
  
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
        {/* Logo trong hình vuông bo tròn */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/images/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        
        {/* Tên ứng dụng */}
        <Text style={styles.title}>DAILY COOK</Text>
        
        {/* Slogan */}
        <Text style={styles.subtitle}>Thực đơn nhà mình</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#35A55E',
  },
  logoContainer: {
    width: 130,
    height: 130,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: '#FFFFFF',
  }
});
   