import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function OnboardingLayout() {
  return (
    <>
    <StatusBar style='light'/>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="SelectType" options={{ headerShown: false }} />
      <Stack.Screen name="FamilyMember" options={{ headerShown: false }} />
      <Stack.Screen name="Gender" options={{ headerShown: false }} />
      <Stack.Screen name="Age" options={{ headerShown: false }} />
      <Stack.Screen name="Height" options={{ headerShown: false }} />
      <Stack.Screen name="Weight" options={{ headerShown: false }} />
      <Stack.Screen name="SelectDietType" options={{ headerShown: false }} />
      <Stack.Screen name="GetNutriGoal" options={{ headerShown: false }} />
    </Stack></>
  );
}
