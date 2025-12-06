import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Animated,
    Alert,
    Platform,
    ToastAndroid
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { H2, Paragraph } from 'tamagui';
import { calculateNutritionGoals } from '../../redux/thunk/surveyThunk';
import { setOnboardingCompleted } from '../../redux/slice/surveySlice';
import HeaderComponent from '../../components/header/HeaderComponent';

// Skeleton Loading Component
const SkeletonGoalCard = ({ index }) => {
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const shimmerAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmerAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );
        shimmerAnimation.start();

        return () => shimmerAnimation.stop();
    }, [shimmerAnim]);

    const translateX = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-200, 200],
    });

    const colors = ['#FFDBAA', '#FFFFFF', '#E6F7FF', '#FFE4E1'];
    const backgroundColor = colors[index % colors.length];

    return (
        <View style={[styles.goalCard, { backgroundColor }]}>
            <View style={styles.skeletonCardHeader}>
                <View style={styles.skeletonLabel}>
                    <Animated.View
                        style={[
                            styles.shimmerOverlay,
                            { transform: [{ translateX }] },
                        ]}
                    />
                </View>
            </View>

            <View style={styles.skeletonValue}>
                <Animated.View
                    style={[
                        styles.shimmerOverlay,
                        { transform: [{ translateX }] },
                    ]}
                />
            </View>

            <View style={styles.progressBarContainer}>
                <View style={styles.skeletonProgressBar}>
                    <Animated.View
                        style={[
                            styles.shimmerOverlay,
                            { transform: [{ translateX }] },
                        ]}
                    />
                </View>
            </View>
        </View>
    );
};

