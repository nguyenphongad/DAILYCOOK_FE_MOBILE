import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Text, View, ScrollView, Image, TouchableOpacity, FlatList, Dimensions, Animated, RefreshControl, Modal, StyleSheet } from 'react-native';
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
import LoadingComponent from '../../components/loading/LoadingComponent';

// Giả lập dữ liệu
const userData = {
  name: 'Phong',
  dailyGoals: {
    calories: 120,
    protein: 200,
    water: 1200
  }
};

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

// Bổ sung dữ liệu món ăn theo các bữa
const mealsByTime = {
  breakfast: [
    {
      id: '1',
      name: 'Bánh mì trứng thịt',
      description: 'Năng lượng cho buổi sáng',
      calories: 320,
      protein: 18,
      carbs: 40,
      typeMeal: 'Món chính', // Thêm loại món
      imageUrl: require('../../assets/images/food1.png'),
    },
    {
      id: '2',
      name: 'Cháo trứng bắc thảo',
      description: 'Nhẹ nhàng, dễ tiêu hóa',
      calories: 250,
      protein: 12,
      carbs: 35,
      typeMeal: 'Món phụ', // Thêm loại món
      imageUrl: require('../../assets/images/food1.png'),
    },
    {
      id: '3',
      name: 'Cháo trứng bắc Hung',
      description: 'Nhẹ nhàng, dễ tiêu hóa',
      calories: 150,
      protein: 12,
      carbs: 35,
      typeMeal: 'Món phụ', // Thêm loại món
      imageUrl: require('../../assets/images/food1.png'),
    },
  ],
  lunch: [
    {
      id: '3',
      name: 'Cơm gà xối mỡ',
      description: 'Bữa trưa đầy năng lượng',
      calories: 450,
      protein: 25,
      carbs: 60,
      typeMeal: 'Món chính', // Thêm loại món
      imageUrl: require('../../assets/images/food1.png'),
    },
    {
      id: '4',
      name: 'Bún bò Huế',
      description: 'Đậm đà hương vị Huế',
      calories: 420,
      protein: 22,
      carbs: 55,
      typeMeal: 'Món phụ', // Thêm loại món
      imageUrl: require('../../assets/images/food1.png'),
    },
  ],
  dinner: [
    {
      id: '5',
      name: 'Cá hồi áp chảo',
      description: 'Bữa tối nhẹ nhàng, giàu dưỡng chất',
      calories: 380,
      protein: 30,
      carbs: 18,
      typeMeal: 'Món chính', // Thêm loại món
      imageUrl: require('../../assets/images/food1.png'),
    },
    {
      id: '6',
      name: 'Canh bí đỏ nấu tôm',
      description: 'Bổ dưỡng, dễ ngủ',
      calories: 280,
      protein: 20,
      carbs: 22,
      typeMeal: 'Tráng miệng', // Thêm loại món
      imageUrl: require('../../assets/images/food1.png'),
    },
  ]
};

// Thêm trạng thái hiển thị cho các bữa ăn
const initialMealVisibility = {
  breakfast: true,
  lunch: true,
  dinner: true,
};

