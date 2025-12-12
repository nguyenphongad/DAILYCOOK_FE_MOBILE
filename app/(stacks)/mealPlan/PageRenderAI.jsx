import React, { useState, useEffect, useRef } from 'react';
import { 
  Text, 
  View, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Animated, 
  StyleSheet, 
  Dimensions, 
  Platform, 
  ToastAndroid, 
  Alert,
  ActivityIndicator // Thêm ActivityIndicator vào đây
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import HeaderComponent from '../../../components/header/HeaderComponent';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import MealAcceptedSheet from '../../../components/sheet/MealAcceptedSheet';
import { styles } from '../../../styles/home/RenderAIPage';
import { useDispatch, useSelector } from 'react-redux';
import { generateAIMealPlan, getMealPlanFromCache, getSimilarMeals, replaceMeal, saveMealPlan } from '../../../redux/thunk/mealPlanThunk';
import { clearSimilarMeals } from '../../../redux/slice/mealPlanSlice';
import SheetComponent from '../../../components/sheet/SheetComponent';
import ChangeMealModal from '../../../components/mealPlan/ChangeMealModal';

export default function PageRenderAI() {
  const insets = useSafeAreaInsets();
  const aiScrollViewRef = useRef(null);
  const dispatch = useDispatch();
  
  // States cho AI
  const [showMealSection, setShowMealSection] = useState(false);
  
  // Thêm state cho MealAcceptedSheet
  const [isMealAcceptedSheetOpen, setIsMealAcceptedSheetOpen] = useState(false);
  
  // Thêm state cho reload sheet
  const [isReloadSheetOpen, setIsReloadSheetOpen] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // States cho chatbox
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showViewMenuButton, setShowViewMenuButton] = useState(false);
  const [currentMealsData, setCurrentMealsData] = useState({});

  // Animation values - simplified
  const messageAnim = useRef(new Animated.Value(0)).current;
  const typingDotsAnim = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]).current;

  // Thêm state cho similar meals sheet
  const [isSimilarMealsSheetOpen, setIsSimilarMealsSheetOpen] = useState(false);
  const [selectedMealId, setSelectedMealId] = useState(null);
  const [selectedNewMealId, setSelectedNewMealId] = useState(null);
  const [currentOldMeal, setCurrentOldMeal] = useState(null);
  
  // Thêm state cho change meal modal
  const [isChangeMealModalVisible, setIsChangeMealModalVisible] = useState(false);
  const [selectedMealForChange, setSelectedMealForChange] = useState(null);
  
  // Redux selectors - thêm saveMealPlanLoading
  const { 
    similarMeals, 
    similarMealsLoading, 
    replaceMealLoading,
    saveMealPlanLoading
  } = useSelector(state => state.mealPlan);

  // Hàm lấy ngày hiện tại
  const getCurrentDate = () => {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Hàm lấy thời gian hiện tại
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Helper function để format date đúng
  const formatDateString = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Tự động check cache và generate AI khi component mount
  useEffect(() => {
    startChatSequence();
  }, []);

  const startChatSequence = async () => {
    // Reset chat
    setChatMessages([]);
    setIsTyping(false);
    setShowViewMenuButton(false);
    setCurrentMealsData({});

    // Gửi tin nhắn đầu tiên từ user
    const currentDate = getCurrentDate();
    const userMessage = {
      id: 'user-message-' + Date.now(),
      type: 'user',
      text: `Gợi ý thực đơn ngày ${currentDate} cho bữa sáng, trưa, tối phù hợp với dinh dưỡng`,
      time: getCurrentTime(),
    };

    // Animation cho tin nhắn user
    messageAnim.setValue(0);
    setTimeout(() => {
      setChatMessages([userMessage]);
      
      Animated.spring(messageAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 120,
        friction: 6,
      }).start();
      
      // Scroll to end
      setTimeout(() => {
        aiScrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
      
      // Hiển thị typing indicator
      setTimeout(() => {
        setIsTyping(true);
        
        // Check cache trước
        checkCacheAndGenerate();
      }, 1000);
    }, 500);
  };

  const checkCacheAndGenerate = async () => {
    try {
      console.log('=== CHECKING CACHE FIRST ===');
      
      // Gọi API check cache
      const cacheResult = await dispatch(getMealPlanFromCache()).unwrap();
      
      console.log('Cache result:', cacheResult);
      
      // Kiểm tra nếu có data trong cache và có món ăn
      const hasMealPlan = cacheResult.data?.mealPlan && 
                         Array.isArray(cacheResult.data.mealPlan) && 
                         cacheResult.data.mealPlan.length > 0;
      
      if (hasMealPlan) {
        // Có data trong cache - sử dụng luôn
        console.log('✓ Found meal plan in cache');
        setIsTyping(false);
        
        const transformedMeals = transformAPIDataToUIFormat(cacheResult.data);
        setCurrentMealsData(transformedMeals);
        showAIResponseFromAPI(cacheResult.data);
      } else {
        // Không có data trong cache - generate mới
        console.log('✗ No meal plan in cache, generating new one...');
        await generateAIMealPlanFromAPI();
      }
      
    } catch (error) {
      console.error('Error checking cache:', error);
      // Nếu lỗi khi check cache, fallback sang generate
      console.log('Fallback to generate AI meal plan');
      await generateAIMealPlanFromAPI();
    }
  };

  const generateAIMealPlanFromAPI = async () => {
    try {
      // Gọi thunk để generate meal plan
      const result = await dispatch(generateAIMealPlan()).unwrap();
      
      // Sau khi API trả về, tắt typing và hiển thị kết quả
      setIsTyping(false);
      
      // Transform API data sang format UI
      const transformedMeals = transformAPIDataToUIFormat(result.data);
      setCurrentMealsData(transformedMeals);
      
      // Hiển thị AI response
      showAIResponseFromAPI(result.data);
      
    } catch (error) {
      console.error('Error generating AI meal plan:', error);
      setIsTyping(false);
      
      // Hiển thị error message
      const errorMessage = {
        id: 'ai-error-' + Date.now(),
        type: 'ai',
        text: 'Xin lỗi, đã có lỗi xảy ra khi tạo thực đơn. Vui lòng thử lại.',
        time: getCurrentTime(),
      };
      
      setChatMessages(prev => [...prev, errorMessage]);
      
      setTimeout(() => {
        aiScrollViewRef.current?.scrollToEnd({ animated: true });
      }, 200);
    }
  };

  // Transform API data to UI format
  const transformAPIDataToUIFormat = (apiData) => {
    const transformed = {
      breakfast: [],
      lunch: [],
      dinner: []
    };

    if (!apiData || !apiData.mealPlan) return transformed;

    apiData.mealPlan.forEach(mealTime => {
      const servingTime = mealTime.servingTime; // 'breakfast', 'lunch', 'dinner'
      
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
            : require('../../../assets/images/food1.png'),
          ingredients: mealDetail.ingredientDetails || [],
          recipe: recipe || null,
        };
      });
    });

    return transformed;
  };

  const showAIResponseFromAPI = (apiData) => {
    // Tạo meal suggestions từ API data
    const mealSuggestions = {
      breakfast: [],
      lunch: [],
      dinner: []
    };

    if (apiData && apiData.mealPlan) {
      apiData.mealPlan.forEach(mealTime => {
        const servingTime = mealTime.servingTime;
        
        mealSuggestions[servingTime] = mealTime.meals.map(meal => {
          const mealDetail = meal.mealDetail;
          const calories = mealDetail.recipeDetail?.nutrition?.calories || 0;
          return `${mealDetail.nameMeal} - ${calories} kcal`;
        });
      });
    }

    const aiMessage = {
      id: 'ai-response-' + Date.now(),
      type: 'ai',
      text: 'Dựa trên mục tiêu dinh dưỡng và sở thích của bạn, tôi gợi ý thực đơn như sau:',
      time: getCurrentTime(),
      mealSuggestions: mealSuggestions
    };

    // Thêm AI message
    setChatMessages(prev => [...prev, aiMessage]);
    
    // Scroll to end
    setTimeout(() => {
      aiScrollViewRef.current?.scrollToEnd({ animated: true });
    }, 200);
    
    setTimeout(() => {
      aiScrollViewRef.current?.scrollToEnd({ animated: true });
    }, 800);
    
    // Hiển thị nút xem thực đơn
    setTimeout(() => {
      setShowViewMenuButton(true);
      
      setTimeout(() => {
        aiScrollViewRef.current?.scrollToEnd({ animated: true });
      }, 200);
    }, 1000);
  };

  // Component hiển thị tin nhắn - simplified
  const ChatMessage = React.memo(({ message, isFirst = false }) => {
    const isUser = message.type === 'user';
    
    // Auto scroll khi component render xong (đặc biệt cho AI message với meal suggestions)
    useEffect(() => {
      if (!isUser && message.mealSuggestions) {
        setTimeout(() => {
          aiScrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    }, [message.mealSuggestions]);
    
    return (
      <Animated.View 
        style={[
          styles.chatMessage, 
          isUser ? styles.userMessage : styles.aiMessage,
          isFirst && isUser ?{
            opacity: messageAnim,
            transform: [{
              translateY: messageAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              })
            }] 
          }:{}
        ]}
      >
        <View style={styles.messageWrapper}>
          {!isUser && (
            <View style={styles.aiAvatar}>
              <Ionicons name="sparkles" size={16} color="#35A55E" />
            </View>
          )}
          
          <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble]}>
            <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.aiMessageText]}>
              {message.text}
            </Text>
            
            {/* Hiển thị gợi ý món ăn nếu có */}
            {message.mealSuggestions && (
              <View style={{ marginTop: 8 }}>
                {Object.entries(message.mealSuggestions).map(([mealTime, meals]) => (
                  <View key={`suggestion-${mealTime}-${message.id}`} style={styles.mealSuggestionCard}>
                    <Text style={styles.mealTimeTitle}>
                      {mealTime === 'breakfast' ? 'Bữa sáng' : 
                       mealTime === 'lunch' ? 'Bữa trưa' : 'Bữa tối'}
                    </Text>
                    {meals.map((meal, index) => (
                      <Text key={`meal-${mealTime}-${index}-${message.id}`} style={styles.mealItem}>• {meal}</Text>
                    ))}
                  </View>
                ))}
              </View>
            )}
            
            <Text style={[styles.messageTime, isUser ? styles.userMessageTime : null]}>
              {message.time}
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  });

  // Component hiển thị typing indicator - simplified
  const TypingIndicator = React.memo(() => {
    useEffect(() => {
      let animationLoop = null;
      
      if (isTyping) {
        const startAnimation = () => {
          const animations = typingDotsAnim.map((dot, index) => 
            Animated.sequence([
              Animated.delay(index * 200),
              Animated.timing(dot, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
              }),
              Animated.timing(dot, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
              })
            ])
          );

          animationLoop = Animated.loop(Animated.parallel(animations));
          animationLoop.start();
        };

        startAnimation();
      }
      
      return () => {
        if (animationLoop) {
          animationLoop.stop();
        }
        typingDotsAnim.forEach(dot => {
          dot.stopAnimation();
          dot.setValue(0);
        });
      };
    }, [isTyping]);

    if (!isTyping) return null;

    return (
      <View key="typing-indicator" style={styles.chatMessage}>
        <View style={styles.aiMessage}>
          <View style={styles.messageWrapper}>
            <View style={styles.aiAvatar}>
              <Ionicons name="sparkles" size={16} color="#35A55E" />
            </View>
            
            <View style={[styles.messageBubble, styles.aiBubble]}>
              <View style={styles.typingIndicator}>
                <View style={styles.typingDots}>
                  {typingDotsAnim.map((anim, index) => (
                    <Animated.View 
                      key={`typing-dot-${index}`} // Unique key cho mỗi dot
                      style={[
                        styles.typingDot, 
                        { 
                          opacity: anim,
                          transform: [{
                            scale: anim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.8, 1.2],
                            })
                          }]
                        }
                      ]} 
                    />
                  ))}
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  });

  const handleChangeMeal = (mealId) => {
    // Tìm meal trong tất cả các sections
    let foundMeal = null;
    let foundServingTime = null;
    
    for (const [servingTime, meals] of Object.entries(currentMealsData)) {
      const meal = meals.find(m => m.id === mealId);
      if (meal) {
        foundMeal = meal;
        foundServingTime = servingTime;
        break;
      }
    }
    
    if (foundMeal && foundServingTime) {
      setSelectedMealForChange({ ...foundMeal, servingTime: foundServingTime });
      setIsChangeMealModalVisible(true);
    }
  };

  const handleMealReplaced = (oldMealId, newMeal) => {
    // Update currentMealsData - tìm trong tất cả sections
    setCurrentMealsData(prevData => {
      const updatedData = { ...prevData };
      
      for (const servingTime of Object.keys(updatedData)) {
        const mealIndex = updatedData[servingTime].findIndex(m => m.id === oldMealId);
        if (mealIndex !== -1) {
          updatedData[servingTime][mealIndex] = newMeal;
          break;
        }
      }
      
      return updatedData;
    });
  };

  // Hàm đóng sheet tương tự
  const handleCloseSimilarMealsSheet = () => {
    setIsSimilarMealsSheetOpen(false);
    setSelectedMealId(null);
    setSelectedNewMealId(null);
    setCurrentOldMeal(null);
    dispatch(clearSimilarMeals());
  };

  const handleSelectNewMeal = (mealId) => {
    setSelectedNewMealId(mealId);
  };

  const handleConfirmReplaceMeal = async () => {
    if (!selectedNewMealId) {
      if (Platform.OS === 'android') {
        ToastAndroid.show('Vui lòng chọn món thay thế', ToastAndroid.SHORT);
      }
      return;
    }

    try {
      const today = new Date();
      const dateString = formatDateString(today);
      
      // Tìm servingTime của meal đang được replace
      let targetServingTime = null;
      for (const [servingTime, meals] of Object.entries(currentMealsData)) {
        if (meals.find(m => m.id === selectedMealId)) {
          targetServingTime = servingTime;
          break;
        }
      }
      
      if (!targetServingTime) {
        throw new Error('Không tìm thấy serving time của món ăn');
      }
      
      console.log('Replace meal - Date string:', dateString);
      console.log('Replace meal - Serving time:', targetServingTime);
      
      await dispatch(replaceMeal({
        date: dateString,
        servingTime: targetServingTime,
        oldMealId: selectedMealId,
        newMealId: selectedNewMealId,
        portionSize: {
          amount: 1,
          unit: 'portion'
        }
      })).unwrap();

      // Update UI state
      const newMeal = similarMeals.find(meal => meal._id === selectedNewMealId);
      if (newMeal) {
        setCurrentMealsData(prevData => {
          const updatedData = { ...prevData };
          const mealIndex = updatedData[targetServingTime].findIndex(m => m.id === selectedMealId);
          
          if (mealIndex !== -1) {
            updatedData[targetServingTime][mealIndex] = {
              id: newMeal._id,
              name: newMeal.nameMeal,
              description: newMeal.description,
              calories: newMeal.recipeDetail?.nutrition?.calories || 0,
              protein: newMeal.recipeDetail?.nutrition?.protein || 0,
              carbs: newMeal.recipeDetail?.nutrition?.carbs || 0,
              fat: newMeal.recipeDetail?.nutrition?.fat || 0,
              typeMeal: newMeal.mealCategory?.title || '',
              imageUrl: newMeal.mealImage 
                ? { uri: newMeal.mealImage }
                : require('../../../assets/images/food1.png'),
            };
          }
          
          return updatedData;
        });
      }

      // Show success message
      if (Platform.OS === 'android') {
        ToastAndroid.show('Đổi món thành công!', ToastAndroid.SHORT);
      } else {
        Alert.alert('Thành công', 'Đổi món thành công!');
      }

      handleCloseSimilarMealsSheet();
    } catch (error) {
      console.error('Error replacing meal:', error);
      if (Platform.OS === 'android') {
        ToastAndroid.show('Không thể đổi món: ' + error, ToastAndroid.LONG);
      } else {
        Alert.alert('Lỗi', 'Không thể đổi món: ' + error);
      }
    }
  };

  const handleAcceptMenu = async () => {
    console.log('Accept menu - Saving meal plan...');
    
    try {
      // Format date to YYYY-MM-DD
      const today = new Date();
      const dateString = formatDateString(today);
      
      console.log('Save meal plan - Date string:', dateString);
      
      // Gọi API save meal plan
      await dispatch(saveMealPlan(dateString)).unwrap();
      
      console.log('Meal plan saved successfully');
      
      // Show success sheet
      setIsMealAcceptedSheetOpen(true);
      
    } catch (error) {
      console.error('Error saving meal plan:', error);
      if (Platform.OS === 'android') {
        ToastAndroid.show('Không thể lưu thực đơn: ' + error, ToastAndroid.LONG);
      } else {
        Alert.alert('Lỗi', 'Không thể lưu thực đơn: ' + error);
      }
    }
  };

  // Đóng chat và hiện thực đơn
  const closeAIModal = () => {
    setShowMealSection(true);
  };

  // Xử lý regenerate meal plan
  const handleRegenerateMealPlan = async () => {
    setIsReloadSheetOpen(false);
    setIsRegenerating(true);
    
    // Reset state
    setChatMessages([]);
    setShowViewMenuButton(false);
    setCurrentMealsData({});
    setShowMealSection(false);
    
    // Delay một chút để UI reset
    setTimeout(async () => {
      // Gửi lại tin nhắn user
      const currentDate = getCurrentDate();
      const userMessage = {
        id: 'user-message-' + Date.now(),
        type: 'user',
        text: `Tạo lại thực đơn ngày ${currentDate}`,
        time: getCurrentTime(),
      };
      
      setChatMessages([userMessage]);
      setIsTyping(true);
      
      // Gọi trực tiếp generate AI (không check cache)
      try {
        const result = await dispatch(generateAIMealPlan()).unwrap();
        
        setIsTyping(false);
        setIsRegenerating(false);
        
        const transformedMeals = transformAPIDataToUIFormat(result.data);
        setCurrentMealsData(transformedMeals);
        showAIResponseFromAPI(result.data);
        
      } catch (error) {
        console.error('Error regenerating meal plan:', error);
        setIsTyping(false);
        setIsRegenerating(false);
        
        const errorMessage = {
          id: 'ai-error-' + Date.now(),
          type: 'ai',
          text: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.',
          time: getCurrentTime(),
        };
        
        setChatMessages(prev => [...prev, errorMessage]);
      }
    }, 500);
  };

  const handleCloseAcceptedSheet = () => {
    setIsMealAcceptedSheetOpen(false);
    
    const acceptedMeals = {
      breakfast: currentMealsData.breakfast || [],
      lunch: currentMealsData.lunch || [],
      dinner: currentMealsData.dinner || [],
    };
    
    router.back();
    
    setTimeout(() => {
      router.replace({
        pathname: '/(tabs)/',
        params: { 
          acceptedMeals: JSON.stringify(acceptedMeals),
          showAISection: 'false'
        }
      });
    }, 100);
  };

  // Xử lý khi ấn nút "Đi chợ"
  const handleGoShopping = () => {
    setIsMealAcceptedSheetOpen(false);
    
    // Truyền dữ liệu menu về HomeScreen trước để lưu trạng thái
    const acceptedMeals = {
      breakfast: currentMealsData.breakfast,
      lunch: currentMealsData.lunch,
      dinner: currentMealsData.dinner,
    };
    
    // Quay về HomeScreen trước (xóa stack PageRenderAI)
    router.back();
    
    // Delay để đảm bảo đã quay về HomeScreen
    setTimeout(() => {
      // Replace HomeScreen với dữ liệu mới
      router.replace({
        pathname: '/(tabs)/',
        params: { 
          acceptedMeals: JSON.stringify(acceptedMeals),
          showAISection: 'false'
        }
      });
      
      // Sau đó push sang tab shopping (không tạo thêm stack cho HomeScreen)
      setTimeout(() => {
        router.push('/(tabs)/shopping');
      }, 100);
    }, 100);
  };

  // Lấy danh sách món ăn hiện tại từ Redux state hoặc local state
  const availableMealTabs = Object.keys(currentMealsData).filter(
    key => currentMealsData[key]?.length > 0
  );

  // Thứ tự hiển thị sections
  const mealTimeOrder = ['breakfast', 'lunch', 'dinner'];
  const mealTimeLabels = {
    breakfast: 'Bữa sáng',
    lunch: 'Bữa trưa',
    dinner: 'Bữa tối'
  };

  // Component riêng cho meal item với animation
  const MealItemCard = React.memo(({ item, onPress, onChangeMeal }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
        tension: 100,
        friction: 5,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 5,
      }).start();
    };

    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => onPress(item.id)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View 
          style={[
            styles.menuItemCardVerticalWithMargin,
            { transform: [{ scale: scaleAnim }] }
          ]}
        >
          <Image 
            source={item.imageUrl?.uri ? item.imageUrl : require('../../../assets/images/logo.png')}
            style={styles.menuItemImageVertical} 
          />
          
          <View style={styles.typeMealContainer}>
            <Text style={styles.typeMealText}>{item.typeMeal}</Text>
          </View>
          
          <View style={styles.menuItemContentVertical}>
            <View style={styles.menuItemInfo}>
              <Text style={styles.menuItemNameVertical}>{item.name}</Text>
              <View style={styles.menuItemMacros}>
                <Text style={styles.menuItemMacro}>🔥 {item.calories} kcal</Text>
              </View>
            </View>
            
            <View style={styles.menuItemActions}>
              <TouchableOpacity 
                style={styles.changeButton}
                onPress={(e) => {
                  e.stopPropagation();
                  onChangeMeal(item.id);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.changeButtonText}>Đổi món</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  });

  // Render một item món ăn - simplified
  const renderMenuItem = (item) => (
    <MealItemCard
      key={item.id}
      item={item}
      onPress={handleViewMealDetail}
      onChangeMeal={handleChangeMeal}
    />
  );

  const handleViewMealDetail = (mealId) => {
    router.push({
      pathname: '/(stacks)/meals/MealDetail',
      params: { id: mealId }
    });
  };

  // Lấy target nutrition từ nutritionGoals
  const getTargetNutrition = () => {
    // Nếu không có data thì return 0
    if (!nutritionGoals || !nutritionGoals.nutritionGoals) {
      return {
        calories: 0,
        protein: 0,
        fat: 0,
        carbs: 0
      };
    }

    const goals = nutritionGoals.nutritionGoals;
    const caloriesPerDay = goals.caloriesPerDay || 0;

    // Tính macro từ calories và percentages
    // 1g protein = 4 calo, 1g carbs = 4 calo, 1g fat = 9 calo
    const proteinCalories = (caloriesPerDay * (goals.proteinPercentage || 0)) / 100;
    const carbsCalories = (caloriesPerDay * (goals.carbPercentage || 0)) / 100;
    const fatCalories = (caloriesPerDay * (goals.fatPercentage || 0)) / 100;

    return {
      calories: caloriesPerDay,
      protein: Math.round(proteinCalories / 4),
      carbs: Math.round(carbsCalories / 4),
      fat: Math.round(fatCalories / 9)
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <HeaderComponent>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          {showMealSection ? 'Thực đơn AI gợi ý' : 'AI Assistant'}
        </Text>
        
        {/* Nút reload */}
        <TouchableOpacity 
          onPress={() => setIsReloadSheetOpen(true)}
          disabled={isRegenerating}
          style={{ opacity: isRegenerating ? 0.5 : 1 }}
        >
          <Ionicons 
            name="reload" 
            size={24} 
            color="white" 
          />
        </TouchableOpacity>
      </HeaderComponent>
      
      {/* Content */}
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingTop: insets.top + 30, paddingBottom: showMealSection ? 100 : 20 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {!showMealSection ? (
          /* Chat Interface */
          <View style={styles.chatContainer}>
            <ScrollView 
              ref={aiScrollViewRef}
              style={styles.aiChatContainer}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 16 }}
            >
              {chatMessages.map((message, index) => (
                <ChatMessage 
                  key={`chat-message-${message.id}-${index}`}
                  message={message} 
                  isFirst={index === 0}
                />
              ))}
              
              {isTyping && <TypingIndicator />}
            </ScrollView>
            
            {/* Nút xem thực đơn */}
            {showViewMenuButton && (
              <View style={styles.chatFooter}>
                <TouchableOpacity 
                  style={styles.viewMenuButtonSmall}
                  onPress={closeAIModal}
                >
                  <Ionicons name="restaurant" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.viewMenuButtonSmallText}>Xem thực đơn</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          /* Menu Section - Section-based layout */
          <View style={styles.menuSection}>
            {availableMealTabs.length > 0 ? (
              <>
                {/* Render meals by sections */}
                {mealTimeOrder.map((mealTime) => {
                  const meals = currentMealsData[mealTime];
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
              </>
            ) : (
              <View style={styles.emptyMenuContainer}>
                <Text style={styles.emptyMenuText}>Không có món ăn nào</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
      
      {/* Nút Ghi nhận thực đơn - position absolute */}
      {showMealSection && (
        <TouchableOpacity
          style={[
            styles.acceptMenuButton,
            saveMealPlanLoading && { opacity: 0.6 }
          ]}
          onPress={handleAcceptMenu}
          activeOpacity={0.7}
          disabled={saveMealPlanLoading}
        >
          {saveMealPlanLoading ? (
            <>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={styles.acceptMenuButtonText}>Đang lưu...</Text>
            </>
          ) : (
            <>
              <Text style={styles.acceptMenuButtonText}>Ghi nhận thực đơn</Text>
              <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>
      )}
      
      {/* Thêm MealAcceptedSheet */}
      <MealAcceptedSheet
        isOpen={isMealAcceptedSheetOpen}
        onClose={handleCloseAcceptedSheet}
        onGoShopping={handleGoShopping}
      />
      
      {/* Reload Sheet */}
      <SheetComponent
        isOpen={isReloadSheetOpen}
        onClose={() => setIsReloadSheetOpen(false)}
        snapPoints={[30]}
        position={0}
      >
        <View style={styles.reloadSheetContent}>
          <Text style={styles.reloadSheetTitle}>Tạo thực đơn mới</Text>
          <Text style={styles.reloadSheetDescription}>
            Bạn muốn tạo thực đơn mới? AI sẽ gợi ý các món ăn khác phù hợp với dinh dưỡng của bạn.
          </Text>
          
          <TouchableOpacity
            style={styles.regenerateButton}
            onPress={handleRegenerateMealPlan}
            disabled={isRegenerating}
          >
            <Ionicons name="sparkles" size={20} color="#35A55E" style={{ marginRight: 8 }} />
            <Text style={styles.regenerateButtonText}>
              {isRegenerating ? 'Đang tạo...' : 'Gợi ý thực đơn mới'}
            </Text>
          </TouchableOpacity>
        </View>
      </SheetComponent>

      {/* Similar Meals Sheet */}
      <SheetComponent
        isOpen={isSimilarMealsSheetOpen}
        onClose={handleCloseSimilarMealsSheet}
        snapPoints={[60]}
        position={0}
      >
        <View style={styles.similarMealsSheetContent}>
          <Text style={styles.similarMealsSheetTitle}>Chọn món thay thế</Text>
          
          {currentOldMeal && (
            <View style={styles.currentMealInfo}>
              <Text style={styles.currentMealLabel}>Món hiện tại:</Text>
              <Text style={styles.currentMealName}>{currentOldMeal.name}</Text>
            </View>
          )}

          {similarMealsLoading ? (
            <View style={styles.loadingContainer}>
              <Text>Đang tải món tương tự...</Text>
            </View>
          ) : (
            <ScrollView style={styles.similarMealsList}>
              {similarMeals && similarMeals.length > 0 ? similarMeals.map((meal) => (
                <TouchableOpacity
                  key={meal._id}
                  style={[
                    styles.similarMealItem,
                    selectedNewMealId === meal._id && styles.selectedSimilarMealItem
                  ]}
                  onPress={() => handleSelectNewMeal(meal._id)}
                >
                  <View style={styles.similarMealLeft}>
                    <Image
                      source={meal.mealImage ? { uri: meal.mealImage } : require('../../../assets/images/food1.png')}
                      style={styles.similarMealImage}
                    />
                    <View style={styles.similarMealInfo}>
                      <Text style={styles.similarMealName}>{meal.nameMeal}</Text>
                      <Text style={styles.similarMealDescription}>{meal.description}</Text>
                      <View style={styles.similarMealNutrition}>
                        <Text style={styles.similarMealNutritionText}>
                          🔥 {meal.recipeDetail?.nutrition?.calories || 0} kcal
                        </Text>
                        <Text style={styles.similarMealNutritionText}>
                          🥩 {meal.recipeDetail?.nutrition?.protein || 0}g
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={[
                    styles.radioButton,
                    selectedNewMealId === meal._id && styles.radioButtonSelected
                  ]}>
                    {selectedNewMealId === meal._id && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                </TouchableOpacity>
              )) : (
                <Text style={{ textAlign: 'center', color: '#666', marginTop: 20 }}>
                  Không có món tương tự
                </Text>
              )}
            </ScrollView>
          )}

          <View style={styles.similarMealsSheetActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCloseSimilarMealsSheet}
              disabled={replaceMealLoading}
            >
              <Text style={styles.cancelButtonText}>Huỷ</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.confirmButton,
                (!selectedNewMealId || replaceMealLoading) && styles.confirmButtonDisabled
              ]}
              onPress={handleConfirmReplaceMeal}
              disabled={!selectedNewMealId || replaceMealLoading}
            >
              <Text style={styles.confirmButtonText}>
                {replaceMealLoading ? 'Đang lưu...' : 'Lưu'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SheetComponent>

      {/* Change Meal Modal - Update servingTime */}
      <ChangeMealModal
        visible={isChangeMealModalVisible}
        onClose={() => {
          setIsChangeMealModalVisible(false);
          setSelectedMealForChange(null);
        }}
        currentMeal={selectedMealForChange}
        servingTime={selectedMealForChange?.servingTime}
        onMealReplaced={handleMealReplaced}
      />
    </SafeAreaView>
  );
}
