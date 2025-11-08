import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Text, View, ScrollView, Image, TouchableOpacity, FlatList, Dimensions, Animated, RefreshControl, Modal, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import HeaderComponent from '../../components/header/HeaderComponent';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import styles from '../../styles/IndexPage';
import WaterReminderSheet from '../../components/sheet/WaterReminderSheet';
import SheetComponent from '../../components/sheet/SheetComponent';

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
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
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

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const today = new Date();
  const aiScrollViewRef = useRef(null); // Thêm ref cho ScrollView trong modal
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

  // Thêm states cho chức năng gợi ý AI
  const [showAIMealSection, setShowAIMealSection] = useState(false);
  const [showAISuggestionButton, setShowAISuggestionButton] = useState(true);
  
  // Animation values for AI suggestion text
  const aiTextAnim = useRef(new Animated.Value(0)).current;
  
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
  
  // Xóa closeAIModal function và các state không cần thiết
  // const closeAIModal = () => { ... } // Xóa function này
  // const [showAIModal, setShowAIModal] = useState(false); // Xóa state này
  // const [aiSuggestions, setAiSuggestions] = useState([]); // Xóa state này
  // const [loadingAI, setLoadingAI] = useState(false); // Xóa state này
  // const [aiAnalysisInfo, setAiAnalysisInfo] = useState([]); // Xóa state này
  // const aiTextAnim = useRef(new Animated.Value(0)).current; // Xóa animation này

  // Thêm hàm xử lý chuyển hướng đến trang dinh dưỡng
  const handleNavigateToNutrition = () => {
    router.push('/dinh-duong');
  };

  // Xóa các hàm liên quan đến calendar
  // const weeks = [...]; // Xóa
  // const scrollToWeek = (weekOffset) => {...}; // Xóa
  // useEffect(() => { scrollToWeek(0); }, []); // Xóa

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
  
  // Xử lý khi trạng thái hiển thị bữa ăn thay đổi
  useEffect(() => {
    console.log("Meal Visibility changed:", mealVisibility);
    console.log("Available Meal Tabs:", availableMealTabs);
    
    // Lấy danh sách các bữa ăn đang hiển thị
    const availableMeals = Object.keys(mealVisibility).filter(meal => 
      mealVisibility[meal] && mealsByTime[meal]?.length > 0
    );
    
    console.log("Available Meals:", availableMeals);
    
    // Nếu không có bữa ăn nào hiển thị thì không cần cập nhật
    if (availableMeals.length === 0) return;
    
    // Nếu bữa ăn đang chọn không còn hiển thị, chuyển sang bữa đầu tiên có sẵn
    if (!availableMeals.includes(activeMeal)) {
      setActiveMeal(availableMeals[0]);
      console.log("Setting active meal to:", availableMeals[0]);
    }
  }, [mealVisibility]);
  
  // Lấy danh sách các bữa ăn hiện có dữ liệu và được phép hiển thị
  const availableMealTabs = Object.keys(mealsByTime).filter(meal => 
    mealsByTime[meal]?.length > 0 && mealVisibility[meal] === true
  );
  
  // Lấy danh sách món ăn hiện tại dựa trên tab đã chọn và visibility
  const currentMeals = mealVisibility[activeMeal] ? mealsByTime[activeMeal] || [] : [];
  
  // Hàm xem chi tiết thực đơn
  const handleViewFullMenu = () => {
    router.push({
      pathname: '/(stacks)/mealPlan/MealPlanDetail',
      params: { 
        mealTime: activeMeal,
        id: currentMeals.length > 0 ? currentMeals[0].id : 'default',
        // Truyền dữ liệu món ăn dưới dạng chuỗi JSON
        mealsData: JSON.stringify(mealsByTime)
      }
    });
  };
  
  // Lấy chiều rộng màn hình để tính toán kích thước item
  const screenWidth = Dimensions.get('window').width;
  // Chiều rộng của mỗi item (2 item mỗi hàng, trừ đi padding và khoảng cách giữa các item)
  const itemWidth = (screenWidth - 50) / 2; // 15px padding mỗi bên + 20px khoảng cách giữa  
  // Nhóm món ăn thành các cặp (2 món mỗi hàng)
  const chunkedMeals = [];
  for (let i = 0; i < currentMeals.length; i += 2) {
    chunkedMeals.push(currentMeals.slice(i, i + 2));
  }
  
  // Render một item món ăn - cập nhật để hiển thị theo chiều dọc
  const renderMenuItem = (item) => (
    <View style={styles.menuItemCardVertical}>
      <Image source={item.imageUrl} style={styles.menuItemImageVertical} />
      
      {/* Hiển thị typeMeal */}
      <View style={styles.typeMealContainer}>
        <Text style={styles.typeMealText}>{item.typeMeal}</Text>
      </View>
      
      <View style={styles.menuItemContentVertical}>
        <View style={styles.menuItemInfo}>
          <Text style={styles.menuItemNameVertical}>{item.name}</Text>
          <Text style={styles.menuItemDescription}>{item.description}</Text>
          <View style={styles.menuItemMacros}>
            <Text style={styles.menuItemMacro}>🔥 {item.calories} kcal</Text>
            <Text style={styles.menuItemMacro}>🥩 {item.protein}g</Text>
            <Text style={styles.menuItemMacro}>🍚 {item.carbs}g</Text>
          </View>
        </View>
        
        <View style={styles.menuItemActions}>
          <TouchableOpacity 
            style={styles.viewDetailButton}
            onPress={() => handleViewMealDetail(item.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.viewDetailButtonText}>Chi tiết</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.acknowledgeButton}
            onPress={() => handleAcknowledgeMeal(item.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.acknowledgeButtonText}>Ghi nhận</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Thêm hàm xử lý ghi nhận món ăn
  const handleAcknowledgeMeal = (mealId) => {
    // Implement logic ghi nhận món ăn
    console.log(`Acknowledged meal: ${mealId}`);
    // Có thể thêm animation hoặc feedback cho user
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      {/* Header cố định */}
      <HeaderComponent>
        <Text style={styles.headerText}>Xin chào, {userData.name}</Text>
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
          { paddingTop: insets.top + 30, paddingBottom: showAISuggestionButton ? 80 : 20 } // Thêm padding bottom khi có nút
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

        {/* Thay đổi phần Recommendation Section */}
        <View style={styles.menuSection}>
          <View style={styles.menuHeader}>
            <Text style={styles.sectionTitle}>Gợi ý thực đơn hôm nay</Text>
            
            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={() => setIsSettingsSheetOpen(true)}
            >
              <Ionicons name="options-outline" size={20} color="#35A55E" />
            </TouchableOpacity>
          </View>
          
          {/* AI recommendation card - Đã cập nhật */}
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
          
          {/* Chỉ hiển thị phần menu nếu showAIMealSection = true */}
          {showAIMealSection && (
            <>
              {/* Menu selector tabs */}
              {availableMealTabs.length > 0 && (
                <View style={[
                  styles.mealTypeTabs,
                  availableMealTabs.length === 2 && styles.mealTypeTabsTwo,
                  availableMealTabs.length === 1 && styles.mealTypeTabsOne
                ]}>
                  {/* Breakfast tab */}
                  {mealVisibility.breakfast === true && mealsByTime.breakfast?.length > 0 && (
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
                  {mealVisibility.lunch === true && mealsByTime.lunch?.length > 0 && (
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
                  {mealVisibility.dinner === true && mealsByTime.dinner?.length > 0 && (
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
              
              {/* Hiển thị thông báo nếu không có bữa ăn nào được hiển thị */}
              {availableMealTabs.length === 0 && (
                <View style={styles.noMealContainer}>
                  <Text style={styles.noMealText}>
                    Không có bữa ăn nào được hiển thị. Vui lòng kiểm tra cài đặt.
                  </Text>
                </View>
              )}
              
              {/* Grid view cho món ăn - cập nhật để hiển thị theo chiều dọc */}
              {availableMealTabs.length > 0 && (
                <View style={styles.menuGrid}>
                  {currentMeals.map((item) => (
                    <React.Fragment key={item.id}>
                      {renderMenuItem(item)}
                    </React.Fragment>
                  ))}
                </View>
              )}
              
              {/* Nút xem chi tiết thực đơn */}
              {availableMealTabs.length > 0 && currentMeals.length > 0 && (
                <TouchableOpacity 
                  style={styles.viewFullMenuButton}
                  onPress={handleViewFullMenu}
                >
                  <Text style={styles.viewFullMenuText}>Chi tiết thực đơn</Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              )}
            </>
          )}
          
        </View>
      </ScrollView>
      
      {/* AI Suggestion Button - Di chuyển ra ngoài ScrollView để đứng yên */}
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
      
      {/* Xóa toàn bộ Modal gợi ý AI */}
      {/* <Modal ... > ... </Modal> */}
      
      {/* Sử dụng component WaterReminderSheet */}
      <WaterReminderSheet 
        isOpen={isWaterReminderSheetOpen}
        onClose={() => setIsWaterReminderSheetOpen(false)}
      />
      
      {/* Settings Sheet */}
      <SheetComponent
        isOpen={isSettingsSheetOpen}
        onClose={() => setIsSettingsSheetOpen(false)}
        snapPoints={[30, 50]}
        position={0}
      >
        <View style={styles.settingsSheetContent}>
          <Text style={styles.settingsSheetTitle}>Cài đặt thực đơn</Text>
          
          <TouchableOpacity 
            style={styles.settingsOption}
            onPress={() => handleAISuggestion()}
          >
            <View style={styles.settingsOptionLeft}>
              <Ionicons name="refresh" size={20} color="#35A55E" />
              <Text style={styles.settingsOptionText}>Làm mới gợi ý AI</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#CCCCCC" />
          </TouchableOpacity>
{/*           
          <TouchableOpacity style={styles.settingsOption}>
            <View style={styles.settingsOptionLeft}>
              <Ionicons name="settings-outline" size={20} color="#35A55E" />
              <Text style={styles.settingsOptionText}>Tùy chỉnh gợi ý</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#CCCCCC" />
          </TouchableOpacity> */}
          
        </View>
      </SheetComponent>
    </SafeAreaView>
  );
}

// Xóa toàn bộ additionalStyles và merge styles
// const additionalStyles = StyleSheet.create({ ... }); // Xóa toàn bộ
// Object.assign(styles, additionalStyles); // Xóa dòng này