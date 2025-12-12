import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Text, View, ScrollView, Image, TouchableOpacity, Animated, RefreshControl, Platform, ToastAndroid, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import HeaderComponent from '../../components/header/HeaderComponent';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import styles from '../../styles/IndexPage';
import WaterReminderSheet from '../../components/sheet/WaterReminderSheet';
import SheetComponent from '../../components/sheet/SheetComponent';
import { useDispatch, useSelector } from 'react-redux';
import { checkTokenAndGetUser } from '../../redux/thunk/authThunk';
import { getNutritionGoals } from '../../redux/thunk/surveyThunk';
import { getMealPlanFromDatabase, toggleMealEaten } from '../../redux/thunk/mealPlanThunk';
import LoadingComponent from '../../components/loading/LoadingComponent';

// Hàm lấy tên tháng từ số tháng
const getMonthName = (monthNumber) => {
  const months = [
    'Thg 1', 'Thg 2', 'Thg 3', 'Thg 4', 'Thg 5', 'Thg 6',
    'Thg 7', 'Thg 8', 'Thg 9', 'Thg 10', 'Thg 11', 'Thg 12'
  ];
  return months[monthNumber - 1];
};

// Hàm lấy tên thứ
const getDayName = (dayNumber) => {
  const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
  return days[dayNumber];
};

