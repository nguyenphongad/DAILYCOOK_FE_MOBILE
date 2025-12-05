import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

export default function SplashScreen() {
  useEffect(() => {
    // Giảm thời gian xuống 2 giây
    const timer = setTimeout(() => {
      router.push('/(auth)/Login'); // Chuyển đến index để OnboardingChecker xử lý
    }, 10000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.contentWrapper}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/images/logo_new2.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        
        {/* <Text style={styles.title}>DAILY COOK</Text> */}
        {/* <Text style={styles.subtitle}>Thực đơn nhà mình</Text> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({ 
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#11bc5e',  
  },
  contentWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    // width: 130,
    // height: 130,
    // backgroundColor: '#11bc5e',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 270,
    height: 270,
    // borderRadius: 200,
    backgroundColor: '#11bc5e',
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 2,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: '#000',
  }
});