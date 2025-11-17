import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { Button, Input, YStack, H2, Paragraph, XStack } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { nextStep } from '../../redux/slice/surveySlice';
import HeaderComponent from '../../components/header/HeaderComponent';
import ButtonComponent from '../../components/button/ButtonComponent';

export default function FamilyMemberScreen() {
  const [familyData, setFamilyData] = useState({
    children: '',
    teenagers: '',
    adults: '',
    elderly: ''
  });
  
  const dispatch = useDispatch();
  const router = useRouter();

  const memberTypes = [
    {
      key: 'children',
      label: 'Trẻ em',
      subtitle: '(0-12 tuổi)',
      icon: '👶',
      color: '#FF6B6B'
    },
    {
      key: 'teenagers',
      label: 'Thiếu niên',
      subtitle: '(13-17 tuổi)',
      icon: '👦',
      color: '#4ECDC4'
    },
    {
      key: 'adults',
      label: 'Người lớn',
      subtitle: '(18-59 tuổi)',
      icon: '👨',
      color: '#45B7D1'
    },
    {
      key: 'elderly',
      label: 'Người cao tuổi',
      subtitle: '(60+ tuổi)',
      icon: '👴',
      color: '#96CEB4'
    }
  ];

  const handleUpdateCount = (key, value) => {
    // Chỉ cho phép số từ 0-99
    const numValue = value.replace(/[^0-9]/g, '');
    if (numValue === '' || (parseInt(numValue) >= 0 && parseInt(numValue) <= 99)) {
      setFamilyData(prev => ({
        ...prev,
        [key]: numValue
      }));
    }
  };

  const handleNext = () => {
    // Kiểm tra có ít nhất 1 thành viên
    const totalMembers = Object.values(familyData).reduce((sum, val) => {
      return sum + (parseInt(val) || 0);
    }, 0);

    if (totalMembers > 0) {
      // TODO: Lưu dữ liệu gia đình vào Redux hoặc AsyncStorage
      console.log('Family data:', familyData);
      
      dispatch(nextStep());
      router.push('/onboarding/Gender'); // Bỏ qua thông tin cá nhân cho gia đình
    }
  };

  const getTotalMembers = () => {
    return Object.values(familyData).reduce((sum, val) => {
      return sum + (parseInt(val) || 0);
    }, 0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderComponent />
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <H2 style={styles.title}>Thành viên gia đình</H2>
          <Paragraph style={styles.subtitle}>
            Nhập số lượng thành viên trong từng độ tuổi để chúng tôi tính toán dinh dưỡng phù hợp
          </Paragraph>
        </View>

        {/* Family Member Inputs */}
        <ScrollView 
          style={styles.membersContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.membersContentContainer}
        >
          {memberTypes.map((type) => (
            <View key={type.key} style={styles.memberRow}>
              <View style={styles.memberInfo}>
                <Text style={styles.memberIcon}>{type.icon}</Text>
                <View style={styles.memberLabels}>
                  <Text style={[styles.memberLabel, { color: type.color }]}>
                    {type.label}
                  </Text>
                  <Text style={styles.memberSubtitle}>{type.subtitle}</Text>
                </View>
              </View>
              
              <View style={styles.counterContainer}>
                <TouchableOpacity
                  style={[styles.counterButton, { opacity: familyData[type.key] === '' || parseInt(familyData[type.key]) <= 0 ? 0.3 : 1 }]}
                  onPress={() => {
                    const currentValue = parseInt(familyData[type.key]) || 0;
                    if (currentValue > 0) {
                      handleUpdateCount(type.key, (currentValue - 1).toString());
                    }
                  }}
                  disabled={familyData[type.key] === '' || parseInt(familyData[type.key]) <= 0}
                >
                  <Ionicons name="remove" size={20} color="#666" />
                </TouchableOpacity>
                
                <Input
                  value={familyData[type.key]}
                  onChangeText={(value) => handleUpdateCount(type.key, value)}
                  keyboardType="numeric"
                  textAlign="center"
                  style={styles.counterInput}
                  placeholder="0"
                  maxLength={2}
                />
                
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => {
                    const currentValue = parseInt(familyData[type.key]) || 0;
                    if (currentValue < 99) {
                      handleUpdateCount(type.key, (currentValue + 1).toString());
                    }
                  }}
                >
                  <Ionicons name="add" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Total Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>
            Tổng số thành viên: <Text style={styles.summaryNumber}>{getTotalMembers()}</Text>
          </Text>
        </View>

        {/* Continue Button */}
        <View style={styles.bottomContainer}>
          <ButtonComponent
            enableBack={true}
            onBack={() => {
              // Handle back for family member (về SelectTypeAccount)
              router.back();
            }}
            onNext={handleNext}
            disableNext={getTotalMembers() === 0}
          />

          <Paragraph textAlign="center" color="$gray8" fontSize="$3" marginTop="$2">
            Bước 2/3
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
    paddingTop: 20,
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
  membersContainer: {
    flex: 1,
    paddingVertical: 10,
  },
  membersContentContainer: {
    paddingBottom: 20, // Thêm padding bottom để tạo khoảng trống cuối scroll
  },
  memberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  memberIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  memberLabels: {
    flex: 1,
  },
  memberLabel: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  memberSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  counterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterInput: {
    width: 60,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryContainer: {
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 16,
    color: '#2C3E50',
  },
  summaryNumber: {
    fontWeight: 'bold',
    color: '#35A55E',
    fontSize: 18,
  },
  bottomContainer: {
    paddingBottom: 40,
  },
});
