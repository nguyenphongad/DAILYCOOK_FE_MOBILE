import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { Button, YStack, H2, Paragraph } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { nextStep, setOnboardingType } from '../../redux/slice/surveySlice';
import HeaderComponent from '../../components/header/HeaderComponent';
import ButtonComponent from '../../components/button/ButtonComponent';

export default function SelectType() {
  const [selectedType, setSelectedType] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();

  const accountTypes = [
    {
      value: 'family',
      title: 'Gia đình',
      icon: '👨‍👩‍👧‍👦',
      description: 'Quản lý dinh dưỡng cho nhiều thành viên trong gia đình. Theo dõi nhu cầu dinh dưỡng khác nhau theo độ tuổi, giúp lập thực đơn phù hợp với từng người.',
      color: '#FF6B6B'
    },
    {
      value: 'personal',
      title: 'Cá nhân',
      icon: '👤',
      description: 'Kiểm soát cân nặng và dinh dưỡng cá nhân một cách hiệu quả. Theo dõi lượng calo, protein, carb và các chất dinh dưỡng cần thiết cho bản thân.',
      color: '#4ECDC4'
    }
  ];

  const handleNext = () => {
    if (selectedType) {
      console.log('Selected account type:', selectedType);
      
      // Lưu type vào Redux
      dispatch(setOnboardingType(selectedType));
      dispatch(nextStep());
      
      // Redirect dựa trên loại tài khoản
      if (selectedType === 'family') {
        router.push('/onboarding/FamilyMember');
      } else {
        router.push('/onboarding/Gender');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderComponent />
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <H2 style={styles.title}>Chọn loại quản lý thành viên</H2>
          <Paragraph style={styles.subtitle}>
            Chọn cách bạn muốn sử dụng ứng dụng để có trải nghiệm tốt nhất
          </Paragraph>
        </View>

        {/* Account Type Options */}
        <View style={styles.optionsContainer}>
          {accountTypes.map((type) => (
            <TouchableOpacity
              key={type.value}
              style={[
                styles.typeOption,
                selectedType === type.value && [styles.selectedOption, { borderColor: type.color }]
              ]}
              onPress={() => setSelectedType(type.value)}
              activeOpacity={0.7}
            >
              <View style={styles.optionHeader}>
                <View style={styles.optionLeft}>
                  <Text style={styles.typeIcon}>{type.icon}</Text>
                  <Text style={[
                    styles.typeTitle,
                    selectedType === type.value && { color: type.color }
                  ]}>
                    {type.title}
                  </Text>
                </View>
                
                {/* Check icon */}
                <View style={[
                  styles.checkContainer,
                  selectedType === type.value && [styles.checkedContainer, { backgroundColor: type.color }]
                ]}>
                  {selectedType === type.value && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
              </View>
              
              {/* Description */}
              <Text style={styles.typeDescription}>
                {type.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Continue Button */}
        <View style={styles.bottomContainer}>
          <ButtonComponent
            enableBack={false}
            onNext={handleNext}
            disableNext={!selectedType}
          />

          <Paragraph textAlign="center" color="$gray8" fontSize="$3" marginTop="$2">
            Bước 1/5
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
  },
  header: {
    paddingTop: 0,
    marginBottom: 30,
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
    gap: 20,
  },
  typeOption: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    backgroundColor: '#F8F9FF',
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  typeIcon: {
    fontSize: 28,
    marginRight: 16,
  },
  typeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
  },
  typeDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginLeft: 44, // Align with title (icon width + margin)
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
  continueButton: {
    width: '100%',
  },
});
