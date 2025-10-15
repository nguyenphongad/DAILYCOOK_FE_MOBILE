import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Component HeaderLeft để sử dụng cho nút quay lại
const HeaderLeft = ({ goBack, title, onGoBack }) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleGoBack = () => {
    if (typeof onGoBack === 'function') {
      onGoBack();
    } else {
      router.push(goBack || '/');
    }
  };

  return (
    <TouchableOpacity
      style={[styles.headerLeftContainer, { marginLeft: 10 }]}
      onPress={handleGoBack}
    >
      <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
      {title ? <Text style={styles.headerLeftTitle}>{title}</Text> : null}
    </TouchableOpacity>
  );
};

export default function StackLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right', // Đổi kiểu animation để nhanh hơn
        headerTitleAlign: 'left',
        headerLeft: () => (
          <HeaderLeft
            goBack="/(tabs)"
            title=""
            onGoBack=""
          />
        ),
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
          color: "#fff",
        },
        headerStyle: {
          backgroundColor: '#35A55E',
        },
      }}
    >

      {/* Meal Routes */}
      <Stack.Screen
        name="meals/MealDetail"
        options={{
          title: 'Chi tiết món ăn',
        }}
      />


      {/* các màn hfinh stack ghi ở day toạ router */}
      <Stack.Screen
        name="ingredients/IngredientDetail"
        options={{
          title: 'Chi tiết thực phẩm'
        }}
      />









    </Stack>
  );
}

const styles = StyleSheet.create({
  headerLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLeftTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 5,
    fontWeight: '500',
  }
});
