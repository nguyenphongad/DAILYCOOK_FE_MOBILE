import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { Button, YStack, H2, Paragraph } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { nextStep, prevStep } from '../../redux/slice/surveySlice';
import HeaderComponent from '../../components/header/HeaderComponent';
import ButtonComponent from '../../components/button/ButtonComponent';

export default function GenderScreen() {
  const [gender, setGender] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();

  const genderOptions = [
    { 
      value: 'male', 
      label: 'Nam', 
      icon: '👨',
      color: '#4A90E2'
    },
    { 
      value: 'female', 
      label: 'Nữ', 
      icon: '👩',
      color: '#E94B8C'
    },
    { 
      value: 'other', 
      label: 'Khác', 
      icon: '🌈',
      color: '#9B59B6'
    }
  ];

  const handleComplete = () => {
    if (gender) {
      dispatch(nextStep());
      router.push('/onboarding/Age');
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
        {/* Header - Top Left */}
        <View style={styles.header}>
          <H2 style={styles.title}>Giới tính</H2>
          <Paragraph style={styles.subtitle}>
            Chúng tôi sẽ sử dụng thông tin này để tính toán nhu cầu năng lượng hàng ngày của bạn
          </Paragraph>
        </View>

        {/* Gender Options - Center */}
        <View style={styles.optionsContainer}>
          {genderOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.genderOption,
                gender === option.value && styles.selectedOption
              ]}
              onPress={() => setGender(option.value)}
              activeOpacity={0.7}
            >
              <View style={styles.genderContent}>
                <View style={styles.genderLeft}>
                  <Text style={styles.genderIcon}>{option.icon}</Text>
                  <Text style={[
                    styles.genderLabel,
                    gender === option.value && styles.selectedLabel
                  ]}>
                    {option.label}
                  </Text>
                </View>
                
                {/* Check icon */}
                <View style={[
                  styles.checkContainer,
                  gender === option.value && [styles.checkedContainer, { backgroundColor: option.color }]
                ]}>
                  {gender === option.value && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Continue Button - Bottom */}
        <View style={styles.bottomContainer}>
          <ButtonComponent
            enableBack={true}
            onBack={handleBack}
            onNext={handleComplete}
            disableNext={!gender}
          />

          <Paragraph textAlign="center" color="$gray8" fontSize="$3" marginTop="$2">
            Bước 2/5
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
    paddingTop: 50, 
  },
  header: {
    paddingTop: 20,
    marginBottom: 40,
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
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
  },
  genderOption: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    backgroundColor: '#F0F8FF',
    borderColor: '#4A90E2',
  },
  genderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  genderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  genderIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  genderLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  selectedLabel: {
    color: '#4A90E2',
  },
  checkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedContainer: {
    borderColor: 'transparent',
  },
  bottomContainer: {
    paddingBottom: 40,
  },
});
