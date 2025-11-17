import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { TamaguiProvider } from 'tamagui';
import tamaguiConfig from '../tamagui.config';
import 'react-native-reanimated';
import { PortalProvider } from '@tamagui/portal';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../redux/store';
import { OnboardingChecker } from '../components/OnboardingChecker';

// Cấu hình thông báo với các kiểu dữ liệu đầy đủ theo yêu cầu TypeScript
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
    priority: Notifications.AndroidNotificationPriority.HIGH
  }),
});

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

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // Thiết lập thông báo - đơn giản hóa
  useEffect(() => {
    async function setupNotifications() {
      try {
        // Android-specific channel setup
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('water-reminder', {
            name: 'Nhắc nhở uống nước',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#35A55E',
            sound: 'default',
          });
        }
      } catch (error) {
        console.log('Error setting up notifications:', error);
      }
    }
    
    setupNotifications();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  // Trả về navigation layout để điều hướng bình thường
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <TamaguiProvider config={tamaguiConfig}>
          <PortalProvider>
            <ThemeProvider value={customLightTheme}>
              <StatusBar style="dark" />
              <OnboardingChecker />
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="onboarding" options={{ headerShown: false }} />
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
          </PortalProvider>
        </TamaguiProvider>
      </PersistGate>
    </Provider>
  );
}