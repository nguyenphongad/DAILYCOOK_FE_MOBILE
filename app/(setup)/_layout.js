import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function SetupLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ 
            headerTitle: "Thiết lập",
            headerStyle: {
              backgroundColor: '#FFFFFF',
            },
            headerTintColor: '#2c3e50',
          }} 
        />
      </Stack>
    </>
  );
}
