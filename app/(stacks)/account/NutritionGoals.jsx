import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Animated, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { getNutritionGoals } from '../../../redux/thunk/surveyThunk';
import HeaderComponent from '../../../components/header/HeaderComponent';

export default function NutritionGoalsScreen() {
  const dispatch = useDispatch();
  const { nutritionGoals: nutritionGoalsData, nutritionGoalsLoading } = useSelector((state) => state.survey);
  const [refreshing, setRefreshing] = React.useState(false);

  // Animation refs
  const progressAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]).current;

  // Load nutrition goals khi mount
  useEffect(() => {
    dispatch(getNutritionGoals());
  }, [dispatch]);

  // Tạo nutritionGoals từ API data
  const nutritionGoals = nutritionGoalsData?.hasGoals ? [
    {
      id: '1',
      label: 'Kcal',
      value: nutritionGoalsData.nutritionGoals.caloriesPerDay,
      maxValue: nutritionGoalsData.nutritionGoals.caloriesPerDay,
      unit: 'kcal',
      backgroundColor: '#FFDBAA',
      progressColor: '#FF8C00',
    },
    {
      id: '2',
      label: 'Protein',
      value: Math.round(nutritionGoalsData.nutritionGoals.caloriesPerDay * (nutritionGoalsData.nutritionGoals.proteinPercentage / 100) / 4),
      maxValue: Math.round(nutritionGoalsData.nutritionGoals.caloriesPerDay * (nutritionGoalsData.nutritionGoals.proteinPercentage / 100) / 4),
      unit: 'g',
      percentage: nutritionGoalsData.nutritionGoals.proteinPercentage,
      backgroundColor: '#FFFFFF',
      progressColor: '#38B74C',
    },
    {
      id: '3',
      label: 'Carbs',
      value: Math.round(nutritionGoalsData.nutritionGoals.caloriesPerDay * (nutritionGoalsData.nutritionGoals.carbPercentage / 100) / 4),
      maxValue: Math.round(nutritionGoalsData.nutritionGoals.caloriesPerDay * (nutritionGoalsData.nutritionGoals.carbPercentage / 100) / 4),
      unit: 'g',
      percentage: nutritionGoalsData.nutritionGoals.carbPercentage,
      backgroundColor: '#E6F7FF',
      progressColor: '#4169E1',
    },
    {
      id: '4',
      label: 'Chất béo',
      value: Math.round(nutritionGoalsData.nutritionGoals.caloriesPerDay * (nutritionGoalsData.nutritionGoals.fatPercentage / 100) / 9),
      maxValue: Math.round(nutritionGoalsData.nutritionGoals.caloriesPerDay * (nutritionGoalsData.nutritionGoals.fatPercentage / 100) / 9),
      unit: 'g',
      percentage: nutritionGoalsData.nutritionGoals.fatPercentage,
      backgroundColor: '#FFE4E1',
      progressColor: '#FF69B4',
    }
  ] : [];

  // Animation effect
  useEffect(() => {
    if (nutritionGoals && nutritionGoals.length > 0) {
      const animations = progressAnims.map((anim, index) => {
        const goal = nutritionGoals[index];
        if (!goal) return null;
        
        const progressPercentage = goal.maxValue > 0 
          ? Math.min(goal.value / goal.maxValue, 1) 
          : 0;
          
        return Animated.timing(anim, {
          toValue: progressPercentage,
          duration: 1000,
          delay: 300 + index * 200,
          useNativeDriver: false
        });
      }).filter(Boolean);

      if (animations.length > 0) {
        Animated.stagger(100, animations).start();
      }
    }
  }, [nutritionGoals]);

  // Refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(getNutritionGoals());
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <HeaderComponent>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chế độ dinh dưỡng hàng ngày</Text>
        <View style={{ width: 24 }} />
      </HeaderComponent>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#35A55E']}
            tintColor="#35A55E"
          />
        }
      >
        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoIconContainer}>
            <Ionicons name="information-circle" size={24} color="#35A55E" />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Mục tiêu dinh dưỡng của bạn</Text>
            <Text style={styles.infoDescription}>
              Đây là chế độ dinh dưỡng hàng ngày được tính toán dựa trên mục tiêu và thông tin cá nhân của bạn.
            </Text>
          </View>
        </View>

        {/* Nutrition Goals Grid */}
        {nutritionGoalsLoading || refreshing ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Đang tải...</Text>
          </View>
        ) : nutritionGoals.length > 0 ? (
          <View style={styles.nutritionGrid}>
            {nutritionGoals.map((item, index) => (
              <View key={item.id} style={[styles.nutritionCard, { backgroundColor: item.backgroundColor }]}>
                <View style={styles.nutritionCardHeader}>
                  <Text style={styles.nutritionCardLabel}>
                    {item.label}
                  </Text>

                  <View style={styles.nutritionCardContent}>
                    <Text style={styles.nutritionCardValue}>
                      {Math.round(item.value)}
                      <Text style={styles.nutritionCardUnit}>
                        {item.unit}
                      </Text>
                    </Text>
                  </View>
                  
                  {item.percentage && (
                    <Text style={styles.nutritionCardPercentage}>
                      {item.percentage}% năng lượng
                    </Text>
                  )}
                </View>

                <View style={styles.progressBarContainer}>
                  <Animated.View
                    style={[
                      styles.progressBarFill,
                      {
                        backgroundColor: item.progressColor,
                        width: progressAnims[index]?.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0%', '100%']
                        }) || '100%'
                      }
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="nutrition-outline" size={64} color="#CCCCCC" />
            <Text style={styles.emptyText}>Chưa có mục tiêu dinh dưỡng</Text>
            <Text style={styles.emptySubtext}>
              Vui lòng hoàn thành khảo sát để thiết lập mục tiêu
            </Text>
          </View>
        )}

        {/* Additional Info */}
        {nutritionGoals.length > 0 && (
          <View style={styles.additionalInfo}>
            <Text style={styles.additionalInfoTitle}>Lưu ý:</Text>
            <Text style={styles.additionalInfoText}>
              • Mục tiêu này được tính toán dựa trên tuổi, cân nặng, chiều cao và mức độ hoạt động của bạn
            </Text>
            <Text style={styles.additionalInfoText}>
              • Bạn có thể cập nhật thông tin cá nhân để điều chỉnh mục tiêu
            </Text>
            <Text style={styles.additionalInfoText}>
              • Protein: {nutritionGoalsData?.nutritionGoals?.proteinPercentage}% năng lượng
            </Text>
            <Text style={styles.additionalInfoText}>
              • Carbs: {nutritionGoalsData?.nutritionGoals?.carbPercentage}% năng lượng
            </Text>
            <Text style={styles.additionalInfoText}>
              • Chất béo: {nutritionGoalsData?.nutritionGoals?.fatPercentage}% năng lượng
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 95,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#35A55E',
  },
  infoIconContainer: {
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#35A55E',
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  nutritionCard: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nutritionCardHeader: {
    marginBottom: 12,
  },
  nutritionCardLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  nutritionCardContent: {
    marginBottom: 4,
  },
  nutritionCardValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  nutritionCardUnit: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#666',
  },
  nutritionCardPercentage: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  additionalInfo: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  additionalInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  additionalInfoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 8,
  },
});
