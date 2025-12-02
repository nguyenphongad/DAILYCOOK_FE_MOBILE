import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { H2, Paragraph } from 'tamagui';
import { prevStep, setPersonalInfo } from '../../redux/slice/surveySlice';
import HeaderComponent from '../../components/header/HeaderComponent';
import ButtonComponent from '../../components/button/ButtonComponent';

export default function WeightScreen() {
  const [selectedWeight, setSelectedWeight] = useState(55);
  const dispatch = useDispatch();
  const router = useRouter();
  const scrollRef = useRef(null);
  const params = useLocalSearchParams();


  // Memoize weights array để tránh tạo lại mỗi lần render
  const weights = useMemo(() => {
    const result = [];
    for (let i = 30; i <= 150; i += 0.5) {
      result.push(parseFloat(i.toFixed(1)));
    }
    return result;
  }, []);
  
  const itemWidth = 60;
  const containerWidth = itemWidth * 7;
  const centerOffset = itemWidth * 3;

  useEffect(() => {
    const initialIndex = weights.findIndex(w => w === selectedWeight);
    const initialOffset = initialIndex * itemWidth;
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ x: initialOffset, animated: false });
    });
  }, []); // Chỉ chạy 1 lần khi mount

  const handleScroll = (event) => {
    const x = event.nativeEvent.contentOffset.x;
    const index = Math.round(x / itemWidth);
    const newWeight = weights[Math.max(0, Math.min(weights.length - 1, index))];
    
    if (newWeight !== selectedWeight) {
      setSelectedWeight(newWeight);
    }
  };

  const handleScrollEnd = (event) => {
    const x = event.nativeEvent.contentOffset.x;
    const index = Math.round(x / itemWidth);
    const snapOffset = index * itemWidth;
    scrollRef.current?.scrollTo({ x: snapOffset, animated: true });
  };

  const handleNext = () => {
    if (selectedWeight && selectedWeight > 0) {
      // Lưu weight vào Redux
      dispatch(setPersonalInfo({ weight: selectedWeight }));
      
      console.log('Weight saved:', selectedWeight);
      
      // Chuyển đến SelectDietType cho personal flow
      router.push('/onboarding/SelectDietType');
    }
  };

  const handleBack = () => {
    dispatch(prevStep());
    router.back();
  };

  // Memoize render item để tránh re-render không cần thiết
  const renderWeightItem = useMemo(() => (weight, index) => {
    const isSelected = weight === selectedWeight;
    const isNearSelected = Math.abs(weight - selectedWeight) <= 1;
    
    return (
      <View
        key={weight}
        style={[
          styles.weightItem,
          { width: itemWidth },
        ]}
      >
        <Text
          style={[
            styles.weightText,
            isSelected && styles.selectedWeightText,
            isNearSelected && !isSelected && styles.nearSelectedWeightText
          ]}
        >
          {weight.toFixed(1)}
        </Text>
      </View>
    );
  }, [selectedWeight, itemWidth]);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderComponent />
      <View style={styles.content}>
        <View style={styles.header}>
          <H2 style={styles.title}>Cân nặng</H2>
          <Paragraph style={styles.subtitle}>
            Cân nặng hiện tại của bạn là gì?
          </Paragraph>
        </View>

        <View style={styles.mainContainer}>
          {/* Weight display */}
          <View style={styles.weightDisplay}>
            <Text style={styles.weightValue}>
              {selectedWeight.toFixed(1)}
            </Text>
            <Text style={styles.weightUnit}>kg</Text>
          </View>

          {/* Weight picker - Horizontal scroll */}
          <View style={styles.pickerContainer}>
            <View style={styles.scrollContainer}>
              <View style={styles.selectionIndicator} />
              <View style={styles.redPointer} />
              
              <ScrollView
                ref={scrollRef}
                style={[styles.scrollView, { width: containerWidth }]}
                contentContainerStyle={{
                  paddingLeft: centerOffset,
                  paddingRight: centerOffset,
                }}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                onMomentumScrollEnd={handleScrollEnd}
                scrollEventThrottle={16}
                snapToInterval={itemWidth}
                decelerationRate="fast"
                removeClippedSubviews={true}
                initialNumToRender={10}
                maxToRenderPerBatch={5}
                windowSize={10}
              >
                {weights.map((weight, index) => renderWeightItem(weight, index))}
              </ScrollView>
            </View>
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <ButtonComponent
            enableBack={true}
            onBack={handleBack}
            onNext={handleNext}
            nextText="Tiếp theo"
            disableNext={!selectedWeight || selectedWeight <= 0}
            nextColor="#35A55E"
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
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'left',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'left',
    lineHeight: 24,
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weightDisplay: {
    alignItems: 'center',
    marginBottom: 40,
  },
  weightValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  weightUnit: {
    fontSize: 24,
    color: '#666',
    marginTop: -5,
  },
  pickerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  scrollContainer: {
    position: 'relative',
    height: 80,
  },
  selectionIndicator: {
    position: 'absolute',
    top: 0,
    left: '65%',
    transform: [{ translateX: -30 }],
    width: 60,
    height: 80,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 8,
    zIndex: 0,
  },
  redPointer: {
    position: 'absolute',
    top: -15,
    left: '65%',
    transform: [{ translateX: -1.5 }],
    width: 3,
    height: 30,
    backgroundColor: '#E74C3C',
    zIndex: 1,
  },
  scrollView: {
    height: 80,
  },
  weightItem: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  weightText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#CCCCCC',
    textAlign: 'center',
  },
  selectedWeightText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  nearSelectedWeightText: {
    fontSize: 18,
    fontWeight: '400',
    color: '#666666',
  },
  bottomContainer: {
    paddingBottom: 40,
  },
});