export default function GetNutriGoalScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  
  const { nutritionGoals, nutritionGoalsLoading, nutritionGoalsError } = useSelector(state => state.survey);
  const progressAnims = useRef([]).current;
  const hasCalculated = useRef(false); // Prevent multiple calls

  useEffect(() => {
    // Chỉ gọi 1 lần
    if (!hasCalculated.current && !nutritionGoalsLoading) {
      hasCalculated.current = true;
      console.log('GetNutriGoal - Calling calculateNutritionGoals');
      dispatch(calculateNutritionGoals());
    }
  }, [dispatch]);

  // Kiểm tra xem có macroDetails không trước khi tạo nutritionGoalsData
  const hasValidData = nutritionGoals && 
                      nutritionGoals.macroDetails && 
                      nutritionGoals.nutritionGoals &&
                      nutritionGoals.nutritionGoals.caloriesPerDay !== null;

  const nutritionGoalsData = hasValidData ? [
    {
      id: '1',
      label: 'Kcal',
      value: nutritionGoals.nutritionGoals.caloriesPerDay,
      maxValue: nutritionGoals.nutritionGoals.caloriesPerDay,
      unit: 'kcal',
      backgroundColor: '#FFDBAA',
      progressColor: '#FF8C00',
    },
    {
      id: '2',
      label: 'Protein',
      value: nutritionGoals.macroDetails.protein.grams,
      maxValue: nutritionGoals.macroDetails.protein.grams,
      unit: 'g',
      percentage: nutritionGoals.nutritionGoals.proteinPercentage,
      backgroundColor: '#FFFFFF',
      progressColor: '#38B74C',
    },
    {
      id: '3',
      label: 'Carbs',
      value: nutritionGoals.macroDetails.carbs.grams,
      maxValue: nutritionGoals.macroDetails.carbs.grams,
      unit: 'g',
      percentage: nutritionGoals.nutritionGoals.carbPercentage,
      backgroundColor: '#E6F7FF',
      progressColor: '#4169E1',
    },
    {
      id: '4',
      label: 'Chất béo',
      value: nutritionGoals.macroDetails.fat.grams,
      maxValue: nutritionGoals.macroDetails.fat.grams,
      unit: 'g',
      percentage: nutritionGoals.nutritionGoals.fatPercentage,
      backgroundColor: '#FFE4E1',
      progressColor: '#FF69B4',
    }
  ] : [];

  // Initialize animation values - CHỈ KHI CÓ DATA HỢP LỆ
  useEffect(() => {
    if (hasValidData && progressAnims.length === 0) {
      // Khởi tạo 4 animation values
      for (let i = 0; i < 4; i++) {
        progressAnims.push(new Animated.Value(0));
      }
    }
  }, [hasValidData, nutritionGoals]); // Thêm nutritionGoals vào dependency

  // Animate progress bars - CHỈ KHI ĐÃ KHỞI TẠO XONG
  useEffect(() => {
    if (hasValidData && progressAnims.length === 4) {
      const animations = progressAnims.map((anim) => {
        return Animated.timing(anim, {
          toValue: 1,
          duration: 1000,
          delay: 300,
          useNativeDriver: false
        });
      });

      Animated.stagger(200, animations).start();
    }
  }, [hasValidData, progressAnims.length]); // Thêm progressAnims.length để đảm bảo đã khởi tạo xong

  useEffect(() => {
    if (nutritionGoalsError) {
      if (Platform.OS === 'android') {
        ToastAndroid.show('Có lỗi xảy ra: ' + nutritionGoalsError, ToastAndroid.LONG);
      } else {
        Alert.alert('Lỗi', 'Có lỗi xảy ra: ' + nutritionGoalsError);
      }
    }
  }, [nutritionGoalsError]);

  const handleComplete = () => {
    console.log('GetNutriGoal - Completing, navigating to tabs');
    
    // Không cần set onboarding completed nữa vì đã set ở SelectDietType
    
    // Navigate về tabs
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <HeaderComponent />

      <View style={styles.content}>
        <View style={styles.header}>
          <H2 style={styles.title}>Mục tiêu dinh dưỡng của bạn</H2>
          <Paragraph style={styles.subtitle}>
            {nutritionGoalsLoading 
              ? 'Đang tính toán mục tiêu dinh dưỡng phù hợp...' 
              : hasValidData
                ? `Dựa trên ${nutritionGoals.profileType === 'family' ? 'thông tin gia đình' : 'thông tin cá nhân'} và chế độ ăn ${nutritionGoals.dietType.title}`
                : 'Đang tải...'}
          </Paragraph>
        </View>

        <ScrollView 
          style={styles.scrollContainer} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {nutritionGoalsLoading ? (
            <View style={styles.goalsGrid}>
              {Array.from({ length: 4 }, (_, index) => (
                <SkeletonGoalCard key={index} index={index} />
              ))}
            </View>
          ) : hasValidData ? (
            <>
              <View style={styles.goalsGrid}>
                {nutritionGoalsData.map((item, index) => (
                  <View key={item.id} style={[styles.goalCard, { backgroundColor: item.backgroundColor }]}>
                    <View style={styles.goalCardHeader}>
                      <Text style={styles.goalLabel}>{item.label}</Text>
                      <View style={styles.goalValueContainer}>
                        <Text style={styles.goalValue}>{Math.round(item.value)}</Text>
                        <Text style={styles.goalUnit}>{item.unit}</Text>
                      </View>
                      {item.percentage && (
                        <Text style={styles.percentageText}>{item.percentage}%</Text>
                      )}
                    </View>

                    <View style={styles.progressBarContainer}>
                      <Animated.View
                        style={[
                          styles.progressBarFill,
                          {
                            backgroundColor: item.progressColor,
                            width: progressAnims[index] ? progressAnims[index].interpolate({
                              inputRange: [0, 1],
                              outputRange: ['0%', '100%']
                            }) : '0%'
                          }
                        ]}
                      />
                    </View>
                  </View>
                ))}
              </View>

              {nutritionGoals.profileType === 'family' && nutritionGoals.familyInfo && (
                <View style={styles.infoCard}>
                  <View style={styles.infoHeader}>
                    <Ionicons name="people" size={20} color="#35A55E" />
                    <Text style={styles.infoHeaderText}>Thông tin gia đình</Text>
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoText}>
                      Tổng {nutritionGoals.familyInfo.totalMembers} thành viên
                    </Text>
                    {nutritionGoals.familyInfo.children > 0 && (
                      <Text style={styles.infoDetail}>
                        • Trẻ em: {nutritionGoals.familyInfo.children}
                      </Text>
                    )}
                    {nutritionGoals.familyInfo.teenagers > 0 && (
                      <Text style={styles.infoDetail}>
                        • Thanh thiếu niên: {nutritionGoals.familyInfo.teenagers}
                      </Text>
                    )}
                    {nutritionGoals.familyInfo.adults > 0 && (
                      <Text style={styles.infoDetail}>
                        • Người lớn: {nutritionGoals.familyInfo.adults}
                      </Text>
                    )}
                    {nutritionGoals.familyInfo.elderly > 0 && (
                      <Text style={styles.infoDetail}>
                        • Người cao tuổi: {nutritionGoals.familyInfo.elderly}
                      </Text>
                    )}
                  </View>
                </View>
              )}

              {nutritionGoals.dietType && (
                <View style={styles.infoCard}>
                  <View style={styles.infoHeader}>
                    <Ionicons name="restaurant" size={20} color="#35A55E" />
                    <Text style={styles.infoHeaderText}>Chế độ ăn</Text>
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.dietTitle}>{nutritionGoals.dietType.title}</Text>
                    <Text style={styles.dietDescription}>
                      {nutritionGoals.dietTypeInfo?.description || ''}
                    </Text>
                  </View>
                </View>
              )}

              {nutritionGoals.nutritionGoals?.waterIntakeGoal && (
                <View style={styles.infoCard}>
                  <View style={styles.infoHeader}>
                    <Ionicons name="water" size={20} color="#35A55E" />
                    <Text style={styles.infoHeaderText}>Lượng nước khuyến nghị</Text>
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.waterGoal}>
                      {nutritionGoals.nutritionGoals.waterIntakeGoal} lít/ngày
                    </Text>
                  </View>
                </View>
              )}
            </>
          ) : (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
              <Text style={styles.errorTitle}>Không thể tính toán</Text>
              <Text style={styles.errorMessage}>
                {nutritionGoalsError || 'Vui lòng kiểm tra lại thông tin và thử lại'}
              </Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={() => dispatch(calculateNutritionGoals())}
              >
                <Ionicons name="refresh" size={20} color="#FFFFFF" />
                <Text style={styles.retryButtonText}>Thử lại</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        {!nutritionGoalsLoading && hasValidData && (
          <View style={styles.bottomContainer}>
            <TouchableOpacity
              style={styles.completeButton}
              onPress={handleComplete}
              activeOpacity={0.8}
            >
              <Text style={styles.completeButtonText}>Hoàn tất</Text>
              <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <Paragraph textAlign="center" color="$gray8" fontSize="$3" marginTop="$2">
              {nutritionGoals.profileType === 'family' ? 'Bước 3/3 (Gia đình)' : 'Bước 7/7 (Cá nhân)'}
            </Paragraph>
          </View>
        )}
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
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        lineHeight: 22,
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    goalsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    goalCard: {
        width: '48%',
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    goalCardHeader: {
        marginBottom: 12,
    },
    goalLabel: {
        fontSize: 11,
        fontWeight: '500',
        color: '#333',
        marginBottom: 8,
    },
    goalValueContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    goalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    goalUnit: {
        fontSize: 10,
        color: '#666',
        marginLeft: 4,
    },
    percentageText: {
        fontSize: 10,
        color: '#666',
        marginTop: 4,
    },
    progressBarContainer: {
        height: 6,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 3,
    },
    infoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    infoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    infoHeaderText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginLeft: 8,
    },
    infoContent: {
        paddingTop: 4,
    },
    infoText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    infoDetail: {
        fontSize: 13,
        color: '#666',
        marginBottom: 4,
        paddingLeft: 8,
    },
    dietTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#35A55E',
        marginBottom: 6,
    },
    dietDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    waterGoal: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4169E1',
    },
    bottomContainer: {
        paddingVertical: 20,
    },
    completeButton: {
        backgroundColor: '#35A55E',
        borderRadius: 12,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    completeButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginRight: 8,
    },
    // Skeleton styles
    skeletonCardHeader: {
        marginBottom: 12,
    },
    skeletonLabel: {
        height: 14,
        backgroundColor: '#E1E9EE',
        borderRadius: 4,
        marginBottom: 8,
        width: '60%',
        overflow: 'hidden',
        position: 'relative',
    },
    skeletonValue: {
        height: 24,
        backgroundColor: '#E1E9EE',
        borderRadius: 4,
        marginBottom: 12,
        width: '80%',
        overflow: 'hidden',
        position: 'relative',
    },
    skeletonProgressBar: {
        height: 6,
        backgroundColor: '#E1E9EE',
        borderRadius: 3,
        overflow: 'hidden',
        position: 'relative',
    },
    shimmerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        width: 100,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 60,
      paddingHorizontal: 20,
    },
    errorTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
      marginTop: 16,
      marginBottom: 8,
    },
    errorMessage: {
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
      marginBottom: 24,
    },
    retryButton: {
      flexDirection: 'row',
      backgroundColor: '#35A55E',
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 24,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    retryButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
});
