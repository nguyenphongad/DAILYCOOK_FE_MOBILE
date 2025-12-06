import React, { useState, useEffect, useRef } from 'react';
import { Text, View, ScrollView, Image, TouchableOpacity, Animated, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import HeaderComponent from '../../../components/header/HeaderComponent';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import ChangeMealSheet from '../../../components/mealPlan/ChangeMealSheet';
import MealAcceptedSheet from '../../../components/sheet/MealAcceptedSheet';
import { styles } from '../../../styles/home/RenderAIPage';

// Dữ liệu món ăn theo các bữa - thêm món thay thế
const mealsByTime = {
  breakfast: [
    {
      id: '1',
      name: 'Bánh mì trứng thịt',
      description: 'Năng lượng cho buổi sáng',
      calories: 320,
      protein: 18,
      carbs: 40,
      typeMeal: 'Món chính',
      imageUrl: require('../../../assets/images/food1.png'),
    },
    {
      id: '2',
      name: 'Cháo trứng bắc thảo',
      description: 'Nhẹ nhàng, dễ tiêu hóa',
      calories: 250,
      protein: 12,
      carbs: 35,
      typeMeal: 'Món phụ',
      imageUrl: require('../../../assets/images/food1.png'),
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
      typeMeal: 'Món chính',
      imageUrl: require('../../../assets/images/food1.png'),
    },
    {
      id: '4',
      name: 'Bún bò Huế',
      description: 'Đậm đà hương vị Huế',
      calories: 420,
      protein: 22,
      carbs: 55,
      typeMeal: 'Món phụ',
      imageUrl: require('../../../assets/images/food1.png'),
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
      typeMeal: 'Món chính',
      imageUrl: require('../../../assets/images/food1.png'),
    },
    {
      id: '6',
      name: 'Canh bí đỏ nấu tôm',
      description: 'Bổ dưỡng, dễ ngủ',
      calories: 280,
      protein: 20,
      carbs: 22,
      typeMeal: 'Tráng miệng',
      imageUrl: require('../../../assets/images/food1.png'),
    },
  ]
};

// Thêm dữ liệu món thay thế cho mỗi món
const alternativeMealsData = {
  '1': [ // Thay thế cho Bánh mì trứng thịt
    {
      id: '1a',
      name: 'Bánh mì pate',
      description: 'Hương vị truyền thống',
      calories: 300,
      protein: 15,
      carbs: 38,
      typeMeal: 'Món chính',
      imageUrl: require('../../../assets/images/food1.png'),
    },
    {
      id: '1b',
      name: 'Bánh mì thịt nướng',
      description: 'Thơm ngon, bổ dưỡng',
      calories: 340,
      protein: 20,
      carbs: 42,
      typeMeal: 'Món chính',
      imageUrl: require('../../../assets/images/food1.png'),
    },
  ],
  '2': [ // Thay thế cho Cháo trứng bắc thảo
    {
      id: '2a',
      name: 'Cháo gà',
      description: 'Bổ dưỡng, dễ tiêu',
      calories: 260,
      protein: 14,
      carbs: 33,
      typeMeal: 'Món phụ',
      imageUrl: require('../../../assets/images/food1.png'),
    },
    {
      id: '2b',
      name: 'Cháo tôm',
      description: 'Ngọt thanh, nhẹ nhàng',
      calories: 240,
      protein: 13,
      carbs: 32,
      typeMeal: 'Món phụ',
      imageUrl: require('../../../assets/images/food1.png'),
    },
  ],
  // Thêm các món thay thế khác tương tự...
};

export default function PageRenderAI() {
  const insets = useSafeAreaInsets();
  const aiScrollViewRef = useRef(null);
  
  // States cho AI
  const [showMealSection, setShowMealSection] = useState(false);
  const [activeMeal, setActiveMeal] = useState('breakfast');
  
  // Thêm states cho ChangeMealSheet
  const [isChangeMealSheetOpen, setIsChangeMealSheetOpen] = useState(false);
  const [selectedMealForChange, setSelectedMealForChange] = useState(null);
  const [currentMealsData, setCurrentMealsData] = useState(mealsByTime);
  
  // Thêm state cho MealAcceptedSheet
  const [isMealAcceptedSheetOpen, setIsMealAcceptedSheetOpen] = useState(false);
  
  // States cho chatbox - simplified
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showViewMenuButton, setShowViewMenuButton] = useState(false);

  // Animation values - simplified
  const messageAnim = useRef(new Animated.Value(0)).current;
  const typingDotsAnim = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]).current;

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

  // Tự động bắt đầu chat khi component mount
  useEffect(() => {
    startChatSequence();
  }, []);

  const startChatSequence = () => {
    // Reset chat
    setChatMessages([]);
    setIsTyping(false);
    setShowViewMenuButton(false);

    // Gửi tin nhắn đầu tiên từ user
    const currentDate = getCurrentDate();
    const userMessage = {
      id: 'user-message-' + Date.now(), // Đảm bảo ID unique
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
      
      // Hiển thị typing indicator sau 1 giây
      setTimeout(() => {
        setIsTyping(true);
        
        // Sau 5 giây, hiển thị phản hồi AI luôn (không typing từng chữ)
        setTimeout(() => {
          setIsTyping(false);
          showAIResponse();
        }, 5000);
      }, 1000);
    }, 500);
  };

  const showAIResponse = () => {
    const aiMessage = {
      id: 'ai-response-' + Date.now(), // Đảm bảo ID unique
      type: 'ai',
      text: 'Dựa trên mục tiêu dinh dưỡng và sở thích của bạn, tôi gợi ý thực đơn như sau:',
      time: getCurrentTime(),
      mealSuggestions: {
        breakfast: ['Bánh mì trứng thịt - 320 kcal', 'Cháo trứng bắc thảo - 250 kcal'],
        lunch: ['Cơm gà xối mỡ - 450 kcal', 'Bún bò Huế - 420 kcal'],
        dinner: ['Cá hồi áp chảo - 380 kcal', 'Canh bí đỏ nấu tôm - 280 kcal']
      }
    };

    // Thêm AI message
    setChatMessages(prev => [...prev, aiMessage]);
    
    // Scroll to end sau khi thêm message
    setTimeout(() => {
      aiScrollViewRef.current?.scrollToEnd({ animated: true });
    }, 200);
    
    // Scroll lại sau khi meal suggestions render xong
    setTimeout(() => {
      aiScrollViewRef.current?.scrollToEnd({ animated: true });
    }, 800);
    
    // Hiển thị nút xem thực đơn sau 1 giây
    setTimeout(() => {
      setShowViewMenuButton(true);
      
      // Scroll cuối cùng khi nút xuất hiện
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
              <Ionicons name="sparkles" size={16} color="#FFFFFF" />
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
                      {mealTime === 'breakfast' ? '🌅 Bữa sáng' : 
                       mealTime === 'lunch' ? '☀️ Bữa trưa' : '🌙 Bữa tối'}
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
              <Ionicons name="sparkles" size={16} color="#FFFFFF" />
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
    const currentMeal = currentMealsData[activeMeal].find(meal => meal.id === mealId);
    const alternatives = alternativeMealsData[mealId] || [];
    
    if (alternatives.length > 0) {
      setSelectedMealForChange({
        current: currentMeal,
        alternatives: alternatives
      });
      setIsChangeMealSheetOpen(true);
    } else {
      console.log(`No alternatives available for meal: ${mealId}`);
    }
  };

  const handleMealChange = (newMeal) => {
    // Cập nhật món ăn trong danh sách hiện tại
    setCurrentMealsData(prevData => {
      const updatedData = { ...prevData };
      const mealIndex = updatedData[activeMeal].findIndex(
        meal => meal.id === selectedMealForChange.current.id
      );
      
      if (mealIndex !== -1) {
        updatedData[activeMeal][mealIndex] = {
          ...newMeal,
          id: selectedMealForChange.current.id // Giữ nguyên ID gốc
        };
      }
      
      return updatedData;
    });
    
    console.log(`Changed meal to: ${newMeal.name}`);
  };

  // Lấy danh sách món ăn hiện tại
  const currentMeals = currentMealsData[activeMeal] || [];
  const availableMealTabs = Object.keys(currentMealsData);

  // Render một item món ăn
  const renderMenuItem = (item) => (
    <View key={item.id} style={styles.menuItemCardVertical}>
      <Image source={item.imageUrl} style={styles.menuItemImageVertical} />
      
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
            style={styles.changeButton}
            onPress={() => handleChangeMeal(item.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.changeButtonText}>Đổi món</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const handleViewMealDetail = (mealId) => {
    router.push({
      pathname: '/(stacks)/meals/MealDetail',
      params: { id: mealId }
    });
  };

  const handleAcceptMenu = () => {
    console.log('Accept menu');
    
    // Hiển thị sheet thông báo thành công thay vì navigate trực tiếp
    setIsMealAcceptedSheetOpen(true);
  };

  // Xử lý khi đóng sheet thông báo
  const handleCloseAcceptedSheet = () => {
    setIsMealAcceptedSheetOpen(false);
    
    // Truyền dữ liệu menu đã được AI gợi ý về HomeScreen
    const acceptedMeals = {
      breakfast: currentMealsData.breakfast,
      lunch: currentMealsData.lunch,
      dinner: currentMealsData.dinner,
    };
    
    // Sử dụng router.back() để quay về HomeScreen và xóa stack hiện tại
    // Sau đó truyền dữ liệu qua params
    router.back();
    
    // Delay một chút rồi navigate với dữ liệu mới để đảm bảo đã back về HomeScreen
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

  // Đóng chat và hiện thực đơn
  const closeAIModal = () => {
    setShowMealSection(true);
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
        <View />
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
                  key={`chat-message-${message.id}-${index}`} // Unique key combination
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
          /* Menu Section */
          <View style={styles.menuSection}>
            {/* Menu selector tabs */}
            <View style={styles.mealTypeTabs}>
              {availableMealTabs.map((mealType) => (
                <TouchableOpacity 
                  key={mealType}
                  style={[
                    styles.mealTypeTab,
                    { flex: 1 / availableMealTabs.length },
                    activeMeal === mealType && styles.activeMealTypeTab
                  ]}
                  onPress={() => setActiveMeal(mealType)}
                >
                  <Ionicons 
                    name={mealType === 'breakfast' ? 'sunny-outline' : 
                         mealType === 'lunch' ? 'restaurant-outline' : 'moon-outline'} 
                    size={16} 
                    color={activeMeal === mealType ? '#FFFFFF' : '#35A55E'} 
                  />
                  <Text 
                    style={[
                      styles.mealTypeText,
                      activeMeal === mealType && styles.activeMealTypeText
                    ]}
                  >
                    {mealType === 'breakfast' ? 'Sáng' : 
                     mealType === 'lunch' ? 'Trưa' : 'Tối'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            {/* Grid view cho món ăn */}
            <View style={styles.menuGrid}>
              {currentMeals.map(renderMenuItem)}
            </View>
          </View>
        )}
      </ScrollView>
      
      {/* Nút Ghi nhận thực đơn - position absolute */}
      {showMealSection && (
        <TouchableOpacity
          style={styles.acceptMenuButton}
          onPress={handleAcceptMenu}
          activeOpacity={0.7}
        >
          <Text style={styles.acceptMenuButtonText}>Ghi nhận thực đơn</Text>
          <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      )}
      
      {/* Thêm MealAcceptedSheet */}
      <MealAcceptedSheet
        isOpen={isMealAcceptedSheetOpen}
        onClose={handleCloseAcceptedSheet}
        onGoShopping={handleGoShopping}
      />
      
      {/* Thêm ChangeMealSheet */}
      <ChangeMealSheet
        isOpen={isChangeMealSheetOpen}
        onClose={() => setIsChangeMealSheetOpen(false)}
        currentMeal={selectedMealForChange?.current}
        alternativeMeals={selectedMealForChange?.alternatives || []}
        onMealChange={handleMealChange}
      />
    </SafeAreaView>
  );
}
