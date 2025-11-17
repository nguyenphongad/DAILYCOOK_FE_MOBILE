import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Alert, Linking, ToastAndroid, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '../../config/supabase';
import { loginWithGoogleTokens, getCurrentSession } from '../../redux/thunk/authThunk';
import { selectAuth, selectError, clearError, setAuthState, setLoading } from '../../redux/slice/authSlice';
import LoadingComponent from '../../components/loading/LoadingComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector(selectAuth);
  const error = useSelector(selectError);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const bottomSectionAnim = useRef(new Animated.Value(100)).current;

  // Kiểm tra session khi app khởi động
  useEffect(() => {
    dispatch(getCurrentSession());
  }, []);

  // Redirect nếu đã đăng nhập - BỎ LOGIC NÀY RA
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     router.replace('/(tabs)');
  //   }
  // }, [isAuthenticated]);

  // Hiển thị lỗi
  useEffect(() => {
    if (error) {
      Alert.alert('Lỗi đăng nhập', error, [
        { text: 'OK', onPress: () => dispatch(clearError()) }
      ]);
    }
  }, [error]);

  // Animations
  useEffect(() => {
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

  // Thêm useEffect này để handle deep link callback
  useEffect(() => {
    const handleDeepLink = async (event) => {
      const url = event.url;

      if (url && url.includes('access_token=')) {
        try {
          const params = new URLSearchParams(url.split('#')[1]);
          const access_token = params.get('access_token');
          const refresh_token = params.get('refresh_token');

          if (access_token) {
            const result = await dispatch(loginWithGoogleTokens({
              access_token,
              refresh_token,
            })).unwrap();

            console.log('Login Success:', result);

            ToastAndroid.show(
              `Đăng nhập thành công! Hi ${result.user.fullName || result.user.email} 👋`,
              ToastAndroid.LONG
            );

            setTimeout(() => {
              router.replace('/');
            }, 500);
          }
        } catch (error) {
          console.error('Login Error:', error);
          dispatch(setLoading(false));

          if (Platform.OS === 'android') {
            ToastAndroid.show('Không thể xử lý đăng nhập: ' + error, ToastAndroid.SHORT);
          } else {
            Alert.alert('Lỗi', 'Không thể xử lý đăng nhập: ' + error);
          }
        }
      }
    };

    // Lắng nghe URL changes
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Kiểm tra initial URL khi app vừa mở
    Linking.getInitialURL().then((url) => {
      if (url && url.includes('access_token=')) {
        console.log('Initial URL:', url);
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, [dispatch]);

  const handleGoogleLogin = async () => {
    try {
      dispatch(setLoading(true));

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'dailycook://',
          skipBrowserRedirect: false,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;

      if (data?.url) {
        const supported = await Linking.canOpenURL(data.url);
        if (supported) {
          await Linking.openURL(data.url);
        } else {
          throw new Error('Không thể mở trình duyệt');
        }
      }
    } catch (error) {
      dispatch(setLoading(false));
      Alert.alert('Lỗi', error.message || 'Không thể đăng nhập');
      console.error('Google Login Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.topSection}>
        <Image
          source={require('../../assets/images/image_top.jpg')}
          style={styles.backgroundImage}
        />
        <View style={styles.darkOverlay} />

        <Animated.View
          style={[
            styles.contentContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
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
      </View>

      <Animated.View
        style={[
          styles.bottomSection,
          { transform: [{ translateY: bottomSectionAnim }], opacity: fadeAnim }
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
            style={[styles.googleButton, isLoading && styles.buttonDisabled]}
            onPress={handleGoogleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Image
              source={require('../../assets/images/google_icon.png')}
              style={styles.googleIcon}
            />
            <Text style={styles.googleText}>
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập bằng Google'}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <LoadingComponent visible={isLoading} />
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
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});