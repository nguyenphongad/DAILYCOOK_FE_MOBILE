import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { Button, Input, YStack, H2, Paragraph } from 'tamagui';
import { prevStep, resetOnboarding } from '../../redux/slice/surveySlice';
import HeaderComponent from '../../components/header/HeaderComponent';
import ButtonComponent from '../../components/button/ButtonComponent';

export default function WeightScreen() {
  const [weight, setWeight] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();

  const handleNext = () => {
    if (weight && weight > 0) {
      // Hoàn thành onboarding
      dispatch(resetOnboarding());
      router.replace('/(tabs)');
    }
  };

  const handleBack = () => {
    dispatch(prevStep());
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderComponent />
      <View style={styles.content}>
        <View style={styles.header}>
          <H2 style={styles.title}>Cân nặng của bạn</H2>
          <Paragraph style={styles.subtitle}>
            Nhập cân nặng để tính toán chính xác nhu cầu dinh dưỡng
          </Paragraph>
        </View>

        <View style={styles.inputContainer}>
          <Input
            placeholder="Nhập cân nặng (kg)"
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
            fontSize="$5"
            textAlign="center"
            style={styles.input}
          />
        </View>

        <View style={styles.bottomContainer}>
          <ButtonComponent
            enableBack={true}
            onBack={handleBack}
            onNext={handleNext}
            nextText="Hoàn thành"
            disableNext={!weight || weight <= 0}
          />

          <Paragraph textAlign="center" color="$gray8" fontSize="$3" marginTop="$2">
            Bước 5/5
          </Paragraph>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F1E5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 80,
    justifyContent: 'space-between',
  },
  header: {
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'left',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'left',
    lineHeight: 22,
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  input: {
    fontSize: 18,
    padding: 20,
  },
  bottomContainer: {
    paddingBottom: 40,
  },
});