// Tạo component riêng cho menu item
const MenuItemCard = React.memo(({ item, onPress, onAcknowledge }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={styles.menuItemCardVertical}
        onPress={() => onPress(item.id)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <Image source={item.imageUrl} style={styles.menuItemImageVertical} />

        <View style={styles.typeMealContainer}>
          <Text style={styles.typeMealText}>{item.typeMeal}</Text>
        </View>

        <View style={styles.menuItemContentVertical}>
          <View style={styles.menuItemInfo}>
            <Text style={styles.menuItemNameVertical}>{item.name}</Text>
            {/* <Text style={styles.menuItemDescription}>{item.description}</Text> */}
          </View>

          <View style={styles.menuItemActions}>
            <View></View>

            <TouchableOpacity
              style={[
                styles.acknowledgeButton,
                item.isEaten && styles.acknowledgeButtonDisabled
              ]}
              onPress={(e) => {
                e.stopPropagation();
                if (!item.isEaten) {
                  onAcknowledge(item.id);
                }
              }}
              activeOpacity={item.isEaten ? 1 : 0.7}
              disabled={item.isEaten}
            >
              <Text style={[
                styles.acknowledgeButtonText,
                item.isEaten && styles.acknowledgeButtonTextDisabled
              ]}>
                {item.isEaten ? 'Đã ghi nhận' : 'Ghi nhận'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const today = new Date();
  const params = useLocalSearchParams();
  const dispatch = useDispatch();

  // Redux selectors
  const { user, isLoading } = useSelector((state) => state.auth);
  const { nutritionGoals, nutritionGoalsLoading } = useSelector((state) => state.survey);
  const { 
    databaseMealPlan, 
    getMealPlanFromDatabaseLoading, 
    hasSavedMealPlan,
    toggleMealEatenLoading
  } = useSelector((state) => state.mealPlan);

  // States
  const [hasCheckedNutritionGoals, setHasCheckedNutritionGoals] = useState(false);
  const [isCheckingNutritionGoals, setIsCheckingNutritionGoals] = useState(false);
  const [currentDate, setCurrentDate] = useState({
    dayName: getDayName(today.getDay()),
    date: today.getDate(),
    month: getMonthName(today.getMonth() + 1)
  });
  const [refreshing, setRefreshing] = useState(false);
  const [showAIMealSection, setShowAIMealSection] = useState(false);
  const [showAISuggestionButton, setShowAISuggestionButton] = useState(true);
  const [showAIRecommendationCard, setShowAIRecommendationCard] = useState(true);
  const [acceptedMealsData, setAcceptedMealsData] = useState(null);
  const [isWaterReminderSheetOpen, setIsWaterReminderSheetOpen] = useState(false);
  const [isSettingsSheetOpen, setIsSettingsSheetOpen] = useState(false);
  const [weatherIcon, setWeatherIcon] = useState(require('../../assets/images/icons_home/sun.png'));

  // Helper function để format date đúng
  const formatDateString = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // useEffect xử lý params từ AI page
  useEffect(() => {
    if (params.acceptedMeals && params.showAISection === 'false') {
      try {
        const mealsData = JSON.parse(params.acceptedMeals);

        if (!acceptedMealsData && JSON.stringify(mealsData) !== JSON.stringify(acceptedMealsData)) {
          setAcceptedMealsData(mealsData);
          setShowAIRecommendationCard(false);
          setShowAISuggestionButton(false);
          setShowAIMealSection(true);
        }
      } catch (error) {
        console.error('Error parsing accepted meals:', error);
      }
    }
  }, [params.acceptedMeals, params.showAISection]);

  // Fetch user info khi component mount
  useEffect(() => {
    if (!user && !isLoading) {
      dispatch(checkTokenAndGetUser());
    }
  }, []);

  // Check nutrition goals sau khi có user
  useEffect(() => {
    let timeoutId;
    
    const checkAndRedirect = async () => {
      if (user && !hasCheckedNutritionGoals && !isCheckingNutritionGoals) {
        timeoutId = setTimeout(async () => {
          setIsCheckingNutritionGoals(true);
          
          try {
            const result = await dispatch(getNutritionGoals()).unwrap();
            
            console.log('HomeScreen - Nutrition goals check:', result?.data);
            
            const hasNullGoals = result?.data?.hasGoals === false || 
                                 result?.data?.nutritionGoals?.caloriesPerDay === null;
            
            if (hasNullGoals) {
              console.log('HomeScreen - Redirecting to GetNutriGoal...');
              setTimeout(() => {
                router.push('/onboarding/GetNutriGoal');
              }, 300);
            } else {
              console.log('HomeScreen - Nutrition goals OK, staying on home');
            }
            
            setHasCheckedNutritionGoals(true);
          } catch (error) {
            console.error('HomeScreen - Error checking nutrition goals:', error);
            setHasCheckedNutritionGoals(true);
          } finally {
            setIsCheckingNutritionGoals(false);
          }
        }, 500);
      }
    };
    
    checkAndRedirect();
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [user, hasCheckedNutritionGoals, isCheckingNutritionGoals, dispatch]);

  // Xác định biểu tượng thời tiết
  useEffect(() => {
    const updateWeatherIcon = () => {
      const currentHour = new Date().getHours();

      if (currentHour >= 6 && currentHour < 16) {
        // Ban ngày: 6h sáng - 16h chiều
        setWeatherIcon(require('../../assets/images/icons_home/sun.png'));
      } else if (currentHour >= 16 && currentHour < 19) {
        // Chiều tối: 16h chiều - 19h tối
        setWeatherIcon(require('../../assets/images/icons_home/sunsets.png'));
      } else {
        // Đêm: 19h tối - 6h sáng
        setWeatherIcon(require('../../assets/images/icons_home/night.png'));
      }
    };

    // Cập nhật biểu tượng ngay khi component mount
    updateWeatherIcon();

    // Thiết lập interval để cập nhật biểu tượng mỗi phút
    const intervalId = setInterval(updateWeatherIcon, 60000);

    // Cleanup khi component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Transform data function
  const transformMealPlanData = (mealPlan) => {
    const transformed = {
      breakfast: [],
      lunch: [],
      dinner: []
    };

    mealPlan.forEach(mealTime => {
      const servingTime = mealTime.servingTime;
      
      transformed[servingTime] = mealTime.meals.map(meal => {
        const mealDetail = meal.mealDetail;
        const recipe = mealDetail.recipeDetail;
        
        return {
          id: mealDetail._id,
          name: mealDetail.nameMeal,
          description: mealDetail.description,
          calories: recipe?.nutrition?.calories || 0,
          protein: recipe?.nutrition?.protein || 0,
          carbs: recipe?.nutrition?.carbs || 0,
          fat: recipe?.nutrition?.fat || 0,
          typeMeal: mealDetail.mealCategory?.title || '',
          imageUrl: mealDetail.mealImage 
            ? { uri: mealDetail.mealImage }
            : require('../../assets/images/food1.png'),
          isEaten: meal.isEaten || false,
        };
      });
    });

    return transformed;
  };

  // Load meal plan từ database khi mount
  useEffect(() => {
    const loadSavedMealPlan = async () => {
      try {
        const today = new Date();
        const dateString = formatDateString(today);
        
        console.log('HomeScreen - Loading saved meal plan for:', dateString);
        console.log('HomeScreen - Current date object:', today);
        
        const result = await dispatch(getMealPlanFromDatabase(dateString)).unwrap();
        
        const hasData = result?.data?.mealPlan && 
                       Array.isArray(result.data.mealPlan) && 
                       result.data.mealPlan.length > 0;
        
        if (hasData) {
          console.log('HomeScreen - Found saved meal plan');
          
          // Sử dụng transform function
          const transformed = transformMealPlanData(result.data.mealPlan);
          
          setAcceptedMealsData(transformed);
          setShowAIRecommendationCard(false);
          setShowAISuggestionButton(false);
          setShowAIMealSection(true);
        } else {
          console.log('HomeScreen - No saved meal plan found');
        }
        
      } catch (error) {
        console.error('HomeScreen - Error loading saved meal plan:', error);
      }
    };
    
    if (!params.acceptedMeals) {
      loadSavedMealPlan();
    }
  }, [dispatch, params.acceptedMeals]);

  // Hàm xử lý khi người dùng kéo xuống để refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      const today = new Date();
      const dateString = formatDateString(today);
      
      console.log('HomeScreen - Refreshing meal plan for:', dateString);
      
      // Gọi API lấy meal plan từ database
      const result = await dispatch(getMealPlanFromDatabase(dateString)).unwrap();
      
      // Check nếu có data
      const hasData = result?.data?.mealPlan && 
                     Array.isArray(result.data.mealPlan) && 
                     result.data.mealPlan.length > 0;
      
      if (hasData) {
        console.log('HomeScreen - Refresh: Found saved meal plan');
        
        // Sử dụng transform function
        const transformed = transformMealPlanData(result.data.mealPlan);
        
        // Update UI
        setAcceptedMealsData(transformed);
        setShowAIRecommendationCard(false);
        setShowAISuggestionButton(false);
        setShowAIMealSection(true);
      } else {
        console.log('HomeScreen - Refresh: No saved meal plan found');
        
        // Reset về trạng thái ban đầu nếu không có data
        setAcceptedMealsData(null);
        setShowAIRecommendationCard(true);
        setShowAISuggestionButton(true);
        setShowAIMealSection(false);
      }
      
      // Refresh thêm user info và nutrition goals
      await Promise.all([
        dispatch(checkTokenAndGetUser()),
        dispatch(getNutritionGoals())
      ]);
      
    } catch (error) {
      console.error('HomeScreen - Refresh error:', error);
      
      // Nếu có lỗi, reset về trạng thái mặc định
      setAcceptedMealsData(null);
      setShowAIRecommendationCard(true);
      setShowAISuggestionButton(true);
      setShowAIMealSection(false);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  // Thêm hàm xử lý ghi nhận món ăn
  const handleAcknowledgeMeal = async (mealId) => {
    try {
      const today = new Date();
      const dateString = formatDateString(today);
      
      // Tìm servingTime của meal
      let targetServingTime = null;
      for (const [servingTime, meals] of Object.entries(acceptedMealsData)) {
        if (meals.find(m => m.id === mealId)) {
          targetServingTime = servingTime;
          break;
        }
      }
      
      if (!targetServingTime) {
        throw new Error('Không tìm thấy serving time của món ăn');
      }
      
      console.log('Acknowledge meal - Date string:', dateString);
      console.log('Acknowledge meal - Serving time:', targetServingTime);
      
      // Gọi API toggle eaten
      await dispatch(toggleMealEaten({
        date: dateString,
        servingTime: targetServingTime,
        mealId: mealId,
        action: 'EAT'
      })).unwrap();
      
      // Show success message
      if (Platform.OS === 'android') {
        ToastAndroid.show('Đã ghi nhận món', ToastAndroid.SHORT);
      } else {
        Alert.alert('Thành công', 'Đã ghi nhận món');
      }
      
      // Update local state
      setAcceptedMealsData(prevData => {
        const updatedData = { ...prevData };
        updatedData[targetServingTime] = updatedData[targetServingTime].map(meal => 
          meal.id === mealId ? { ...meal, isEaten: true } : meal
        );
        return updatedData;
      });
      
    } catch (error) {
      console.error('Error acknowledging meal:', error);
      if (Platform.OS === 'android') {
        ToastAndroid.show('Không thể ghi nhận món: ' + error, ToastAndroid.LONG);
      } else {
        Alert.alert('Lỗi', 'Không thể ghi nhận món: ' + error);
      }
    }
  };

  const handleViewMealDetail = (mealId) => {
    router.push({
      pathname: '/(stacks)/meals/MealDetail',
      params: { id: mealId }
    });
  };

  // Lấy danh sách món ăn và tabs hiện tại
  const availableMealTabs = acceptedMealsData 
    ? Object.keys(acceptedMealsData).filter(meal => acceptedMealsData[meal]?.length > 0)
    : [];

  // Thứ tự hiển thị sections
  const mealTimeOrder = ['breakfast', 'lunch', 'dinner'];
  const mealTimeLabels = {
    breakfast: 'Bữa sáng',
    lunch: 'Bữa trưa',
    dinner: 'Bữa tối'
  };

  const renderMenuItem = (item) => (
    <MenuItemCard
      key={item.id}
      item={item}
      onPress={handleViewMealDetail}
      onAcknowledge={handleAcknowledgeMeal}
    />
  );

  // Lấy tên user từ Redux state hoặc fallback
  const displayName = user?.fullName  || '';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Loading Component khi đang load saved meal plan */}
      <LoadingComponent visible={getMealPlanFromDatabaseLoading || toggleMealEatenLoading} />
      
      {/* Header cố định */}
      <HeaderComponent>
        <Text style={styles.headerText}>
          Xin chào {isLoading ? 'đang tải...' : displayName}
        </Text>
        <View style={styles.headerRight}>
          <Image source={weatherIcon} style={styles.weatherIcon} />
          <TouchableOpacity
            style={styles.waterReminderButton}
            onPress={() => setIsWaterReminderSheetOpen(true)}
          >
            <Image
              source={require('../../assets/images/icons_home/water-bottle.png')}
              style={styles.waterReminderIcon}
            />
          </TouchableOpacity>
        </View>
      </HeaderComponent>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollContainer}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingTop: insets.top + 30, paddingBottom: showAISuggestionButton ? 30 : 20 }
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#35A55E']}
            tintColor="#35A55E"
            title="Đang tải..."
            titleColor="#35A55E"
          />
        }
      >
        {/* Date Header Section - Cập nhật */}
        <View style={styles.dateHeaderSection}>
          <Text style={styles.dayTitle}>{currentDate.dayName}</Text>
          <Text style={styles.dateSeparator}>•</Text>
          <Text style={styles.dateSubtitle}>
            Ngày {currentDate.date}, {currentDate.month}
          </Text>
        </View>

        {/* Menu Section */}
        <View style={styles.menuSection}>
          <View style={styles.menuHeader}>
            <Text style={styles.sectionTitle}>
              {acceptedMealsData ? 'Thực đơn hôm nay' : 'Gợi ý thực đơn hôm nay'}
            </Text>

            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => setIsSettingsSheetOpen(true)}
            >
              <Ionicons name="options-outline" size={20} color="#35A55E" />
            </TouchableOpacity>
          </View>

          {/* AI recommendation card */}
          {showAIRecommendationCard && (
            <View style={styles.aiRecommendationCard}>
              <View style={styles.aiImageContainer}>
                <Image
                  source={require('../../assets/images/flow-chart.png')}
                  style={styles.aiImage}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.aiFeaturesContainer}>
                <View style={styles.aiFeatureItem}>
                  <View style={styles.aiFeatureBullet} />
                  <Text style={styles.aiFeatureText}>
                    Gợi ý bữa ăn cho bữa sáng bữa trưa và bữa tối
                  </Text>
                </View>

                <View style={styles.aiFeatureItem}>
                  <View style={styles.aiFeatureBullet} />
                  <Text style={styles.aiFeatureText}>
                    Thiết kế phù hợp với dinh dưỡng theo chế độ ăn
                  </Text>
                </View>

                <View style={styles.aiFeatureItem}>
                  <View style={styles.aiFeatureBullet} />
                  <Text style={styles.aiFeatureText}>
                    Dinh dưỡng cân bằng cho cá nhân hoặc gia đình
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Section-based layout instead of tabs */}
          {(showAIMealSection || acceptedMealsData) && (
            <>
              {availableMealTabs.length > 0 ? (
                <View style={styles.menuGrid}>
                  {/* Render meals by sections */}
                  {mealTimeOrder.map((mealTime) => {
                    const meals = acceptedMealsData[mealTime];
                    if (!meals || meals.length === 0) return null;
                    
                    return (
                      <View key={mealTime} style={styles.mealTimeSection}>
                        {/* Section Header */}
                        <View style={styles.mealTimeSectionHeader}>
                          <Text style={styles.mealTimeSectionTitle}>
                            {mealTimeLabels[mealTime]}
                          </Text>
                          <View style={styles.mealTimeSectionDivider} />
                        </View>
                        
                        {/* Meals List */}
                        <View style={styles.mealTimeSectionContent}>
                          {meals.map(renderMenuItem)}
                        </View>
                      </View>
                    );
                  })}
                </View>
              ) : null}
            </>
          )}

        </View>
      </ScrollView>

      {/* AI Suggestion Button - chỉ hiện khi showAISuggestionButton = true */}
      {showAISuggestionButton && (
        <TouchableOpacity
          style={styles.aiSuggestionButtonExternal}
          onPress={() => router.push('/(stacks)/mealPlan/PageRenderAI')}
          activeOpacity={0.7}
        >
          <Text style={styles.aiSuggestionButtonText}>Gợi ý thực đơn hôm nay</Text>
          <Ionicons name="arrow-forward-circle" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      {/* Settings Sheet */}
      <SheetComponent
        isOpen={isSettingsSheetOpen}
        onClose={() => setIsSettingsSheetOpen(false)}
        snapPoints={[40, 50]}
        position={0}
      >
        <View style={styles.settingsSheetContent}>
          <Text style={styles.settingsSheetTitle}>Cài đặt thực đơn</Text>

          <TouchableOpacity
            style={styles.settingsOption}
            onPress={() => {
              setIsSettingsSheetOpen(false);
              setTimeout(() => {
                router.replace('/(stacks)/mealPlan/PageRenderAI');
              }, 300);
            }}
          >
            <View style={styles.settingsOptionLeft}>
              <Ionicons name="refresh" size={20} color="#35A55E" />
              <Text style={styles.settingsOptionText}>
                {acceptedMealsData ? 'Tạo thực đơn mới' : 'Làm mới gợi ý AI'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#CCCCCC" />
          </TouchableOpacity>

          {acceptedMealsData && (
            <TouchableOpacity
              style={styles.settingsOption}
              onPress={() => {
                setIsSettingsSheetOpen(false);
                setAcceptedMealsData(null);
                setShowAIRecommendationCard(true);
                setShowAISuggestionButton(true);
                setShowAIMealSection(false);
              }}
            >
              <View style={styles.settingsOptionLeft}>
                <Ionicons name="trash-outline" size={20} color="#E86F50" />
                <Text style={[styles.settingsOptionText, { color: '#E86F50' }]}>
                  Xóa thực đơn
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#CCCCCC" />
            </TouchableOpacity>
          )}
        </View>
      </SheetComponent>

      <WaterReminderSheet
        isOpen={isWaterReminderSheetOpen}
        onClose={() => setIsWaterReminderSheetOpen(false)}
      />
    </SafeAreaView>
  );
}