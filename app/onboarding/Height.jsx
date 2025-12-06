import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions, Image } from 'react-native';
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { H2, Paragraph } from 'tamagui';
import { nextStep, prevStep, setPersonalInfo } from '../../redux/slice/surveySlice';
import HeaderComponent from '../../components/header/HeaderComponent';
import ButtonComponent from '../../components/button/ButtonComponent';

const { height: screenHeight } = Dimensions.get('window');

export default function HeightScreen() {
  const [selectedHeight, setSelectedHeight] = useState(162);
  const dispatch = useDispatch();
  const router = useRouter();
  const scrollRef = useRef(null);

  // Tạo mảng chiều cao từ 100 đến 220 cm - chỉ số nguyên
  const heights = [];
  for (let i = 100; i <= 220; i++) {
    heights.push(i);
  }
  
  const itemHeight = 30;
  const containerHeight = itemHeight * 9;
  const centerOffset = itemHeight * 4;

  useEffect(() => {
    setTimeout(() => {
      const initialIndex = heights.findIndex(h => h === selectedHeight);
      const initialOffset = initialIndex * itemHeight;
      scrollRef.current?.scrollTo({ y: initialOffset, animated: false });
    }, 100);
  }, []);

  const handleScroll = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / itemHeight);
    const newHeight = heights[Math.max(0, Math.min(heights.length - 1, index))];
    
    if (newHeight !== selectedHeight) {
      setSelectedHeight(newHeight);
    }
  };

  const handleScrollEnd = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / itemHeight);
    const snapOffset = index * itemHeight;
    
    scrollRef.current?.scrollTo({ y: snapOffset, animated: true });
  };

  const handleNext = () => {
    if (selectedHeight > 0) {
      dispatch(setPersonalInfo({ height: selectedHeight }));
      console.log('Height selected:', selectedHeight);
      
      dispatch(nextStep());
      router.push('/onboarding/Weight');
    }
  };

  const handleBack = () => {
    dispatch(prevStep());
    router.back();
  };

  const renderHeightItem = (height, index) => {
    const isSelected = height === selectedHeight;
    const isNearSelected = Math.abs(height - selectedHeight) <= 1;
    const isTensUnit = height % 10 === 0; // Kiểm tra có phải số tròn chục không (160, 170, 180...)
    
    return (
      <View
        key={height}
        style={[
          styles.heightItem,
          { height: itemHeight },
        ]}
      >
        {/* Nếu là số tròn chục thì hiển thị số, không thì hiển thị hình vuông */}
        {isTensUnit ? (
          <Text
            style={[
              styles.heightText,
              isSelected && styles.selectedHeightText,
              isNearSelected && !isSelected && styles.nearSelectedHeightText
            ]}
          >
            {height}
          </Text>
        ) : (
          <View style={[
            styles.decimalSquare,
            isSelected && styles.selectedDecimalSquare,
            isNearSelected && !isSelected && styles.nearSelectedDecimalSquare
          ]} />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderComponent />
      <View style={styles.content}>
        <View style={styles.header}>
          <H2 style={styles.title}>Chiều cao</H2>
          <Paragraph style={styles.subtitle}>
            Bạn cao bao nhiêu?
          </Paragraph>
        </View>

        <View style={styles.mainContainer}>
          {/* Left side - Height icon */}
          <View style={styles.leftContainer}>
            <Image
              source={require('../../assets/images/icon-height.png')}
              style={styles.heightIcon}
              resizeMode="contain"
            />
          </View>

          {/* Right side - Height picker */}
          <View style={styles.rightContainer}>
            {/* Height display */}
            <View style={styles.heightDisplay}>
              <Text style={styles.heightValue}>
                {selectedHeight}
              </Text>
              <Text style={styles.heightUnit}>cm</Text>
            </View>

            {/* Height picker container */}
            <View style={styles.pickerRulerContainer}>
              <View style={styles.pickerContainer}>
                <View style={styles.selectionIndicator} />
                
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
                  {heights.map((height, index) => renderHeightItem(height, index))}
                </ScrollView>
              </View>
            </View>

            {/* Red pointer line */}
            <View style={styles.redPointer} />
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <ButtonComponent
            enableBack={true}
            onBack={handleBack}
            onNext={handleNext}
            disableNext={!selectedHeight || selectedHeight <= 0}
            nextColor="#35A55E"
          />

          <Paragraph textAlign="center" color="$gray8" fontSize="$3" marginTop="$2">
            Bước 4/5
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 40,
  },
  leftContainer: {
    flex: 0.4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 70
  },
  heightIcon: {
    width: 220,
    height: 220,
  },
  rightContainer: {
    flex: 0.6,
    alignItems: 'flex-end',
    paddingLeft: 20,
  },
  heightDisplay: {
    alignItems: 'center',
    marginBottom: 20,
  },
  heightValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  heightUnit: {
    fontSize: 24,
    color: '#666',
    marginTop: -5,
  },
  pickerRulerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 360,
  },
  pickerContainer: {
    position: 'relative',
    width: 80,
  },
  selectionIndicator: {
    position: 'absolute',
    left: 0,
    top: '37.5%',
    transform: [{ translateY: -20 }],
    width: 80,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 8,
    zIndex: 0,
  },
  scrollView: {
    width: 80,
  },
  heightItem: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  heightText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#CCCCCC',
    textAlign: 'center',
  },
  selectedHeightText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  nearSelectedHeightText: {
    fontSize: 18,
    fontWeight: '400',
    color: '#666666',
  },
  // Hình vuông cho số thập phân
  decimalSquare: {
    width: 60, // Giảm từ 100 xuống 70
    height: 3,
    backgroundColor: '#CCCCCC',
    borderRadius: 1.5,
  },
  selectedDecimalSquare: {
    backgroundColor: '#2C3E50',
  },
  nearSelectedDecimalSquare: {
    backgroundColor: '#666666',
  },
  redPointer: {
    position: 'absolute',
    right: 90,
    top: '60%',
    width: 40,
    height: 3,
    backgroundColor: '#E74C3C',
    transform: [{ translateY: -1.5 }],
  },
  bottomContainer: {
    paddingBottom: 40,
  },
});
