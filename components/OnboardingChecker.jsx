import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkOnboardingStatus } from '../redux/thunk/surveyThunk';

export function OnboardingChecker() {
  const dispatch = useDispatch();
  const router = useRouter();
  const segments = useSegments();
  
  const { isOnboardingCompleted, loading } = useSelector(state => state.survey);
  const { user, isLogin } = useSelector(state => state.auth);
  
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const [authToken, setAuthToken] = useState(null);

  // Lấy token từ AsyncStorage
  useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem('authToken');
      setAuthToken(token);
    };
    getToken();
  }, []);

  useEffect(() => {
    if (!hasCheckedAuth && authToken !== null) {
      checkAuthAndOnboarding();
    }
  }, [hasCheckedAuth, authToken, user]); // Thêm user vào dependency

  // Chỉ redirect khi đã có dữ liệu hoàn chỉnh
  useEffect(() => {
    if (isInitialized && !loading && hasCheckedAuth && authToken !== null) {
      const inAuthGroup = segments[0] === '(auth)';
      const inOnboardingGroup = segments[0] === 'onboarding';
      const inTabsGroup = segments[0] === '(tabs)';

      // Kiểm tra trạng thái authenticated dựa trên token và user
      const isAuthenticated = !!(authToken && user);

      console.log('OnboardingChecker - Current state:', {
        isLogin,
        isAuthenticated,
        authToken: !!authToken,
        isOnboardingCompleted,
        segments,
        inAuthGroup,
        inOnboardingGroup,
        inTabsGroup,
        user: !!user
      });

      // Nếu không có token hoặc không có user, redirect tới auth
      if (!authToken || !user) {
        if (!inAuthGroup) {
          console.log('Redirecting to login - no token or user');
          router.replace('/(auth)/Login');
        }
        return;
      }

      // Nếu có token và user nhưng chưa hoàn thành onboarding
      if (authToken && user && isOnboardingCompleted === false) {
        if (!inOnboardingGroup) {
          console.log('Redirecting to onboarding');
          router.replace('/onboarding');
        }
        return;
      }

      // Nếu có token và user và đã hoàn thành onboarding
      if (authToken && user && isOnboardingCompleted === true) {
        if (!inTabsGroup) {
          console.log('Redirecting to tabs');
          router.replace('/(tabs)');
        }
        return;
      }
    }
  }, [isLogin, isOnboardingCompleted, loading, isInitialized, segments, hasCheckedAuth, user, authToken]);

  const checkAuthAndOnboarding = async () => {
    try {
      console.log('OnboardingChecker - Token exists:', !!authToken);
      console.log('OnboardingChecker - User exists:', !!user);
      
      if (!authToken) {
        console.log('OnboardingChecker - No token, should redirect to login');
        setIsInitialized(true);
        setHasCheckedAuth(true);
        return;
      }

      // Nếu có token nhưng không có user trong Redux, đợi user load
      if (authToken && !user) {
        console.log('OnboardingChecker - Has token but no user, waiting for user to load...');
        // Đợi 500ms rồi thử lại
        setTimeout(() => {
          if (user) {
            checkAuthAndOnboarding();
          } else {
            console.log('OnboardingChecker - Still no user after waiting, marking as initialized');
            setIsInitialized(true);
            setHasCheckedAuth(true);
          }
        }, 500);
        return;
      }

      // Nếu có token và có user, LUÔN gọi API check onboarding status
      if (authToken && user) {
        const userId = user._id || user.user_id;
        
        console.log('OnboardingChecker - Always checking onboarding for user:', userId);
        
        if (userId) {
          const result = await dispatch(checkOnboardingStatus(userId));
          console.log('OnboardingChecker - API result:', result);
        }
      }
      
      setHasCheckedAuth(true);
      setIsInitialized(true);
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsInitialized(true);
      setHasCheckedAuth(true);
    }
  };

  // Lắng nghe force recheck từ login
  useEffect(() => {
    const checkForceRecheck = async () => {
      const forceRecheckTime = await AsyncStorage.getItem('forceRecheck');
      if (forceRecheckTime) {
        await AsyncStorage.removeItem('forceRecheck');
        // Reset states và check lại
        setHasCheckedAuth(false);
        setIsInitialized(false);
        
        // Lấy token mới
        const newToken = await AsyncStorage.getItem('authToken');
        setAuthToken(newToken);
      }
    };

    const interval = setInterval(checkForceRecheck, 500);
    return () => clearInterval(interval);
  }, []);

  return null;
}
