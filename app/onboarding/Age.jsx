import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { H2, Paragraph } from 'tamagui';
import { nextStep, prevStep, setPersonalInfo } from '../../redux/slice/surveySlice';
import HeaderComponent from '../../components/header/HeaderComponent';
import ButtonComponent from '../../components/button/ButtonComponent';

const { height: screenHeight } = Dimensions.get('window');

export default function AgeScreen() {
  const [selectedAge, setSelectedAge] = useState(22); // Tuổi mặc định
  const dispatch = useDispatch();
  const router = useRouter();
  const scrollRef = useRef(null);

  // Tạo mảng tuổi từ 1 đến 100
  const ages = Array.from({ length: 100 }, (_, i) => i + 1);
  
  const itemHeight = 60;
  const containerHeight = itemHeight * 5; // Hiển thị 5 items
  const centerOffset = itemHeight * 2; // Offset để center item ở giữa

  useEffect(() => {
    // Scroll đến tuổi mặc định khi component mount
    setTimeout(() => {
      const initialOffset = (selectedAge - 1) * itemHeight;
      scrollRef.current?.scrollTo({ y: initialOffset, animated: false });
    }, 100);
  }, []);

  const handleScroll = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / itemHeight);
    const newAge = Math.max(1, Math.min(100, index + 1));
    
    if (newAge !== selectedAge) {
      setSelectedAge(newAge);
    }
  };

  const handleScrollEnd = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / itemHeight);
    const snapOffset = index * itemHeight;
    
    scrollRef.current?.scrollTo({ y: snapOffset, animated: true });
  };

  const handleNext = () => {
    if (selectedAge && selectedAge > 0 && selectedAge < 120) {
      // Lưu age vào Redux
      dispatch(setPersonalInfo({ age: selectedAge }));
      console.log('Age selected:', selectedAge);
      
      dispatch(nextStep());
      router.push('/onboarding/Height');
    }
  };

  const handleBack = () => {
    dispatch(prevStep());
    router.back();
  };

  const renderAgeItem = (age, index) => {
    const isSelected = age === selectedAge;
    const isNearSelected = Math.abs(age - selectedAge) === 1;
    
    return (
      <View
        key={age}
        style={[
          styles.ageItem,
          { height: itemHeight },
          isSelected && styles.selectedAgeItem
        ]}
      >
        <Text
          style={[
            styles.ageText,
            isSelected && styles.selectedAgeText,
            isNearSelected && styles.nearSelectedAgeText
          ]}
        >
          {age}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderComponent />
      <View style={styles.content}>
        <View style={styles.header}>
          <H2 style={styles.title}>Tuổi</H2>
          <Paragraph style={styles.subtitle}>
            Bạn bao nhiêu tuổi? Cần tính dinh dưỡng hợp lý
          </Paragraph>
        </View>

        <View style={styles.pickerContainer}>
          {/* Background gradient overlay */}
          {/* <View style={styles.gradientOverlay}>
            <View style={styles.topGradient} />
            <View style={styles.centerArea} />
            <View style={styles.bottomGradient} />
          </View> */}
          
          {/* Selection indicator */}
          <View style={styles.selectionIndicator} />
          
          {/* Age picker */}
          <ScrollView
            ref={scrollRef}
            style={[styles.scrollView, { height: containerHeight }]}
            contentContainerStyle={{
              paddingTop: centerOffset,
              paddingBottom: centerOffset,
            }}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            onMomentumScrollEnd={handleScrollEnd}
            scrollEventThrottle={16}
            snapToInterval={itemHeight}
            decelerationRate="fast"
          >
            {ages.map((age, index) => renderAgeItem(age, index))}
          </ScrollView>
        </View>

        <View style={styles.bottomContainer}>
          <ButtonComponent
            enableBack={true}
            onBack={handleBack}
            onNext={handleNext}
            disableNext={!selectedAge || selectedAge <= 0 || selectedAge >= 120}
            
          />

          <Paragraph textAlign="center" color="$gray8" fontSize="$3" marginTop="$2">
            Bước 3/5
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
    alignItems: 'flex-start', // Thay đổi từ 'center' thành 'flex-start'
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'left', // Thay đổi từ 'center' thành 'left'
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'left', // Thay đổi từ 'center' thành 'left'
    lineHeight: 24,
  },
  pickerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  gradientOverlay: {
    width: 120,
    position: 'absolute',
    top: 0,
    left: '50%',
    marginLeft: -60, // Center the overlay (width/2)
    bottom: 0,
    zIndex: 1,
    pointerEvents: 'none',
    borderRadius: 12,
    overflow: 'hidden',
  },
  topGradient: {
    flex: 2,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  centerArea: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#2C3E50',
  },
  bottomGradient: {
    flex: 2,
    backgroundColor: 'transparent',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  selectionIndicator: {
    position: 'absolute',
    left: 70,
    top: 120,
    right: 70,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 12,
    zIndex: 0,
  },
  scrollView: {
    width: '100%',
  },
  ageItem: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  selectedAgeItem: {
    backgroundColor: 'transparent',
  },
  ageText: {
    fontSize: 28,
    fontWeight: '300',
    color: '#CCCCCC',
    textAlign: 'center',
  },
  selectedAgeText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  nearSelectedAgeText: {
    fontSize: 32,
    fontWeight: '400',
    color: '#666666',
  },
  bottomContainer: {
    paddingBottom: 40,
  },
});
