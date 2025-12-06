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
  
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const [hasCheckedOnboarding, setHasCheckedOnboarding] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Bước 1: Check token và user khi app khởi động
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token && !user && !isLoading) {
          await dispatch(checkTokenAndGetUser());
        }
        setHasCheckedAuth(true);
      } catch (error) {
        console.error('OnboardingChecker - Error checking auth:', error);
        setHasCheckedAuth(true);
      }
    };
    
    if (!hasCheckedAuth) {
      checkAuth();
    }
  }, [hasCheckedAuth, user, isLoading, dispatch]);

  // Reset checks khi user thay đổi
  useEffect(() => {
    const userId = user?._id || user?.user_id;
    
    if (userId && userId !== currentUserId) {
      setCurrentUserId(userId);
      setHasCheckedOnboarding(false);
    } else if (!userId && currentUserId) {
      setCurrentUserId(null);
      setHasCheckedOnboarding(false);
    }
  }, [user, currentUserId]);

  // Bước 2: Check onboarding khi có user
  useEffect(() => {
    if (user && !hasCheckedOnboarding && !loading) {
      const userId = user._id || user.user_id;
      if (userId) {
        dispatch(checkOnboardingStatus(userId));
        setHasCheckedOnboarding(true);
      }
    }
  }, [user, hasCheckedOnboarding, loading, dispatch]);

  // Bước 3: Redirect logic - CHỈ CHECK ONBOARDING
  useEffect(() => {
    if (!hasCheckedAuth || loading || isLoading) {
      return;
    }

    const currentPath = segments.join('/');
    const inAuth = segments[0] === '(auth)';
    const inOnboarding = segments[0] === 'onboarding';
    const isGetNutriGoal = currentPath === 'onboarding/GetNutriGoal';
    const inTabs = segments[0] === '(tabs)';
    const isIndex = currentPath === '' || currentPath === 'index';

    // Case 1: Không có user -> Login
    if (!user || !isAuthenticated) {
      if (!inAuth && !isIndex) {
        router.replace('/(auth)/Login');
      } else if (isIndex) {
        setTimeout(() => {
          router.replace('/(auth)/Login');
        }, 100);
      }
      return;
    }

    // Case 2: Có user nhưng chưa check onboarding -> đợi
    if (!hasCheckedOnboarding) {
      return;
    }

    // Case 3: Chưa complete onboarding -> Onboarding
    if (isOnboardingCompleted === false) {
      if (!inOnboarding) {
        router.replace('/onboarding');
      }
      return;
    }

    // Case 4: Đã complete onboarding -> KHÔNG REDIRECT NẾU ĐANG Ở GetNutriGoal
    if (isOnboardingCompleted === true || isOnboardingCompleted === null) {
      // Không redirect nếu đang ở GetNutriGoal
      if (isGetNutriGoal) {
        console.log('OnboardingChecker - At GetNutriGoal, skipping redirect');
        return;
      }
      
      // HomeScreen sẽ tự check nutrition goals
      if (inAuth || inOnboarding || isIndex) {
        router.replace('/(tabs)');
      }
      return;
    }

  }, [
    hasCheckedAuth,
    loading, 
    isLoading, 
    user, 
    isAuthenticated, 
    isOnboardingCompleted, 
    hasCheckedOnboarding,
    segments, 
    router
  ]);

  return null;
}
