import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import CustomSplashScreen from '@/components/SplashScreen';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Customize the default light theme to ensure all elements use white background
const customLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#FFFFFF',
    card: '#FFFFFF',
    text: '#2c3e50',
    border: '#e0e0e0',
    primary: '#3498db',
  },
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });
  const [showSplash, setShowSplash] = useState(true);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  // Xử lý kết thúc splash screen và điều hướng
  const handleSplashFinish = () => {
    setShowSplash(false);
    // Delay một chút để đảm bảo state đã được cập nhật
    setTimeout(() => {
      router.replace('/(auth)/Login');
    }, 100);
  };

  // Hiển thị màn hình Splash khi khởi động
  if (showSplash) {
    return <CustomSplashScreen onFinish={handleSplashFinish} />;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <ThemeProvider value={customLightTheme}>
      {/* Đặt StatusBar style là "dark" để hiển thị chữ đen trên nền trắng */}
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="modal" 
          options={{ 
            presentation: 'modal',
            headerStyle: {
              backgroundColor: '#FFFFFF',
            },
            headerShown: true,
            headerTintColor: '#2c3e50',
          }} 
        />
      </Stack>
    </ThemeProvider>
  );
}
