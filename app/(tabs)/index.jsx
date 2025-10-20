import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Text, View, ScrollView, Image, TouchableOpacity, FlatList, Dimensions, Animated, RefreshControl, Modal, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import HeaderComponent from '../../components/header/HeaderComponent';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import styles from '../../styles/IndexPage';
import WaterReminderSheet from '../../components/sheet/WaterReminderSheet';

// Giả lập dữ liệu
const userData = {
  name: 'Phong',
  dailyGoals: {
    calories: 120,
    protein: 200,
    water: 1200
  }
};

// Dữ liệu mục tiêu dinh dưỡng dạng JSON - Sửa lại đường dẫn ảnh không tồn tại
const nutritionGoals = [
  {
    id: '1',
    label: 'Protein',
    value: 215,
    maxValue: 250, // Giá trị tối đa để tính %
    unit: 'gram',
    postfix: '+',
    backgroundColor: '#FFFFFF',
    iconSource: require('../../assets/images/icons_home/protein.png'),
    textColor: '#000000',
    progressColor: '#38B74C', // Màu của thanh tiến trình
  },
  {
    id: '2',
    label: 'Kcal',
    value: 259,
    maxValue: 500,
    unit: 'gram',
    postfix: '+',
    backgroundColor: '#FFDBAA',
    iconSource: require('../../assets/images/icons_home/calories.png'),
    textColor: '#000000',
    progressColor: '#FF8C00', // Màu cam đậm
  },
  {
    id: '3',
    label: 'Nước',
    value: 1200,
    maxValue: 2000,
    unit: 'ml',
    postfix: '',
    backgroundColor: '#BAE5D0',
    iconSource: require('../../assets/images/icons_home/water-bottle.png'),
    textColor: '#000000',
    progressColor: '#1E90FF', // Màu xanh dương đậm
  },
  // Thay đổi tài nguyên của mục Chất xơ, dùng lại icon calories đã có
  {
    id: '4',
    label: 'Chất xơ',
    value: 25,
    maxValue: 35,
    unit: 'gr',
    postfix: '',
    backgroundColor: '#E6F7FF',
    iconSource: require('../../assets/images/icons_home/calories.png'),
    textColor: '#000000',
    progressColor: '#4169E1', // Màu xanh dương đậm
  }
];

// Hàm để lấy các ngày trong tuần với offset (tuần trước, tuần này, tuần sau)
const getWeekDays = (date = new Date(), weekOffset = 0) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + (weekOffset * 7)); // Thêm/trừ số ngày theo tuần

  const day = newDate.getDay(); // 0 là Chủ nhật, 1 là Thứ hai,...
  const diff = newDate.getDate() - day + (day === 0 ? -6 : 1); // Điều chỉnh về thứ hai

  // Tạo mảng 7 ngày từ thứ 2 đến Chủ nhật
  return Array(7).fill(0).map((_, i) => {
    const weekDate = new Date(newDate);
    weekDate.setDate(diff + i);
    return {
      id: weekOffset + '-' + i.toString(),
      date: weekDate.getDate().toString().padStart(2, '0'),
      month: weekDate.getMonth() + 1,
      year: weekDate.getFullYear(),
      day: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][weekDate.getDay()],
      fullDate: weekDate,
      isPast: weekDate < new Date(new Date().setHours(0, 0, 0, 0)),
      isToday: weekDate.getDate() === new Date().getDate() && 
               weekDate.getMonth() === new Date().getMonth() &&
               weekDate.getFullYear() === new Date().getFullYear(),
      isFuture: weekDate > new Date(new Date().setHours(23, 59, 59, 999))
    };
  });
};

// Hàm lấy tên tháng từ số tháng
const getMonthName = (monthNumber) => {
  const months = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];
  return months[monthNumber - 1];
};

const currentMonth = 'THÁNG TÁM';

