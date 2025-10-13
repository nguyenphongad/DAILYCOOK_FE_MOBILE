import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, FlatList, Dimensions, Animated } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import HeaderComponent from '../../components/header/HeaderComponent';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

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

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const today = new Date();
  const flatListRef = useRef(null);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0); // 0: tuần hiện tại, -1: tuần trước, ...
  const [currentMonth, setCurrentMonth] = useState(getMonthName(today.getMonth() + 1));
  const [selectedDate, setSelectedDate] = useState(today.getDate().toString());
  
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
  
  // Thêm state cho bộ lọc bữa ăn - đổi tên để phù hợp với dữ liệu
  const [activeMeal, setActiveMeal] = useState('breakfast'); // breakfast, lunch, dinner
  
  // Lấy danh sách món ăn hiện tại dựa trên tab đã chọn
  const currentMeals = mealsByTime[activeMeal] || [];
  
  // Hàm xem chi tiết thực đơn
  const handleViewFullMenu = () => {
    router.push({
      pathname: '/(stacks)/meals/MealDetail',
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      {/* Header cố định */}
      <HeaderComponent>
        <Text style={styles.headerText}>Xin chào, {userData.name}</Text>
        <Image 
          source={require('../../assets/images/icons_home/sun.png')} 
          style={styles.weatherIcon} 
        />
      </HeaderComponent>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        style={styles.scrollContainer}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingTop: insets.top + 40 }
        ]}
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
          
          {/* AI recommendation card - Di chuyển lên trên */}
          <View style={styles.aiRecommendationCard}>
            <View style={styles.aiHeaderRow}>
              <View style={styles.aiIconContainer}>
                <Ionicons name="sparkles" size={18} color="#FFFFFF" />
              </View>
              <Text style={styles.aiHeaderText}>Gợi ý từ AI</Text>
              
              <TouchableOpacity 
                style={styles.refreshButton}
                activeOpacity={0.6}
              >
                <Ionicons name="refresh" size={16} color="#666666" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.aiDescription}>
              Dựa trên sở thích và mục tiêu dinh dưỡng của bạn
            </Text>
          </View>
          
          {/* Menu selector tabs */}
          <View style={styles.mealTypeTabs}>
            <TouchableOpacity 
              style={[
                styles.mealTypeTab, 
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
                Buổi sáng
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.mealTypeTab, 
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
                Buổi trưa
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.mealTypeTab, 
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
                Buổi tối
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Thay thế FlatList ngang bằng grid view */}
          <View style={styles.menuGrid}>
            {chunkedMeals.map((row, rowIndex) => (
              <View key={`row-${rowIndex}`} style={styles.menuRow}>
                {row.map((item) => (
                  <React.Fragment key={item.id}>
                    {renderMenuItem(item)}
                  </React.Fragment>
                ))}
                {/* Nếu hàng chỉ có 1 item, thêm placeholder để căn đều */}
                {row.length === 1 && <View style={{ width: itemWidth }} />}
              </View>
            ))}
          </View>
          
          {/* Nút xem chi tiết thực đơn - thay thế menuActionButtons */}
          <TouchableOpacity 
            style={styles.viewFullMenuButton}
            onPress={handleViewFullMenu}
          >
            <Text style={styles.viewFullMenuText}>Chi tiết thực đơn</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D4E9E1',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20, // Thêm padding dưới để tránh bị cắt nội dung
    
  },
  headerText: {
    fontSize: 18,
    fontWeight: '500',
    color: 'white',
  },
  weatherIcon: {
    width: 30,
    height: 30,
  },
  // Xóa bỏ nutritionContainer cũ
  
  // Thêm style mới cho phần nutrition
  nutritionSection: {
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  nutritionList: {
    paddingRight: 10,
    marginTop:15
  },
  nutritionCard: {
    width: 140,
    height: 120,
    borderRadius: 15,
    marginRight: 12,
    padding: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
    marginBottom: 5,
    justifyContent: 'space-between', // Để phân bố không gian đều
  },
  nutritionCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  nutritionCardIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  nutritionCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8, // Thêm khoảng cách trước thanh tiến trình
  },
  nutritionCardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 5,
  },
  nutritionCardUnit: {
    fontSize: 14,
    color: '#777777', // Màu nhạt hơn
    marginBottom: 3, // Để căn chỉnh với giá trị
  },
  nutritionCardLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  
  calendarContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 0, // Xóa margin bottom để căn đều với monthTitle
  },
  monthTitleContainer: {
    backgroundColor: 'rgba(53, 165, 94, 0.2)', // Màu xanh chủ đạo mờ nhạt
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#35A55E', 
  },
  
  calendarNavigationContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  calendarFlatListContent: {
    // Giữ trống hoặc thêm padding nếu cần
  },
  weekContainer: {
    width: Dimensions.get('window').width - 20, // Tăng kích thước lên vì không còn nút điều hướng
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    alignSelf: 'center', // Căn giữa tuần
  },
  dateItem: {
    width: 40, 
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:25,
    backgroundColor: 'transparent', 
    marginHorizontal: 3,
    // Thêm viền xanh nhạt cho tất cả các item ngày
    borderWidth: 1,
    borderColor: 'rgba(53, 165, 94, 0.3)',
  },
  activeDateItem: {
    backgroundColor: 'transparent', 
    // Viền xanh đậm cho item ngày active
    borderWidth: 1,
    borderColor: '#35A55E',
  },
  futureDateItem: {
    backgroundColor: 'transparent', 
    // Viền xám nhạt cho ngày tương lai
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dayText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
    fontWeight: '400',
  },
  activeDayText: {
    color: '#35A55E', // Chỉ đổi màu chữ mà không đổi nền
    fontWeight: '600',
  },
  futureDayText: {
    color: '#999',
  },
  
  // Điều chỉnh lại style của date circle (không cần viền vì đã có viền ở item cha)
  dateCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 0, // Bỏ viền của circle
  },
  activeDateCircle: {
    backgroundColor: '#35A55E', // Nền xanh đậm cho ngày active
    borderWidth: 0,
  },
  futureDateCircle: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  
  menuSection: {
    marginTop: 10,
    marginHorizontal: 15,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  settingsButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(53, 165, 94, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mealTypeTabs: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  mealTypeTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(53, 165, 94, 0.1)',
    borderRadius: 20,
    marginRight: 10,
  },
  activeMealTypeTab: {
    backgroundColor: '#35A55E',
  },
  mealTypeText: {
    fontSize: 14,
    color: '#35A55E',
    marginLeft: 5,
  },
  activeMealTypeText: {
    color: '#FFFFFF',
  },
  aiRecommendationCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  aiHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFB800',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  aiHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
  },
  refreshButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  menuGrid: {
    marginTop: 5,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  menuItemCard: {
    // Xóa chiều rộng cố định
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  menuItemImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  menuItemContent: {
    padding: 10,
  },
  menuItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 5,
  },
  menuItemMacros: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  menuItemMacro: {
    fontSize: 12,
    color: '#666666',
  },
  viewFullMenuButton: {
    backgroundColor: '#35A55E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 15,
    marginBottom: 20,
  },
  viewFullMenuText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
  
  // Cập nhật mealItemContainer để tương thích với thiết kế mới
  mealItemContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  
  // Thêm style cho typeMeal
  typeMealContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#D32F2F', // Màu đỏ đậm
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeMealText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF', // Chữ màu trắng
  },
  
  // Thay đổi màu chữ cho activeDateText từ xanh sang trắng
  activeDateText: {
    color: '#FFFFFF', // Đổi màu chữ thành trắng cho ngày active
    fontWeight: '600',
  },
});