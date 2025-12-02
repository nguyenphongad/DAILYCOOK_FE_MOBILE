import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkOnboardingStatus } from '../redux/thunk/surveyThunk';
import { checkTokenAndGetUser } from '../redux/thunk/authThunk';

export function OnboardingChecker() {
  const dispatch = useDispatch();
  const router = useRouter();
  const segments = useSegments();
  
  const { isOnboardingCompleted, loading } = useSelector(state => state.survey);
  const { user, isAuthenticated, isLoading } = useSelector(state => state.auth);
  
  const [hasChecked, setHasChecked] = useState(false);
  const [hasCheckedOnboarding, setHasCheckedOnboarding] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [hasInitialRedirected, setHasInitialRedirected] = useState(false);

  // Bước 1: Check token và user khi app khởi động - CHỈ 1 LẦN
  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('authToken');
      
      if (token && !user && !isLoading) {
        dispatch(checkTokenAndGetUser());
      }
      setHasChecked(true);
    };
    
    if (!hasChecked) {
      checkAuth();
    }
  }, [hasChecked, user, isLoading, dispatch]);

  // Reset onboarding check khi user thay đổi
  useEffect(() => {
    const userId = user?._id || user?.user_id;
    
    if (userId && userId !== currentUserId) {
      console.log('User changed from', currentUserId, 'to', userId, '- Reset onboarding check');
      setCurrentUserId(userId);
      setHasCheckedOnboarding(false);
      setHasInitialRedirected(false); // Reset redirect flag khi user thay đổi
    }
  }, [user, currentUserId]);

  // Bước 2: Check onboarding khi có user - CHỈ 1 LẦN cho mỗi user
  useEffect(() => {
    if (user && !hasCheckedOnboarding && !loading) {
      const userId = user._id || user.user_id;
      if (userId) {
        console.log('Checking onboarding status for user:', userId);
        dispatch(checkOnboardingStatus(userId));
        setHasCheckedOnboarding(true);
      }
    }
  }, [user, hasCheckedOnboarding, loading, dispatch]);

  // Bước 3: Redirect dựa trên state - CHỈ KHI CẦN THIẾT
  useEffect(() => {
    // Chỉ redirect khi:
    // 1. Đã check xong auth và onboarding
    // 2. Chưa redirect lần đầu
    // 3. Không đang loading
    if (!hasChecked || loading || isLoading || hasInitialRedirected) return;

    const currentPath = segments.join('/');
    const inAuth = segments[0] === '(auth)';
    const inOnboarding = segments[0] === 'onboarding';
    const inTabs = segments[0] === '(tabs)';
    const isNotFound = segments[0] === '+not-found';
    const isIndex = currentPath === '' || currentPath === 'index';

    // Chỉ log khi cần redirect
    const needsRedirect = 
      (!user && !inAuth) || 
      (user && isOnboardingCompleted === false && !inOnboarding) || 
      (user && isOnboardingCompleted === true && !inTabs && !isIndex);

    if (needsRedirect) {
      console.log('OnboardingChecker - Redirect needed:', {
        hasChecked,
        loading,
        isLoading,
        user: !!user,
        isAuthenticated,
        isOnboardingCompleted,
        currentPath,
        inAuth,
        inOnboarding,
        inTabs,
        hasInitialRedirected
      });
    }

    // Skip redirect nếu đang ở not-found
    if (isNotFound) return;

    // Không có user -> Login
    if (!user || !isAuthenticated) {
      if (!inAuth) {
        console.log('Redirecting to login - no user');
        setHasInitialRedirected(true);
        router.replace('/(auth)/Login');
      }
      return;
    }

    // Nếu có user, cần đợi onboarding check hoàn thành
    if (!hasCheckedOnboarding) return;

    // Chưa complete onboarding -> Onboarding
    if (isOnboardingCompleted === false) {
      if (!inOnboarding) {
        console.log('Redirecting to onboarding - not completed');
        setHasInitialRedirected(true);
        router.replace('/onboarding');
      }
      return;
    }

    // Đã complete onboarding -> Home (chỉ khi đang ở trang không phù hợp)
    if (isOnboardingCompleted === true) {
      if (inAuth || inOnboarding || isIndex) {
        console.log('Redirecting to home - completed');
        setHasInitialRedirected(true);
        router.replace('/(tabs)');
      }
      return;
    }
  }, [
    hasChecked, 
    loading, 
    isLoading, 
    user, 
    isAuthenticated, 
    isOnboardingCompleted, 
    hasCheckedOnboarding,
    hasInitialRedirected,
    segments, 
    router
  ]);

  return null;
}
