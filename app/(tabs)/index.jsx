import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import HeaderComponent from '../../components/header/HeaderComponent';
import { StatusBar } from 'expo-status-bar';

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
    unit: 'gram',
    postfix: '+',
    backgroundColor: '#FFFFFF',
    iconSource: require('../../assets/images/icons_home/protein.png'),
    textColor: '#000000',
  },
  {
    id: '2',
    label: 'Kcal',
    value: 259,
    unit: 'gram',
    postfix: '+',
    backgroundColor: '#FFDBAA',
    iconSource: require('../../assets/images/icons_home/calories.png'),
    textColor: '#000000',
  },
  {
    id: '3',
    label: 'Nước',
    value: 1200,
    unit: 'ml',
    postfix: '',
    backgroundColor: '#BAE5D0',
    iconSource: require('../../assets/images/icons_home/water-bottle.png'),
    textColor: '#000000',
  },
  // Thay đổi tài nguyên của mục Chất xơ, dùng lại icon calories đã có
  {
    id: '4',
    label: 'Chất xơ',
    value: 25,
    unit: 'gr',
    postfix: '',
    backgroundColor: '#E6F7FF',
    iconSource: require('../../assets/images/icons_home/calories.png'), // Dùng lại icon đã có
    textColor: '#000000',
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

const meals = [
  {
    id: '1',
    timeOfDay: 'Buổi sáng',
    name: 'Thịt kho ruốc',
    description: 'Dành cho ngày làm việc',
    calories: 290,
    protein: 15,
    carbs: 55,
    imageUrl: require('../../assets/images/food1.png'),
  }
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const today = new Date();
  const flatListRef = useRef(null);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0); // 0: tuần hiện tại, -1: tuần trước, ...
  const [currentMonth, setCurrentMonth] = useState(getMonthName(today.getMonth() + 1));
  const [selectedDate, setSelectedDate] = useState(today.getDate().toString());
  
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
      
      {/* Phần nội dung có thể scroll */}
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
            renderItem={({ item }) => (
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
                      <Text 
                        style={[
                          styles.dayText, 
                          day.isToday ? styles.activeDayText : null,
                          day.isFuture ? styles.futureDayText : null,
                        ]}
                      >
                        {day.day}
                      </Text>
                      <Text 
                        style={[
                          styles.dateText, 
                          day.isToday ? styles.activeDateText : null,
                          day.isFuture ? styles.futureDateText : null,
                        ]}
                      >
                        {day.date}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            />
          </View>
        </View>

        {/* Recommendation Section */}
        <View style={styles.recommendationContainer}>
          <View style={styles.recommendationContent}>
            <Ionicons name="sunny" size={24} color="#FFD700" style={styles.recommendationIcon} />
            <Text style={styles.recommendationText}>
              Dựa vào các thông tin dinh dưỡng của bạn, tôi đề xuất thực đơn cho 3 bữa chính trong ngày
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.greenButton}>
              <Text style={styles.buttonText}>Chọn thực phẩm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.orangeButton}>
              <Text style={styles.buttonText}>Tạo thực đơn mới</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Meal Times */}
        <View style={styles.mealTimeContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.mealTimeScrollView}>
            <TouchableOpacity style={styles.mealTimeButton}>
              <Text style={styles.mealTimeText}>Buổi sáng</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.mealTimeButton, { backgroundColor: '#38B74C', marginHorizontal: 10 }]}>
              <Text style={styles.mealTimeText}>Buổi trưa</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mealTimeButton}>
              <Text style={styles.mealTimeText}>Buổi tối</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Food Items */}
        {meals.map((meal) => (
          <View key={meal.id} style={styles.mealItemContainer}>
            <View style={styles.mealCard}>
              <Image source={meal.imageUrl} style={styles.mealImage} />
              <View style={styles.mealOverlay}>
                <Text style={styles.mealType}>{meal.timeOfDay}</Text>
                <Text style={styles.mealName}>{meal.name}</Text>
                <Text style={styles.mealDescription}>{meal.description}</Text>
              </View>
            </View>
            
            <View style={styles.nutritionInfoContainer}>
              <View style={styles.nutritionInfoItem}>
                <Text style={styles.nutritionInfoValue}>{meal.calories}</Text>
                <Text style={styles.nutritionInfoLabel}>Calories</Text>
                <View style={[styles.progressBar, styles.caloriesBar]} />
              </View>
              
              <View style={styles.nutritionInfoItem}>
                <Text style={styles.nutritionInfoValue}>{meal.protein}</Text>
                <Text style={styles.nutritionInfoLabel}>Protein</Text>
                <View style={[styles.progressBar, styles.proteinBar]} />
              </View>
              
              <View style={styles.nutritionInfoItem}>
                <Text style={styles.nutritionInfoValue}>{meal.carbs}</Text>
                <Text style={styles.nutritionInfoLabel}>Carb (g)</Text>
                <View style={[styles.progressBar, styles.carbsBar]} />
              </View>
            </View>
            
            <TouchableOpacity style={styles.detailsButton}>
              <Text style={styles.detailsButtonText}>Chi tiết thực đơn</Text>
            </TouchableOpacity>
          </View>
        ))}
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
    flex: 1,
    marginTop: 'auto',
    marginBottom: 5,
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
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    marginHorizontal: 3, // Thêm khoảng cách nhỏ giữa các ngày
  },
  activeDateItem: {
    backgroundColor: '#35A55E', // Màu chủ đạo đã thay đổi từ #38B74C
  },
  futureDateItem: {
    backgroundColor: '#E0E0E0',
  },
  dayText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  activeDayText: {
    color: 'white',
  },
  activeDateText: {
    color: 'white',
  },
  futureDayText: {
    color: '#999',
  },
  futureDateText: {
    color: '#999',
  },
  
  recommendationContainer: {
    backgroundColor: '#F5F5F5',
    margin: 15,
    borderRadius: 10,
    padding: 15,
  },
  recommendationContent: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  recommendationIcon: {
    marginRight: 10,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  greenButton: {
    backgroundColor: '#35A55E', // Màu chủ đạo đã thay đổi từ #38B74C
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  orangeButton: {
    backgroundColor: '#E86F50',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
  mealTimeContainer: {
    marginBottom: 15,
  },
  mealTimeScrollView: {
    paddingHorizontal: 15,
  },
  mealTimeButton: {
    backgroundColor: '#35A55E', // Màu chủ đạo đã thay đổi từ #38B74C
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  mealTimeText: {
    color: 'white',
    fontWeight: '500',
  },
  mealItemContainer: {
    marginHorizontal: 15,
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mealCard: {
    position: 'relative',
    height: 180,
  },
  mealImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  mealOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
    justifyContent: 'flex-end',
    paddingHorizontal: 15,
    paddingBottom: 15,
    backgroundColor: 'rgba(0,0,0,0.5)', // Thay thế gradient bằng một màu nền có độ trong suốt
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  mealType: {
    color: 'white',
    fontSize: 12,
    marginBottom: 4,
  },
  mealName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  mealDescription: {
    color: 'white',
    fontSize: 14,
  },
  nutritionInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  nutritionInfoItem: {
    alignItems: 'center',
    width: '30%',
  },
  nutritionInfoValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  nutritionInfoLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginTop: 5,
    position: 'relative',
  },
  caloriesBar: {
    backgroundColor: '#FF9500',
  },
  proteinBar: {
    backgroundColor: '#35A55E', // Màu chủ đạo đã thay đổi từ #38B74C
  },
  carbsBar: {
    backgroundColor: '#35A55E', // Màu chủ đạo đã thay đổi từ #4CAF50
  },
  detailsButton: {
    backgroundColor: '#35A55E', // Màu chủ đạo đã thay đổi từ #38B74C
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  detailsButtonText: {
    color: 'white',
    fontWeight: '500',
  },
});