const dateItems = Array(7).fill(0).map((_, index) => ({
  id: index.toString(),
  day: 'T2',
  date: '01'
}));

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
  const flatListRef = useRef(null);
  const aiScrollViewRef = useRef(null); // Thêm ref cho ScrollView trong modal
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0); // 0: tuần hiện tại, -1: tuần trước, ...
  const [currentMonth, setCurrentMonth] = useState(getMonthName(today.getMonth() + 1));
  const [selectedDate, setSelectedDate] = useState(today.getDate().toString());
  
  // Thêm state cho trạng thái hiển thị bữa ăn
  const [mealVisibility, setMealVisibility] = useState(initialMealVisibility);
  
  // Tối ưu state cho bộ lọc bữa ăn - đổi tên để phù hợp với dữ liệu
  const [activeMeal, setActiveMeal] = useState('breakfast');
  
  // Tạo refs cho animation các thanh tiến trình
  const progressAnims = useRef(nutritionGoals.map(() => new Animated.Value(0))).current;

  // Chạy animation khi component mount
  useEffect(() => {
    const animations = progressAnims.map((anim, index) => {
      const progressPercentage = Math.min(nutritionGoals[index].value / nutritionGoals[index].maxValue, 1);
      return Animated.timing(anim, {
        toValue: progressPercentage,
        duration: 1000,
        delay: 300 + index * 200, // Tạo hiệu ứng lần lượt
        useNativeDriver: false
      });
    });

    Animated.stagger(100, animations).start();
  }, []);
  
  // Tạo mảng các tuần (-1: tuần trước, 0: tuần hiện tại)
  const weeks = [
    { id: '-1', days: getWeekDays(today, -1) },
    { id: '0', days: getWeekDays(today, 0) }
  ];

  // Hàm chuyển tuần được cải tiến
  const scrollToWeek = (weekOffset) => {
    if (weekOffset >= -1 && weekOffset <= 0) {
      setCurrentWeekOffset(weekOffset);
      
      // Đảm bảo ref có giá trị trước khi thực hiện scroll
      if (flatListRef.current) {
        // Tính toán vị trí scroll chính xác
        const screenWidth = Dimensions.get('window').width;
        const offset = (weekOffset === -1) ? 0 : screenWidth - 18; // Trừ đi padding
        
        flatListRef.current.scrollToOffset({
          offset: offset,
          animated: true
        });
      }
    }
  };

  // Đảm bảo hiển thị tuần hiện tại khi component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToWeek(0);
    }, 200); // Tăng thời gian timeout để đảm bảo component đã render hoàn toàn
    
    return () => clearTimeout(timer);
  }, []);



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
  
  // Render một item món ăn
  const renderMenuItem = (item) => (
    <TouchableOpacity 
      style={[styles.menuItemCard, { width: itemWidth }]}
      onPress={() => handleViewMealDetail(item.id)}
      activeOpacity={0.7}
    >
      <Image source={item.imageUrl} style={styles.menuItemImage} />
      {/* Hiển thị typeMeal */}
      <View style={styles.typeMealContainer}>
        <Text style={styles.typeMealText}>{item.typeMeal}</Text>
      </View>
      <View style={styles.menuItemContent}>
        <Text style={styles.menuItemName}>{item.name}</Text>
        <View style={styles.menuItemMacros}>
          <Text style={styles.menuItemMacro}>🔥 {item.calories} kcal</Text>
          <Text style={styles.menuItemMacro}>🥩 {item.protein}g</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

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
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [showAIMealSection, setShowAIMealSection] = useState(false);
  const [showAISuggestionButton, setShowAISuggestionButton] = useState(true);
  // Thêm state cho thông tin phân tích AI
  const [aiAnalysisInfo, setAiAnalysisInfo] = useState([]);
  
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
  
  // Xử lý khi nhấn nút gợi ý AI
  const handleAISuggestion = () => {
    setShowAIModal(true);
    setLoadingAI(true);
    setAiSuggestions([]);
    setAiAnalysisInfo([]); // Reset thông tin phân tích
    
    // Reset animation
    aiTextAnim.setValue(0);
    
    // Giả lập quá trình AI đang xử lý
    setTimeout(() => {
      setLoadingAI(false);
      
      // Animate text appearance
      Animated.timing(aiTextAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
      
      // Hiển thị thông tin phân tích trước
      let analysisDelay = 300;
      analysisData.forEach((info, index) => {
        setTimeout(() => {
          setAiAnalysisInfo(prev => {
            const newInfo = [...prev, info];
            // Scroll đến cuối sau khi thêm thông tin mới
            setTimeout(() => {
              aiScrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
            return newInfo;
          });
        }, analysisDelay * (index + 1));
      });
      
      // Sau khi hiển thị thông tin phân tích, hiển thị các món ăn gợi ý
      setTimeout(() => {
        // Hiển thị các món ăn với hiệu ứng gõ chữ
        const suggestions = [];
        
        // Add breakfast suggestions
        suggestions.push({ type: 'header', text: 'Bữa sáng' });
        aiMealSuggestions.breakfast.forEach(meal => {
          suggestions.push({ type: 'meal', text: meal });
        });
        
        // Add lunch suggestions
        suggestions.push({ type: 'header', text: 'Bữa trưa' });
        aiMealSuggestions.lunch.forEach(meal => {
          suggestions.push({ type: 'meal', text: meal });
        });
        
        // Add dinner suggestions
        suggestions.push({ type: 'header', text: 'Bữa tối' });
        aiMealSuggestions.dinner.forEach(meal => {
          suggestions.push({ type: 'meal', text: meal });
        });
        
        // Hiển thị từng dòng với hiệu ứng delay
        let mealDelay = 300;
        suggestions.forEach((suggestion, index) => {
          setTimeout(() => {
            setAiSuggestions(prev => {
              const newSuggestions = [...prev, suggestion];
              // Scroll đến cuối sau khi thêm gợi ý mới
              setTimeout(() => {
                aiScrollViewRef.current?.scrollToEnd({ animated: true });
              }, 100);
              return newSuggestions;
            });
          }, mealDelay * (index + 1));
        });
      }, analysisData.length * analysisDelay + 500); // Đợi sau khi hiển thị xong thông tin phân tích
      
    }, 2000); // Thời gian giả lập AI đang xử lý
  };
  
  // Đóng modal AI và hiện thực đơn, ẩn nút gợi ý
  const closeAIModal = () => {
    setShowAIModal(false);
    // Hiện menu thực đơn
    setShowAIMealSection(true);
    // Ẩn nút gợi ý
    setShowAISuggestionButton(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      {/* Header cố định */}
      <HeaderComponent>
        <Text style={styles.headerText}>Xin chào, {userData.name}</Text>
        <View style={styles.headerRight}>
          <Image 
            source={weatherIcon} // Sử dụng state weatherIcon thay vì hardcode
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
          { paddingTop: insets.top + 30 }
        ]}
        // Thêm RefreshControl vào ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#35A55E']} // Màu của loading indicator (Android)
            tintColor="#35A55E" // Màu của loading indicator (iOS)
            title="Đang tải..." // Text hiển thị bên dưới loading indicator (iOS)
            titleColor="#35A55E" // Màu của text (iOS)
          />
        }
      >
        {/* Daily Nutrition Goals */}
        <View style={styles.nutritionSection}>
          <Text style={styles.sectionTitle}>Chế độ dinh dưỡng hàng ngày của bạn</Text>
          
          <FlatList
            data={nutritionGoals}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.nutritionList}
            renderItem={({ item, index }) => (
              <View style={[styles.nutritionCard, { backgroundColor: item.backgroundColor }]}>
                {/* Header row with label and icon */}
                <View style={styles.nutritionCardHeader}>
                  <Text style={[styles.nutritionCardLabel, { color: item.textColor }]}>
                    {item.label}
                  </Text>
                  <Image 
                    source={item.iconSource}
                    style={styles.nutritionCardIcon} 
                  />
                </View>
                
                {/* Content with value and unit */}
                <View style={styles.nutritionCardContent}>
                  <Text style={[styles.nutritionCardValue, { color: item.textColor }]}>
                    {item.value}{item.postfix}
                  </Text>
                  <Text style={[styles.nutritionCardUnit]}>
                    {item.unit}
                  </Text>
                </View>
                
                {/* Progress Bar */}
                <View style={styles.progressBarContainer}>
                  <Animated.View 
                    style={[
                      styles.progressBarFill, 
                      { 
                        backgroundColor: item.progressColor,
                        width: progressAnims[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0%', '100%']
                        })
                      }
                    ]}
                  />
                </View>
              </View>
            )}
          />
        </View>

        {/* Calendar Section */}
        <View style={styles.calendarContainer}>
          <View style={styles.calendarHeader}>
            <Text style={styles.sectionTitle}>Chế độ ăn uống</Text>
            <View style={styles.monthTitleContainer}>
              <Text style={styles.monthTitle}>{currentMonth}</Text>
            </View>
          </View>
          
          <View style={styles.calendarNavigationContainer}>
            <FlatList
              ref={flatListRef}
              data={weeks}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              initialScrollIndex={1} // Bắt đầu từ tuần hiện tại
              getItemLayout={(data, index) => ({
                length: Dimensions.get('window').width - 30,
                offset: (Dimensions.get('window').width - 30) * index,
                index,
              })}
              onMomentumScrollEnd={(event) => {
                const position = event.nativeEvent.contentOffset.x;
                // Xác định tuần hiện tại dựa trên vị trí scroll
                const newOffset = position < (Dimensions.get('window').width / 2) ? -1 : 0;
                setCurrentWeekOffset(newOffset);
              }}
              contentContainerStyle={styles.calendarFlatListContent}
              renderItem={({ item }) => (
                <View style={[
                  styles.weekContainer,
                  item.id === '0' ? styles.activeWeekContainer : null
                ]}>
                  {item.days.map((day) => (
                    <TouchableOpacity 
                      key={day.id}
                      style={[
                        styles.dateItem,
                        day.isToday ? styles.activeDateItem : null,
                        day.isFuture ? styles.futureDateItem : null,
                      ]}
                      disabled={day.isFuture}
                      onPress={() => setSelectedDate(day.date)}
                    >
                      {/* Thứ - không có viền và không có nền cho active */}
                      <Text 
                        style={[
                          styles.dayText, 
                          day.isToday ? styles.activeDayText : null,
                          day.isFuture ? styles.futureDayText : null,
                        ]}
                      >
                        {day.day}
                      </Text>
                      
                      {/* Ngày - có hình tròn với nền xanh đậm cho active */}
                      <View style={[
                        styles.dateCircle,
                        day.isToday ? styles.activeDateCircle : null,
                        day.isFuture ? styles.futureDateCircle : null,
                      ]}>
                        <Text 
                          style={[
                            styles.dateText, 
                            day.isToday ? styles.activeDateText : null,
                            day.isFuture ? styles.futureDateText : null,
                          ]}
                        >
                          {day.date}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            />
          </View>
        </View>

        {/* Thay đổi phần Recommendation Section */}
        <View style={styles.menuSection}>
          <View style={styles.menuHeader}>
            <Text style={styles.sectionTitle}>Gợi ý thực đơn hôm nay</Text>
            
            <TouchableOpacity style={styles.settingsButton}>
              <Ionicons name="options-outline" size={20} color="#35A55E" />
            </TouchableOpacity>
          </View>
          
          {/* AI recommendation card - Đã cập nhật */}
          <View style={styles.aiRecommendationCard}>
            <View style={styles.aiHeaderRow}>
              <View style={styles.aiIconContainer}>
                <Ionicons name="sparkles" size={18} color="#FFFFFF" />
              </View>
              <Text style={styles.aiHeaderText}>Gợi ý từ AI</Text>
              
              <TouchableOpacity 
                style={styles.refreshButton}
                activeOpacity={0.6}
                onPress={() => handleAISuggestion()}
              >
                <Ionicons name="refresh" size={16} color="#666666" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.aiDescription}>
              Dựa trên sở thích và mục tiêu dinh dưỡng của bạn
            </Text>
            
            {/* Chỉ hiển thị nút gợi ý nếu showAISuggestionButton = true */}
            {showAISuggestionButton && (
              <TouchableOpacity
                style={styles.aiSuggestionButton}
                onPress={() => handleAISuggestion()}
                activeOpacity={0.7}
              >
                <Text style={styles.aiSuggestionButtonText}>Gợi ý thực đơn hôm nay</Text>
                <Ionicons name="arrow-forward-circle" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            )}
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
              
              {/* Grid view cho món ăn */}
              {availableMealTabs.length > 0 && (
                <View style={styles.menuGrid}>
                  {chunkedMeals.map((row, rowIndex) => (
                    <View key={`row-${rowIndex}`} style={styles.menuRow}>
                      {row.map((item) => (
                        <React.Fragment key={item.id}>
                          {renderMenuItem(item)}
                        </React.Fragment>
                      ))}
                      {row.length === 1 && <View style={{ width: itemWidth }} />}
                    </View>
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
      
      {/* Modal gợi ý AI */}
      <Modal
        visible={showAIModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeAIModal}
      >
        <View style={styles.aiModalOverlay}>
          <View style={styles.aiModalContent}>
            <View style={styles.aiModalHeader}>
              <View style={styles.aiModalIconContainer}>
                <Ionicons name="sparkles" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.aiModalTitle}>Gợi ý từ AI</Text>
              
              <TouchableOpacity 
                style={styles.aiModalCloseButton}
                onPress={closeAIModal}
              >
                <Ionicons name="close" size={24} color="#666666" />
              </TouchableOpacity>
            </View>
            
            {/* Thay thế View bằng ScrollView để có thể cuộn khi nội dung dài */}
            <ScrollView 
              ref={aiScrollViewRef}
              style={styles.aiModalBody}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.aiModalBodyContent}
            >
              {loadingAI ? (
                <View style={styles.aiLoadingContainer}>
                  <Image 
                    source={require('../../assets/images/ai-assistant.gif')} 
                    style={styles.aiLoadingImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.aiLoadingText}>AI đang phân tích dữ liệu...</Text>
                </View>
              ) : (
                <Animated.View 
                  style={[
                    styles.aiSuggestionContainer,
                    { opacity: aiTextAnim }
                  ]}
                >
                  {/* Thêm phần hiển thị thông tin phân tích */}
                  <View style={styles.aiAnalysisContainer}>
                    <Text style={styles.aiAnalysisTitle}>Thông tin đã phân tích:</Text>
                    {aiAnalysisInfo.map((info, index) => (
                      <View key={`analysis-${index}`} style={styles.aiAnalysisItemContainer}>
                        <View style={styles.aiAnalysisCheckmarkContainer}>
                          <Text style={styles.aiAnalysisCheckmark}>✓</Text>
                        </View>
                        <Text style={styles.aiAnalysisItem}>{info.text}</Text>
                      </View>
                    ))}
                  </View>
                  
                  {/* Chỉ hiển thị phần gợi ý khi đã có ít nhất một món */}
                  {aiSuggestions.length > 0 && (
                    <>
                      <Text style={styles.aiIntroText}>
                        Dựa trên sở thích và mục tiêu dinh dưỡng của bạn, tôi gợi ý các món sau:
                      </Text>
                      
                      <View style={styles.aiMealSuggestions}>
                        {aiSuggestions.map((suggestion, index) => (
                          <Text 
                            key={index} 
                            style={suggestion.type === 'header' ? styles.aiMealHeader : styles.aiMealItem}
                          >
                            {suggestion.type === 'meal' ? '- ' : ''}{suggestion.text}
                          </Text>
                        ))}
                      </View>
                    </>
                  )}
                  
                  {aiSuggestions.length > 0 && (
                    <TouchableOpacity 
                      style={styles.aiAcceptButton}
                      onPress={closeAIModal}
                    >
                      <Text style={styles.aiAcceptButtonText}>
                        Xem thực đơn 
                      </Text>
                    </TouchableOpacity>
                  )}
                </Animated.View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
      
      {/* Sử dụng component WaterReminderSheet */}
      <WaterReminderSheet 
        isOpen={isWaterReminderSheetOpen}
        onClose={() => setIsWaterReminderSheetOpen(false)}
      />
    </SafeAreaView>
  );
}

// Cập nhật styles cho AI modal
const additionalStyles = StyleSheet.create({
  aiSuggestionButton: {
    flexDirection: 'row',
    backgroundColor: '#35A55E',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    alignSelf: 'center',
  },
  aiSuggestionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    marginRight: 8,
  },
  aiModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Làm tối hơn background
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50, // Thêm khoảng trống ở trên
  },
  aiModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20, // Bo tròn nhiều hơn
    width: '100%',
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
    marginTop: 30,
    overflow: 'hidden', // Đảm bảo các thành phần con không vượt ra ngoài
  },
  
  aiModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FCFCFC', // Thêm màu nền nhạt cho header
  },
  
  aiModalIconContainer: {
    backgroundColor: '#35A55E',
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  
  aiModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    flex: 1,
  },
  
  aiModalCloseButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  
  aiModalBody: {
    paddingHorizontal: 20,
    maxHeight: '100%',
  },
  
  aiModalBodyContent: {
    paddingVertical: 20,
    paddingBottom: 30,
  },
  
  aiLoadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    height: 250,
  },
  
  aiLoadingImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  
  aiLoadingText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  
  aiSuggestionContainer: {
    paddingVertical: 10,
  },
  
  aiAnalysisContainer: {
    marginBottom: 25,
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: 18,
    borderLeftWidth: 4,
    borderLeftColor: '#35A55E',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  
  aiAnalysisTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 15,
  },
  
  aiAnalysisItemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  
  aiAnalysisCheckmarkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  
  aiAnalysisCheckmark: {
    color: '#35A55E',
    fontWeight: 'bold',
    fontSize: 14,
  },
  
  aiAnalysisItem: {
    fontSize: 14,
    color: '#444444',
    lineHeight: 22,
    flex: 1,
  },
  
  aiIntroText: {
    fontSize: 15,
    color: '#333333',
    marginBottom: 18,
    lineHeight: 22,
    fontWeight: '500',
  },
  
  aiMealSuggestions: {
    marginBottom: 25,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 15,
  },
  
  aiMealHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#35A55E',
    marginTop: 16,
    marginBottom: 10,
  },
  
  aiMealItem: {
    fontSize: 14,
    color: '#444444',
    marginBottom: 8,
    paddingLeft: 8,
    lineHeight: 20,
  },
  
  aiAcceptButton: {
    backgroundColor: '#35A55E',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  
  aiAcceptButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  
  // ...existing code...
});

// Merge styles
Object.assign(styles, additionalStyles);