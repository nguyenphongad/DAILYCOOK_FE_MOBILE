import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  Animated
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import HeaderComponent from '../../../components/header/HeaderComponent';

// Dữ liệu mẫu tổng hợp dinh dưỡng
const mealData = {
  title: "Thịt kho ruốc",
  description: "Dành cho ngày làm việc",
  forMealTime: "Buổi sáng",
  typeMeal: "Món chính", // Thêm loại món
  servings: 2,
  items: 4,
  sideDish: "1 tráng miệng",
  image: require('../../../assets/images/food1.png'),
  nutritionFacts: [
    { name: "Calories", value: 290 },
    { name: "Protein", value: 15, unit: "g" },
    { name: "Carbs", value: 55, unit: "g" },
  ],
  dishes: [
    {
      id: 1, 
      name: "Thịt kho ruốc", 
      description: "Dành cho người bụnH, tăng protein",
      typeMeal: "Món chính", // Thêm loại món 
      image: require('../../../assets/images/food1.png')
    },
    {
      id: 2, 
      name: "Thịt bò xào", 
      description: "Dành cho ngày vận động cao",
      typeMeal: "Món phụ", // Thêm loại món 
      image: require('../../../assets/images/food1.png')
    }
  ],
  totalNutrition: {
    calories: 850,
    protein: 40,
    carbs: 90,
    fat: 25,
    fiber: 10
  }
};

// Hàm tạo dữ liệu cho biểu đồ tròn - cập nhật để phù hợp với định dạng của Chart Kit
const createChartData = (data) => {
  const chartColors = {
    protein: '#35A55E',  // xanh lá
    carbs: '#FF9500',    // cam
    fat: '#FF6B6B',      // đỏ
    fiber: '#6B66FF'     // tím
  };

  const chartData = Object.entries(data).map(([key, value]) => {
    if (key !== 'calories') {
      return {
        name: key,
        value,
        color: chartColors[key] || '#CCCCCC',
        legendFontColor: '#7F7F7F',
        legendFontSize: 12
      };
    }
  }).filter(Boolean); // Lọc bỏ undefined (nếu có)

  return chartData;
};

// Hàm để lấy các ngày trong tuần với offset (tuần trước, tuần này, tuần sau)
const getWeekDays = (date = new Date(), weekOffset = 0) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + (weekOffset * 7));

  const day = newDate.getDay();
  const diff = newDate.getDate() - day + (day === 0 ? -6 : 1);

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