// Tạo component riêng cho menu item để tránh lỗi hooks
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

        {/* Hiển thị typeMeal */}
        <View style={styles.typeMealContainer}>
          <Text style={styles.typeMealText}>{item.typeMeal}</Text>
        </View>

        <View style={styles.menuItemContentVertical}>
          <View style={styles.menuItemInfo}>
            <Text style={styles.menuItemNameVertical}>{item.name}</Text>
            <Text style={styles.menuItemDescription}>{item.description}</Text>
          </View>

          <View style={styles.menuItemActions}>
            <View></View>

            <TouchableOpacity
              style={styles.acknowledgeButton}
              onPress={(e) => {
                e.stopPropagation();
                onAcknowledge(item.id);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.acknowledgeButtonText}>Ghi nhận</Text>
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

  // Redux selectors để lấy thông tin user
  const { user, isLoading } = useSelector((state) => state.auth);
  const { nutritionGoals, nutritionGoalsLoading } = useSelector((state) => state.survey);
  
  // Thêm state để track việc đã check nutrition goals
  const [hasCheckedNutritionGoals, setHasCheckedNutritionGoals] = useState(false);
  const [isCheckingNutritionGoals, setIsCheckingNutritionGoals] = useState(false);

  const [currentDate, setCurrentDate] = useState({
    dayName: getDayName(today.getDay()),
    date: today.getDate(),
    month: getMonthName(today.getMonth() + 1)
  });

  // Thêm state cho trạng thái hiển thị bữa ăn
  const [mealVisibility, setMealVisibility] = useState(initialMealVisibility);

  // Tối ưu state cho bộ lọc bữa ăn - đổi tên để phù hợp với dữ liệu
  const [activeMeal, setActiveMeal] = useState('breakfast');

  // Thêm state cho RefreshControl
  const [refreshing, setRefreshing] = useState(false);

  // Thêm states cho AI recommendation
  const [showAIMealSection, setShowAIMealSection] = useState(false);
  const [showAISuggestionButton, setShowAISuggestionButton] = useState(true);
  const [showAIRecommendationCard, setShowAIRecommendationCard] = useState(true);
  const [acceptedMealsData, setAcceptedMealsData] = useState(null);

  // Sửa lỗi useEffect - thêm dependency array và kiểm tra để tránh infinite loop
  useEffect(() => {
    if (params.acceptedMeals && params.showAISection === 'false') {
      try {
        const mealsData = JSON.parse(params.acceptedMeals);

        // Chỉ update state nếu dữ liệu thực sự khác và chưa được set
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
  }, [params.acceptedMeals, params.showAISection]); // Giữ nguyên dependency

  // Fetch user info khi component mount - chỉ gọi 1 lần
  useEffect(() => {
    if (!user && !isLoading) {
      dispatch(checkTokenAndGetUser());
    }
  }, []); // Dependency rỗng để chỉ chạy 1 lần

  // Check nutrition goals sau khi có user - THÊM DEBOUNCE
  useEffect(() => {
    let timeoutId;
    
    const checkAndRedirect = async () => {
      if (user && !hasCheckedNutritionGoals && !isCheckingNutritionGoals) {
        // Debounce 500ms để tránh gọi nhiều lần
        timeoutId = setTimeout(async () => {
          setIsCheckingNutritionGoals(true);
          
          try {
            // Gọi API lấy nutrition goals
            const result = await dispatch(getNutritionGoals()).unwrap();
            
            console.log('HomeScreen - Nutrition goals check:', result?.data);
            
            // Check nếu nutrition goals null
            const hasNullGoals = result?.data?.hasGoals === false || 
                                 result?.data?.nutritionGoals?.caloriesPerDay === null;
            
            if (hasNullGoals) {
              console.log('HomeScreen - Redirecting to GetNutriGoal...');
              // Redirect sang GetNutriGoal để tính toán
              setTimeout(() => {
                router.push('/onboarding/GetNutriGoal');
              }, 300); // Delay nhỏ để tránh conflict
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

  // Hàm xử lý khi người dùng kéo xuống để refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);

    // Mô phỏng tải dữ liệu
    setTimeout(() => {
      // console.log('Refreshing data...');
      // Ví dụ: fetchUserData(), fetchNutritionGoals(), fetchMealData(), v.v.

      // Kết thúc refreshing sau 1.5 giây
      setRefreshing(false);
    }, 1500);
  }, []);

  // Thêm state cho việc hiển thị sheet nhắc nhở uống nước
  const [isWaterReminderSheetOpen, setIsWaterReminderSheetOpen] = useState(false);

  // Thêm state cho settings sheet
  const [isSettingsSheetOpen, setIsSettingsSheetOpen] = useState(false);

  // Thêm state để lưu trữ hình ảnh thời tiết dựa trên thời gian
  const [weatherIcon, setWeatherIcon] = useState(require('../../assets/images/icons_home/sun.png'));

  // Xác định biểu tượng thời tiết dựa trên thời gian
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

  // Dữ liệu phân tích của AI
  const analysisData = [
    { type: 'analysis', text: 'Thành viên: 1 người' },
    { type: 'analysis', text: 'Dinh dưỡng mục tiêu: Protein 250g, Kcal 500, Nước 2000ml' },
    { type: 'analysis', text: 'Thực phẩm không thích (4): Hành tây, Nấm, Đậu phụ, Cà tím' },
  ];

  // Dữ liệu gợi ý AI
  const aiMealSuggestions = {
    breakfast: [
      "Bánh mì trứng thịt - 320 calo",
      "Cháo trứng bắc thảo - 250 calo",
      "Cháo trứng bắc Hung - 150 calo",
    ],
    lunch: [
      "Cơm gà xối mỡ - 450 calo",
      "Bún bò Huế - 420 calo",
    ],
    dinner: [
      "Cá hồi áp chảo - 380 calo",
      "Canh bí đỏ nấu tôm - 280 calo",
    ],
  };

  // Xử lý khi nhấn nút gợi ý AI - cập nhật để chuyển trang
  const handleAISuggestion = () => {
    router.push('/(stacks)/mealPlan/PageRenderAI');
  };

  // Thêm hàm xử lý chuyển hướng đến trang dinh dưỡng
  const handleNavigateToNutrition = () => {
    router.push('/dinh-duong');
  };

  // Tối ưu hàm xử lý khi nhấn vào nút chi tiết món ăn
  const handleViewMealDetail = (mealId) => {
    // Thêm phản hồi trực quan khi người dùng nhấn nút
    Animated.sequence([
      Animated.timing(new Animated.Value(1), {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(new Animated.Value(0.9), {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      })
    ]).start();

    // Sử dụng setTimeout với độ trễ ngắn để tránh hiệu ứng "đóng băng" UI
    setTimeout(() => {
      // Điều hướng đến trang chi tiết món ăn
      router.push({
        pathname: '/(stacks)/meals/MealDetail',
        params: { id: mealId }
      });
    }, 50);
  };

  // Sửa useEffect thứ hai - thêm điều kiện chặt chẽ hơn
  useEffect(() => {
    if (!acceptedMealsData) {
      // Lấy danh sách các bữa ăn đang hiển thị từ dữ liệu mặc định
      const availableMeals = Object.keys(mealVisibility).filter(meal =>
        mealVisibility[meal] && mealsByTime[meal]?.length > 0
      );

      // Nếu không có bữa ăn nào hiển thị thì không cần cập nhật
      if (availableMeals.length === 0) return;

      // Nếu bữa ăn đang chọn không còn hiển thị, chuyển sang bữa đầu tiên có sẵn
      if (!availableMeals.includes(activeMeal)) {
        setActiveMeal(availableMeals[0]);
      }
    } else {
      // Xử lý cho dữ liệu từ AI
      const availableMeals = Object.keys(acceptedMealsData).filter(meal =>
        acceptedMealsData[meal]?.length > 0
      );

      if (availableMeals.length === 0) return;

      if (!availableMeals.includes(activeMeal)) {
        setActiveMeal(availableMeals[0]);
      }
    }
  }, [mealVisibility, acceptedMealsData]); // Bỏ activeMeal khỏi dependency để tránh loop

  // Lấy danh sách món ăn hiện tại dựa trên tab đã chọn và visibility
  const currentMeals = acceptedMealsData
    ? (acceptedMealsData[activeMeal] || [])
    : (mealVisibility[activeMeal] ? mealsByTime[activeMeal] || [] : []);

  // Lấy danh sách các bữa ăn hiện có dữ liệu và được phép hiển thị
  const availableMealTabs = acceptedMealsData
    ? Object.keys(acceptedMealsData).filter(meal => acceptedMealsData[meal]?.length > 0)
    : Object.keys(mealsByTime).filter(meal =>
      mealsByTime[meal]?.length > 0 && mealVisibility[meal] === true
    );

  // Xóa hàm handleViewFullMenu vì không cần nữa
  // const handleViewFullMenu = () => { ... }

  // Lấy chiều rộng màn hình để tính toán kích thước item
  const screenWidth = Dimensions.get('window').width;
  // Chiều rộng của mỗi item (2 item mỗi hàng, trừ đi padding và khoảng cách giữa các item)
  const itemWidth = (screenWidth - 50) / 2; // 15px padding mỗi bên + 20px khoảng cách giữa  
  // Nhóm món ăn thành các cặp (2 món mỗi hàng)
  const chunkedMeals = [];
  for (let i = 0; i < currentMeals.length; i += 2) {
    chunkedMeals.push(currentMeals.slice(i, i + 2));
  }

  // Render một item món ăn - sử dụng component riêng
  const renderMenuItem = (item) => (
    <MenuItemCard
      key={item.id}
      item={item}
      onPress={handleViewMealDetail}
      onAcknowledge={handleAcknowledgeMeal}
    />
  );

  // Thêm hàm xử lý ghi nhận món ăn
  const handleAcknowledgeMeal = (mealId) => {
    // Implement logic ghi nhận món ăn
    console.log(`Acknowledged meal: ${mealId}`);
    // Có thể thêm animation hoặc feedback cho user
  };

  // Xử lý khi nhấn nút gợi ý AI từ settings sheet
  const handleAISuggestionFromSheet = () => {
    // Đóng sheet trước
    setIsSettingsSheetOpen(false);

    // Nếu đã có dữ liệu menu, reset trạng thái trước khi chuyển trang
    if (acceptedMealsData) {
      setAcceptedMealsData(null);
      setShowAIRecommendationCard(true);
      setShowAISuggestionButton(true);
      setShowAIMealSection(false);
    }

    // Delay một chút để đảm bảo sheet đã đóng hoàn toàn trước khi chuyển trang
    setTimeout(() => {
      // Sử dụng replace thay vì push để không tạo thêm stack
      router.replace('/(stacks)/mealPlan/PageRenderAI');
    }, 300);
  };

  // Lấy tên user từ Redux state hoặc fallback
  const displayName = user?.fullName || userData.name || 'Người dùng';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Loading Component khi đang check nutrition goals */}
      <LoadingComponent visible={isCheckingNutritionGoals} />
      
      {/* Header cố định */}
      <HeaderComponent>
        <Text style={styles.headerText}>
          Xin chào, {isLoading ? 'đang tải...' : displayName}
        </Text>
        <View style={styles.headerRight}>
          <Image
            source={weatherIcon}
            style={styles.weatherIcon}
          />
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
          { paddingTop: insets.top + 30, paddingBottom: showAISuggestionButton ? 30 : 20 } // Thêm padding bottom khi có nút
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
        {/* Date Header Section */}
        <View style={styles.dateHeaderSection}>
          <Text style={styles.dayTitle}>{currentDate.dayName}</Text>
          <Text style={styles.dateSubtitle}>
            Ngày {currentDate.date}, {currentDate.month}
          </Text>
        </View>

        {/* Recommendation Section - chỉ hiện khi chưa có dữ liệu từ AI */}
        <View style={styles.menuSection}>
          <View style={styles.menuHeader}>
            <Text style={styles.sectionTitle}>
              {acceptedMealsData ? 'Thực đơn hôm nay' : 'Gợi ý thực đơn hôm nay'}
            </Text>

            {/* Luôn hiển thị settings button */}
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => setIsSettingsSheetOpen(true)}
            >
              <Ionicons name="options-outline" size={20} color="#35A55E" />
            </TouchableOpacity>
          </View>

          {/* AI recommendation card - chỉ hiện khi showAIRecommendationCard = true */}
          {showAIRecommendationCard && (
            <View style={styles.aiRecommendationCard}>
              {/* AI Image */}
              <View style={styles.aiImageContainer}>
                <Image
                  source={require('../../assets/images/flow-chart.png')}
                  style={styles.aiImage}
                  resizeMode="contain"
                />
              </View>

              {/* AI Features List */}
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

          {/* Hiển thị phần menu khi có dữ liệu từ AI hoặc showAIMealSection = true */}
          {(showAIMealSection || acceptedMealsData) && (
            <>
              {/* Menu selector tabs */}
              {availableMealTabs.length > 0 && (
                <View style={[
                  styles.mealTypeTabs,
                  availableMealTabs.length === 2 && styles.mealTypeTabsTwo,
                  availableMealTabs.length === 1 && styles.mealTypeTabsOne
                ]}>
                  {/* Breakfast tab */}
                  {(acceptedMealsData?.breakfast?.length > 0 || (mealVisibility.breakfast === true && mealsByTime.breakfast?.length > 0)) && (
                    <TouchableOpacity
                      style={[
                        styles.mealTypeTab,
                        availableMealTabs.length === 1 && styles.mealTypeTabFull,
                        availableMealTabs.length === 2 && styles.mealTypeTabHalf,
                        availableMealTabs.length === 3 && styles.mealTypeTabThird,
                        activeMeal === 'breakfast' && styles.activeMealTypeTab
                      ]}
                      onPress={() => setActiveMeal('breakfast')}
                    >
                      <Ionicons
                        name="sunny-outline"
                        size={16}
                        color={activeMeal === 'breakfast' ? '#FFFFFF' : '#35A55E'}
                      />
                      <Text
                        style={[
                          styles.mealTypeText,
                          activeMeal === 'breakfast' && styles.activeMealTypeText
                        ]}
                      >
                        Sáng
                      </Text>
                    </TouchableOpacity>
                  )}

                  {/* Lunch tab */}
                  {(acceptedMealsData?.lunch?.length > 0 || (mealVisibility.lunch === true && mealsByTime.lunch?.length > 0)) && (
                    <TouchableOpacity
                      style={[
                        styles.mealTypeTab,
                        availableMealTabs.length === 1 && styles.mealTypeTabFull,
                        availableMealTabs.length === 2 && styles.mealTypeTabHalf,
                        availableMealTabs.length === 3 && styles.mealTypeTabThird,
                        activeMeal === 'lunch' && styles.activeMealTypeTab
                      ]}
                      onPress={() => setActiveMeal('lunch')}
                    >
                      <Ionicons
                        name="restaurant-outline"
                        size={16}
                        color={activeMeal === 'lunch' ? '#FFFFFF' : '#35A55E'}
                      />
                      <Text
                        style={[
                          styles.mealTypeText,
                          activeMeal === 'lunch' && styles.activeMealTypeText
                        ]}
                      >
                        Trưa
                      </Text>
                    </TouchableOpacity>
                  )}

                  {/* Dinner tab */}
                  {(acceptedMealsData?.dinner?.length > 0 || (mealVisibility.dinner === true && mealsByTime.dinner?.length > 0)) && (
                    <TouchableOpacity
                      style={[
                        styles.mealTypeTab,
                        availableMealTabs.length === 1 && styles.mealTypeTabFull,
                        availableMealTabs.length === 2 && styles.mealTypeTabHalf,
                        availableMealTabs.length === 3 && styles.mealTypeTabThird,
                        activeMeal === 'dinner' && styles.activeMealTypeTab
                      ]}
                      onPress={() => setActiveMeal('dinner')}
                    >
                      <Ionicons
                        name="moon-outline"
                        size={16}
                        color={activeMeal === 'dinner' ? '#FFFFFF' : '#35A55E'}
                      />
                      <Text
                        style={[
                          styles.mealTypeText,
                          activeMeal === 'dinner' && styles.activeMealTypeText
                        ]}
                      >
                        Tối
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* Grid view cho món ăn */}
              {availableMealTabs.length > 0 && (
                <View style={styles.menuGrid}>
                  {currentMeals.map((item) => (
                    <React.Fragment key={item.id}>
                      {renderMenuItem(item)}
                    </React.Fragment>
                  ))}
                </View>
              )}

              {/* Xóa nút xem chi tiết thực đơn */}
              {/* 
              {availableMealTabs.length > 0 && currentMeals.length > 0 && (
                <TouchableOpacity 
                  style={styles.viewFullMenuButton}
                  onPress={handleViewFullMenu}
                >
                  <Text style={styles.viewFullMenuText}>Chi tiết thực đơn</Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              )}
              */}
            </>
          )}

        </View>
      </ScrollView>

      {/* AI Suggestion Button - chỉ hiện khi showAISuggestionButton = true */}
      {showAISuggestionButton && (
        <TouchableOpacity
          style={styles.aiSuggestionButtonExternal}
          onPress={() => handleAISuggestion()}
          activeOpacity={0.7}
        >
          <Text style={styles.aiSuggestionButtonText}>Gợi ý thực đơn hôm nay</Text>
          <Ionicons name="arrow-forward-circle" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      {/* Settings Sheet - luôn hiển thị, không phụ thuộc vào acceptedMealsData */}
      <SheetComponent
        isOpen={isSettingsSheetOpen}
        onClose={() => setIsSettingsSheetOpen(false)}
        snapPoints={[40, 50]}
        position={0}
      >
        <View style={styles.settingsSheetContent}>
          <Text style={styles.settingsSheetTitle}>
            {acceptedMealsData ? 'Cài đặt thực đơn' : 'Cài đặt thực đơn'}
          </Text>

          <TouchableOpacity
            style={styles.settingsOption}
            onPress={handleAISuggestionFromSheet}
          >
            <View style={styles.settingsOptionLeft}>
              <Ionicons name="refresh" size={20} color="#35A55E" />
              <Text style={styles.settingsOptionText}>
                {acceptedMealsData ? 'Tạo thực đơn mới' : 'Làm mới gợi ý AI'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#CCCCCC" />
          </TouchableOpacity>

          {/* Thêm các tùy chọn khác nếu đã có thực đơn */}
          {acceptedMealsData && (
            <>
              <TouchableOpacity
                style={styles.settingsOption}
                onPress={() => {
                  setIsSettingsSheetOpen(false);
                  // Logic để reset về trạng thái ban đầu - không cần navigate
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
            </>
          )}
        </View>
      </SheetComponent>

      {/* Sử dụng component WaterReminderSheet */}
      <WaterReminderSheet
        isOpen={isWaterReminderSheetOpen}
        onClose={() => setIsWaterReminderSheetOpen(false)}
      />
    </SafeAreaView>
  );
}

// Xóa toàn bộ additionalStyles và merge styles
// const additionalStyles = StyleSheet.create({ ... }); // Xóa toàn bộ
// Object.assign(styles, additionalStyles); // Xóa dòng này