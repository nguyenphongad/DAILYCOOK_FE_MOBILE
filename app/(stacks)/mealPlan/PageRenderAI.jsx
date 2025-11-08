import React, { useState, useEffect, useRef } from 'react';
import { Text, View, ScrollView, Image, TouchableOpacity, Animated, Modal, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import HeaderComponent from '../../../components/header/HeaderComponent';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

// Dữ liệu món ăn theo các bữa
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

export default function PageRenderAI() {
  const insets = useSafeAreaInsets();
  const aiScrollViewRef = useRef(null);
  
  // States cho AI
  const [showAIModal, setShowAIModal] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [showMealSection, setShowMealSection] = useState(false);
  const [aiAnalysisInfo, setAiAnalysisInfo] = useState([]);
  const [activeMeal, setActiveMeal] = useState('breakfast');
  const [aiProcessComplete, setAiProcessComplete] = useState(false); // Thêm state để track quá trình AI
  
  // Animation values
  const aiTextAnim = useRef(new Animated.Value(0)).current;
  
  // Dữ liệu phân tích của AI
  const analysisData = [
    { type: 'analysis', text: 'Thành viên: 1 người' },
    { type: 'analysis', text: 'Dinh dưỡng mục tiêu: Protein 250g, Kcal 500, Nước 2000ml' },
    { type: 'analysis', text: 'Thực phẩm không thích (4): Hành tây, Nấm, Đậu phụ, Cà tím' },
  ];
  
  // Dữ liệu gợi ý AI
  const aiMealSuggestions = {
    breakfast: ["Bánh mì trứng thịt - 320 calo", "Cháo trứng bắc thảo - 250 calo"],
    lunch: ["Cơm gà xối mỡ - 450 calo", "Bún bò Huế - 420 calo"],
    dinner: ["Cá hồi áp chảo - 380 calo", "Canh bí đỏ nấu tôm - 280 calo"],
  };

  // Tự động chạy AI khi component mount
  useEffect(() => {
    startAIProcess();
  }, []);

  const startAIProcess = () => {
    setLoadingAI(true);
    setAiSuggestions([]);
    setAiAnalysisInfo([]);
    setAiProcessComplete(false); // Reset trạng thái
    
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
            setTimeout(() => {
              aiScrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
            return newInfo;
          });
        }, analysisDelay * (index + 1));
      });
      
      // Sau khi hiển thị thông tin phân tích, hiển thị các món ăn gợi ý
      setTimeout(() => {
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
              setTimeout(() => {
                aiScrollViewRef.current?.scrollToEnd({ animated: true });
              }, 100);
              
              // Khi hiển thị xong suggestion cuối cùng thì enable nút
              if (index === suggestions.length - 1) {
                setTimeout(() => {
                  setAiProcessComplete(true);
                }, 500);
              }
              
              return newSuggestions;
            });
          }, mealDelay * (index + 1));
        });
      }, analysisData.length * analysisDelay + 500);
      
    }, 2000);
  };
  
  // Đóng modal AI và hiện thực đơn
  const closeAIModal = () => {
    setShowAIModal(false);
    setShowMealSection(true);
  };

  // Lấy danh sách món ăn hiện tại
  const currentMeals = mealsByTime[activeMeal] || [];
  const availableMealTabs = Object.keys(mealsByTime);

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

  const handleChangeMeal = (mealId) => {
    console.log(`Change meal: ${mealId}`);
  };

  const handleAcceptMenu = () => {
    console.log('Accept menu');
    // Có thể navigate về trang chính hoặc hiển thị thông báo thành công
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <HeaderComponent>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Tạo kế hoạch thực đơn</Text>
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
        {showMealSection && (
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
      
      {/* Modal gợi ý AI */}
      <Modal
        visible={showAIModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {}} // Prevent closing by back button
      >
        <View style={styles.aiModalOverlay}>
          <View style={styles.aiModalContent}>
            <View style={styles.aiModalHeader}>
              <View style={styles.aiModalIconContainer}>
                <Ionicons name="sparkles" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.aiModalTitle}>Gợi ý từ AI</Text>
              {/* Xóa nút close */}
            </View>
            
            <ScrollView 
              ref={aiScrollViewRef}
              style={styles.aiModalBody}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.aiModalBodyContent}
            >
              {loadingAI ? (
                <View style={styles.aiLoadingContainer}>
                  <Image 
                    source={require('../../../assets/images/ai-assistant.gif')} 
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
                  {/* Thông tin phân tích */}
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
                  
                  {/* Gợi ý món ăn */}
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
                      
                      {/* Thêm khoảng trống để tránh che nút */}
                      <View style={{ height: 80 }} />
                    </>
                  )}
                </Animated.View>
              )}
            </ScrollView>
            
            {/* Nút Xem thực đơn - cố định ở dưới modal */}
            <View style={styles.aiModalFooter}>
              <TouchableOpacity 
                style={[
                  styles.aiAcceptButtonFixed,
                  { opacity: aiProcessComplete ? 1 : 0.5 }
                ]}
                onPress={aiProcessComplete ? closeAIModal : null}
                disabled={!aiProcessComplete}
              >
                <Text style={styles.aiAcceptButtonText}>
                  Xem thực đơn 
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '500',
    color: 'white',
  },
  menuSection: {
    marginTop: 10,
    marginHorizontal: 15,
  },
  mealTypeTabs: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'space-between',
    width: '100%',
  },
  mealTypeTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(53, 165, 94, 0.1)',
    borderRadius: 20,
    justifyContent: 'center',
    marginRight: 8,
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
  menuGrid: {
    marginTop: 5,
  },
  menuItemCardVertical: {
    flexDirection: 'row',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 12,
    padding: 12,
  },
  menuItemImageVertical: {
    width: 80,
    height: 80,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  menuItemContentVertical: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  menuItemInfo: {
    flex: 1,
  },
  menuItemNameVertical: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 8,
    lineHeight: 18,
  },
  menuItemMacros: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  menuItemMacro: {
    fontSize: 12,
    color: '#666666',
  },
  menuItemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewDetailButton: {
    backgroundColor: '#F0F8F0',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#35A55E',
  },
  viewDetailButtonText: {
    fontSize: 12,
    color: '#35A55E',
    fontWeight: '500',
  },
  changeButton: {
    backgroundColor: '#FFF3E0',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#FF9800',
  },
  changeButtonText: {
    fontSize: 12,
    color: '#FF9800',
    fontWeight: '500',
  },
  typeMealContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#D32F2F',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  typeMealText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  acceptMenuButton: {
    position: 'absolute',
    bottom: 50,
    left: 15,
    right: 15,
    flexDirection: 'row',
    backgroundColor: '#35A55E',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  acceptMenuButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    marginRight: 8,
  },
  // AI Modal styles
  aiModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  
  aiModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    height: '80%', // Chiều cao cố định
    maxWidth: 400,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    flexDirection: 'column',
  },
  
  aiModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // Thay đổi từ space-between
    padding: 16,
    backgroundColor: '#35A55E',
  },

  aiModalTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  aiModalBody: {
    flex: 1, // Chiếm toàn bộ không gian còn lại
  },
  
  aiModalBodyContent: {
    padding: 16,
    // paddingBottom: 20,
  },
  
  // Thêm footer cho modal
  aiModalFooter: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  
  // Nút cố định trong modal
  aiAcceptButtonFixed: {
    backgroundColor: '#35A55E',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  
  // Xóa aiAcceptButton style cũ vì không dùng nữa
  
  aiLoadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  aiLoadingImage: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  aiLoadingText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  aiSuggestionContainer: {
    // Để trống cho animation
  },
  aiAnalysisContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  aiAnalysisTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 12,
  },
  aiAnalysisItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiAnalysisCheckmarkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#28A745',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  aiAnalysisCheckmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  aiAnalysisItem: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
    fontWeight: '400',
  },
  aiIntroText: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 12,
    lineHeight: 20,
  },
  aiMealSuggestions: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  aiMealHeader: {
    fontSize: 16,
    fontWeight: '500',
    color: '#35A55E',
    marginBottom: 8,
  },
  aiMealItem: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 4,
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
});