// Component biểu đồ tròn được vẽ thủ công
const CustomPieChart = ({ data, size = 160 }) => {
  const animatedValues = useRef(data.map(() => new Animated.Value(0))).current;
  const radius = size / 2;
  const centerX = radius;
  const centerY = radius;
  const pieRadius = radius * 0.8; // Đường kính của biểu đồ nhỏ hơn so với kích thước container
  
  useEffect(() => {
    // Chạy animation cho từng phần của biểu đồ
    const animations = animatedValues.map((anim) => {
      return Animated.timing(anim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      });
    });
    
    Animated.stagger(150, animations).start();
  }, []);

  // Tính tổng giá trị
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Tạo các phần của biểu đồ tròn
  let startAngle = 0;
  const pieSegments = data.map((item, index) => {
    const percentage = item.value / total;
    const angle = percentage * 360;
    const endAngle = startAngle + angle;
    
    // Tạo đường dẫn cho hình cung
    const generatePieSegment = (animValue) => {
      const animatedAngle = animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, angle]
      });
      
      const currentEndAngle = startAngle + animatedAngle;
      
      // Convert angles to radians for tính toán sin/cos
      const startRad = (startAngle - 90) * Math.PI / 180;
      const endRad = (currentEndAngle - 90) * Math.PI / 180;
      
      // Các điểm để vẽ hình cung
      const x1 = centerX + pieRadius * Math.cos(startRad);
      const y1 = centerY + pieRadius * Math.sin(startRad);
      const x2 = centerX + pieRadius * Math.cos(endRad);
      const y2 = centerY + pieRadius * Math.sin(endRad);
      
      // Flag cho hướng vẽ
      const largeArcFlag = angle > 180 ? 1 : 0;
      
      return {
        path: [
          `M ${centerX} ${centerY}`,
          `L ${x1} ${y1}`,
          `A ${pieRadius} ${pieRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
          'Z'
        ].join(' '),
        color: item.color
      };
    };
    
    const result = (
      <AnimatedPieSegment
        key={index}
        segment={generatePieSegment(animatedValues[index])}
      />
    );
    
    // Cập nhật góc bắt đầu cho phần tiếp theo
    startAngle = endAngle;
    
    return result;
  });

  return (
    <View style={{ width: size, height: size, position: 'relative' }}>
      <View style={styles.pieContainer}>
        {pieSegments}
      </View>
    </View>
  );
};

// Component cho phần biểu đồ với animation
const AnimatedPieSegment = ({ segment }) => {
  return (
    <View 
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <View 
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: segment.color,
          clipPath: `path('${segment.path}')`,
          position: 'absolute'
        }}
      />
    </View>
  );
};

export default function MealDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id, mealTime, mealsData } = useLocalSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(mealTime || 'morning');
  const [chartData, setChartData] = useState([]);
  const [currentMeals, setCurrentMeals] = useState([]);
  
  // Width for calculations
  const screenWidth = Dimensions.get('window').width;
  
  // Map bữa ăn từ mealTime sang key trong mealsByTime
  const mapMealTimeToKey = (mealTime) => {
    switch(mealTime) {
      case 'morning':
        return 'breakfast';
      case 'noon':
        return 'lunch';
      case 'evening':
        return 'dinner';
      default:
        return 'breakfast';
    }
  }
  
  useEffect(() => {
    // Truy xuất dữ liệu món ăn theo ID
    const mealId = id || 'default';
    console.log(`Đang tải dữ liệu cho món ăn có ID: ${mealId}`);
    
    // Lấy danh sách món ăn theo bữa được chọn
    const mealTimeKey = mapMealTimeToKey(activeTab);
    
    // Sử dụng dữ liệu từ tham số
    let meals = [];
    try {
      if (mealsData) {
        const parsedData = JSON.parse(mealsData);
        meals = parsedData[mealTimeKey] || [];
      }
    } catch (error) {
      console.error("Lỗi khi phân tích dữ liệu:", error);
      meals = [];
    }
    
    setCurrentMeals(meals);
    
    // Tính toán tổng dinh dưỡng từ các món ăn
    const totalNutrition = meals.reduce((acc, meal) => {
      acc.calories += meal.calories || 0;
      acc.protein += meal.protein || 0;
      acc.carbs += meal.carbs || 0;
      // Giả định fat và fiber từ món ăn
      acc.fat += Math.round(meal.calories * 0.3 / 9) || 0; // ~30% calo từ chất béo
      acc.fiber += Math.round(meal.carbs * 0.1) || 0;      // ~10% của carbs là chất xơ
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
    
    // Tạo dữ liệu biểu đồ với định dạng phù hợp với biểu đồ tự tạo
    const data = [
      { value: totalNutrition.protein, color: '#35A55E', name: 'Protein' },
      { value: totalNutrition.carbs, color: '#FF9500', name: 'Carbs' },
      { value: totalNutrition.fat, color: '#FF6B6B', name: 'Fat' },
      { value: totalNutrition.fiber, color: '#6B66FF', name: 'Fiber' },
    ];
    setChartData(data);
  }, [id, activeTab, mealsData]);
  
  // Cập nhật danh sách món ăn khi thay đổi tab
  useEffect(() => {
    // Cập nhật lại dữ liệu khi tab thay đổi
    const mealTimeKey = mapMealTimeToKey(activeTab);
    
    // Sử dụng dữ liệu từ tham số
    let meals = [];
    try {
      if (mealsData) {
        const parsedData = JSON.parse(mealsData);
        meals = parsedData[mealTimeKey] || [];
      }
    } catch (error) {
      console.error("Lỗi khi phân tích dữ liệu:", error);
      meals = [];
    }
    
    setCurrentMeals(meals);
  }, [activeTab, mealsData]);
  
  // Hàm quay lại
  const handleGoBack = () => {
    router.back();
  };
  
  // Hàm thay đổi bữa ăn
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // Thêm hàm xử lý khi nhấn nút ghi nhận thực đơn
  const handleConfirmMenu = () => {
    // Hiển thị thông báo hoặc thực hiện các hành động liên quan đến việc ghi nhận thực đơn
    console.log('Thực đơn đã được ghi nhận');
    
    // Quay lại trang trước sau khi ghi nhận
    setTimeout(() => {
      router.back();
    }, 500);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header Component */}
      <HeaderComponent>
        <TouchableOpacity onPress={handleGoBack}>
          <Ionicons name="chevron-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết món ăn</Text>
        <TouchableOpacity>
          <Ionicons name="trophy-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </HeaderComponent>
      
      {/* Phần nội dung có thể scroll */}
      <ScrollView 
        style={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 40 }
        ]}
      >
        {/* Nutrition Summary with Pie Chart */}
        <View style={styles.nutritionSummaryContainer}>
          <View style={styles.nutritionSummaryHeader}>
            <Text style={styles.nutritionSummaryTitle}>Tổng quan dinh dưỡng</Text>
          </View>
          
          <View style={styles.nutritionSummaryContent}>
            {/* Left side - Nutrition totals */}
            <View style={styles.nutritionTotals}>
              <View style={styles.calorieTotal}>
                <Text style={styles.calorieValue}>{mealData.totalNutrition.calories}</Text>
                <Text style={styles.calorieLabel}>Calories</Text>
              </View>
              
              <View style={styles.nutritionTotalItem}>
                <View style={[styles.nutritionDot, { backgroundColor: '#35A55E' }]} />
                <Text style={styles.nutritionTotalLabel}>Protein</Text>
                <Text style={styles.nutritionTotalValue}>{mealData.totalNutrition.protein}g</Text>
              </View>
              
              <View style={styles.nutritionTotalItem}>
                <View style={[styles.nutritionDot, { backgroundColor: '#FF9500' }]} />
                <Text style={styles.nutritionTotalLabel}>Carbs</Text>
                <Text style={styles.nutritionTotalValue}>{mealData.totalNutrition.carbs}g</Text>
              </View>
              
              <View style={styles.nutritionTotalItem}>
                <View style={[styles.nutritionDot, { backgroundColor: '#FF6B6B' }]} />
                <Text style={styles.nutritionTotalLabel}>Chất béo</Text>
                <Text style={styles.nutritionTotalValue}>{mealData.totalNutrition.fat}g</Text>
              </View>
              
              <View style={styles.nutritionTotalItem}>
                <View style={[styles.nutritionDot, { backgroundColor: '#6B66FF' }]} />
                <Text style={styles.nutritionTotalLabel}>Chất xơ</Text>
                <Text style={styles.nutritionTotalValue}>{mealData.totalNutrition.fiber}g</Text>
              </View>
            </View>
            
            {/* Right side - Pie Chart */}
            <View style={styles.pieChartContainer}>
              {chartData.length > 0 && (
                <CustomPieChart data={chartData} size={160} />
              )}
              <View style={styles.caloriesOverlay}>
                <Text style={styles.caloriesValue}>{mealData.totalNutrition.calories}</Text>
                <Text style={styles.caloriesLabel}>Kcal</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Các tab buổi ăn - Sửa lại để giống với trang Home */}
        <View style={styles.mealTypeTabs}>
          <TouchableOpacity 
            style={[
              styles.mealTypeTab, 
              activeTab === 'morning' && styles.activeMealTypeTab
            ]}
            onPress={() => handleTabChange('morning')}
          >
            <Ionicons 
              name="sunny-outline" 
              size={16} 
              color={activeTab === 'morning' ? '#FFFFFF' : '#35A55E'} 
            />
            <Text 
              style={[
                styles.mealTypeText,
                activeTab === 'morning' && styles.activeMealTypeText
              ]}
            >
              Buổi sáng
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.mealTypeTab, 
              activeTab === 'noon' && styles.activeMealTypeTab
            ]}
            onPress={() => handleTabChange('noon')}
          >
            <Ionicons 
              name="restaurant-outline" 
              size={16} 
              color={activeTab === 'noon' ? '#FFFFFF' : '#35A55E'} 
            />
            <Text 
              style={[
                styles.mealTypeText,
                activeTab === 'noon' && styles.activeMealTypeText
              ]}
            >
              Buổi trưa
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.mealTypeTab, 
              activeTab === 'evening' && styles.activeMealTypeTab
            ]}
            onPress={() => handleTabChange('evening')}
          >
            <Ionicons 
              name="moon-outline" 
              size={16} 
              color={activeTab === 'evening' ? '#FFFFFF' : '#35A55E'} 
            />
            <Text 
              style={[
                styles.mealTypeText,
                activeTab === 'evening' && styles.activeMealTypeText
              ]}
            >
              Buổi tối
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Thông tin thực đơn */}
        <Text style={styles.mealTitle}>
          Thực đơn hôm nay cho {activeTab === 'morning' ? 'buổi sáng' : 
                                activeTab === 'noon' ? 'buổi trưa' : 
                                'buổi tối'}, gồm {currentMeals.length} món
        </Text>
        <Text style={styles.mealSubtitle}>
          Gồm {currentMeals.filter(item => item.typeMeal === 'Món chính').length} món chính, 
          {currentMeals.filter(item => item.typeMeal === 'Món phụ').length} món phụ, 
          {currentMeals.filter(item => item.typeMeal === 'Tráng miệng').length} tráng miệng
        </Text>
        
        {/* Hiển thị danh sách món ăn từ currentMeals */}
        {currentMeals.map((item) => (
          <View key={item.id} style={styles.foodCard}>
            <Image 
              source={typeof item.imageUrl === 'number' ? item.imageUrl : require('../../../assets/images/food1.png')} 
              style={styles.foodImage} 
            />
            <View style={styles.foodTagContainer}>
              <Text style={styles.foodTag}>A+</Text>
            </View>
            
            <View style={styles.typeMealContainer}>
              <Text style={styles.typeMealText}>{item.typeMeal}</Text>
            </View>
            
            <View style={styles.foodInfo}>
              <Text style={styles.foodName}>{item.name}</Text>
              <Text style={styles.foodDescription}>{item.description}</Text>
            </View>
            
            <View style={styles.nutritionContainer}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{item.calories}</Text>
                <Text style={styles.nutritionName}>Calories</Text>
                <View style={[styles.nutritionBar, styles.caloriesBar]} />
              </View>
              
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{item.protein}g</Text>
                <Text style={styles.nutritionName}>Protein</Text>
                <View style={[styles.nutritionBar, styles.proteinBar]} />
              </View>
              
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{item.carbs}g</Text>
                <Text style={styles.nutritionName}>Carbs</Text>
                <View style={[styles.nutritionBar, styles.carbsBar]} />
              </View>
            </View>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.removeButton}>
                <Text style={styles.removeButtonText}>Loại</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.changeButton}>
                <Text style={styles.changeButtonText}>Đổi món</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        
      </ScrollView>
      
      {/* Nút ghi nhận thực đơn - cập nhật từ "Đi chợ" */}
      <TouchableOpacity 
        style={styles.confirmMenuButton}
        onPress={handleConfirmMenu}
      >
        <Ionicons name="checkmark-circle-outline" size={22} color="#FFFFFF" style={styles.confirmMenuIcon} />
        <Text style={styles.confirmMenuText}>Ghi nhận thực đơn</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F7F3',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 0,
    paddingHorizontal: 10,
  },
  
  // Nutrition Summary styles
  nutritionSummaryContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginVertical: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  nutritionSummaryHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 10,
    marginBottom: 15,
  },
  nutritionSummaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  nutritionSummaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutritionTotals: {
    flex: 1,
    paddingRight: 10,
  },
  calorieTotal: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  calorieValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  calorieLabel: {
    fontSize: 14,
    color: '#666666',
  },
  nutritionTotalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  nutritionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  nutritionTotalLabel: {
    fontSize: 14,
    color: '#333333',
    flex: 1,
  },
  nutritionTotalValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  pieChartContainer: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // Để có thể đặt overlay lên trên biểu đồ
  },
  caloriesOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Nền mờ để text dễ đọc
    width: 80,
    height: 80,
    borderRadius: 40,
    top: 40, // Căn giữa theo chiều dọc
    left: 40, // Căn giữa theo chiều ngang
  },
  caloriesValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  caloriesLabel: {
    fontSize: 12,
    color: '#666666',
  },
  
  // Tabs styles
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
  
  // Existing styles
  mealTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginVertical: 5,
  },
  mealSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 15,
  },
  foodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  foodImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  foodTagContainer: {
    position: 'absolute',
    top: 10,
    left: 10, // Chuyển từ right sang left để không bị chồng lên typeMeal
    backgroundColor: '#FF9500',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  foodTag: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  typeMealContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#D32F2F', // Màu đỏ đậm
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 10, // Đảm bảo hiển thị trên cùng
  },
  typeMealText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF', // Chữ màu trắng
  },
  foodInfo: {
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 5,
  },
  foodName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  foodDescription: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  nutritionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  nutritionItem: {
    alignItems: 'center',
    width: '30%',
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  nutritionName: {
    fontSize: 12,
    color: '#666666',
    marginTop: 5,
  },
  nutritionBar: {
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
    backgroundColor: '#35A55E',
  },
  carbsBar: {
    backgroundColor: '#35A55E',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingBottom: 15,
    marginTop: 5,
  },
  removeButton: {
    flex: 1,
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  changeButton: {
    flex: 1,
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  changeButtonText: {
    color: '#333333',
    fontWeight: '600',
    fontSize: 16,
  },
  confirmMenuButton: {
    backgroundColor: '#35A55E',
    paddingVertical: 15,
    margin: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  confirmMenuIcon: {
    marginRight: 8,
  },
  confirmMenuText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  pieContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    backgroundColor: 'transparent',
    borderRadius: 80, // Làm tròn các góc
    overflow: 'hidden',
  },
});