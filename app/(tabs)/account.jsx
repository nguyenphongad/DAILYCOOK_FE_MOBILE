import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, Image, Text, View, TouchableOpacity, FlatList, Animated, RefreshControl } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import HeaderComponent from '../../components/header/HeaderComponent';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import LogoutConfirmSheet from '../../components/sheet/LogoutConfirmSheet';
import AppInfoSheet from '../../components/sheet/AppInfoSheet';
import { useDispatch, useSelector } from 'react-redux';
import { checkTokenAndGetUser, logoutUser } from '../../redux/thunk/authThunk';
import { getNutritionGoals } from '../../redux/thunk/surveyThunk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../../styles/AccoutPage';


// Danh sách các mục trong phần Dinh Dưỡng
const nutritionItems = [
  {
    id: 'nutrition-goals',
    title: 'Chế độ dinh dưỡng hàng ngày',
    icon: require('../../assets/images/icons_account/s1.png'),
    navigateTo: '/(stacks)/account/NutritionGoals',
    badge: null,
    rightComponent: 'arrow'
  },
  {
    id: 'personal-info',
    title: 'Thông tin thể trạng',
    icon: require('../../assets/images/icons_account/s1.png'),
    navigateTo: '/(stacks)/account/PersonalInfo',
    badge: null,
    rightComponent: 'arrow'
  },
  {
    id: 'surveyinfo',
    title: 'Khảo sát',
    icon: require('../../assets/images/icons_account/s1.png'),
    navigateTo: '/(stacks)/account/Questions',
    badge: null,
    rightComponent: 'arrow'
  },
  {
    id: 'goals',
    title: 'Mục tiêu',
    icon: require('../../assets/images/icons_account/s2.png'),
    navigateTo: '/account/goals',
    badge: null,
    rightComponent: 'arrow'
  },
  // {
  //   id: 'diet',
  //   title: 'Chế độ ăn',
  //   icon: require('../../assets/images/icons_account/s3.png'),
  //   navigateTo: '/account/DietType',
  //   badge: null,
  //   rightComponent: 'arrow'
  // },
  {
    id: 'disliked-food',
    title: 'Thực phẩm không thích',
    icon: require('../../assets/images/icons_account/s4.png'),
    navigateTo: '/account/disliked-food',
    badge: 4,
    badgeColor: '#E86F50',
    rightComponent: 'arrow'
  },
  // {
  //   id: 'cooking-skills',
  //   title: 'Kĩ năng nấu ăn',
  //   icon: require('../../assets/images/icons_account/s5.png'),
  //   navigateTo: '/nutrition/cooking-skills',
  //   badge: null,
  //   rightComponent: 'text',
  //   rightText: 'Cơ bản'
  // },
];

// Danh sách các mục trong phần Kế Hoạch
const planItems = [
  {
    id: 'meal-schedule',
    title: 'Kế hoạch thực đơn',
    icon: require('../../assets/images/icons_account/s6-1.png'),
    navigateTo: '/plan/meal-schedule',
    badge: null,
    rightComponent: 'arrow'
  },
  {
    id: 'meal-history',
    title: 'Lịch sử thực đơn',
    icon: require('../../assets/images/icons_account/s6.png'),
    navigateTo: '/plan/meal-history',
    badge: null,
    rightComponent: 'arrow'
  },
  {
    id: 'water-reminder',
    title: 'Cài đặt nhắc uống nước',
    icon: require('../../assets/images/icons_account/s7.png'),
    navigateTo: '/(stacks)/account/WaterReminderSettings',
    badge: null,
    rightComponent: 'arrow'
  },
];

// Danh sách các mục trong phần Chung
const generalItems = [
  {
    id: 'app-info',
    title: 'Thông tin ứng dụng',
    icon: require('../../assets/images/icons_account/s8.png'),
    navigateTo: null, // Không cần navigateTo vì sẽ mở sheet tại chỗ
    badge: null,
    rightComponent: 'arrow'
  },
];

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  // Redux selectors
  const { user, isLoading, error, isAuthenticated } = useSelector((state) => state.auth);
  const { nutritionGoals: nutritionGoalsData, nutritionGoalsLoading } = useSelector((state) => state.survey);

  const [isLogoutSheetOpen, setIsLogoutSheetOpen] = useState(false);
  const [isAppInfoSheetOpen, setIsAppInfoSheetOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Khởi tạo refs cho animation - fix: khởi tạo với 4 phần tử
  const progressAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]).current;

  // Fetch user info và nutrition goals khi component mount
  useEffect(() => {
    dispatch(checkTokenAndGetUser());
    dispatch(getNutritionGoals());
  }, [dispatch]);

  // Tạo nutritionGoals từ API data hoặc fallback
  const nutritionGoals = nutritionGoalsData?.hasGoals ? [
    {
      id: '1',
      label: 'Kcal',
      value: nutritionGoalsData.nutritionGoals.caloriesPerDay,
      maxValue: nutritionGoalsData.nutritionGoals.caloriesPerDay,
      unit: 'kcal',
      backgroundColor: '#FFDBAA',
      progressColor: '#FF8C00',
    },
    {
      id: '2',
      label: 'Protein',
      value: Math.round(nutritionGoalsData.nutritionGoals.caloriesPerDay * (nutritionGoalsData.nutritionGoals.proteinPercentage / 100) / 4),
      maxValue: Math.round(nutritionGoalsData.nutritionGoals.caloriesPerDay * (nutritionGoalsData.nutritionGoals.proteinPercentage / 100) / 4),
      unit: 'g',
      percentage: nutritionGoalsData.nutritionGoals.proteinPercentage,
      backgroundColor: '#FFFFFF',
      progressColor: '#38B74C',
    },
    {
      id: '3',
      label: 'Carbs',
      value: Math.round(nutritionGoalsData.nutritionGoals.caloriesPerDay * (nutritionGoalsData.nutritionGoals.carbPercentage / 100) / 4),
      maxValue: Math.round(nutritionGoalsData.nutritionGoals.caloriesPerDay * (nutritionGoalsData.nutritionGoals.carbPercentage / 100) / 4),
      unit: 'g',
      percentage: nutritionGoalsData.nutritionGoals.carbPercentage,
      backgroundColor: '#E6F7FF',
      progressColor: '#4169E1',
    },
    {
      id: '4',
      label: 'Chất béo',
      value: Math.round(nutritionGoalsData.nutritionGoals.caloriesPerDay * (nutritionGoalsData.nutritionGoals.fatPercentage / 100) / 9),
      maxValue: Math.round(nutritionGoalsData.nutritionGoals.caloriesPerDay * (nutritionGoalsData.nutritionGoals.fatPercentage / 100) / 9),
      unit: 'g',
      percentage: nutritionGoalsData.nutritionGoals.fatPercentage,
      backgroundColor: '#FFE4E1',
      progressColor: '#FF69B4',
    }
  ] : [
    {
      id: '1',
      label: 'Kcal',
      value: 0,
      maxValue: 2000,
      unit: 'kcal',
      backgroundColor: '#FFDBAA',
      progressColor: '#FF8C00',
    },
    {
      id: '2',
      label: 'Protein',
      value: 0,
      maxValue: 150,
      unit: 'g',
      backgroundColor: '#FFFFFF',
      progressColor: '#38B74C',
    },
    {
      id: '3',
      label: 'Carbs',
      value: 0,
      maxValue: 250,
      unit: 'g',
      backgroundColor: '#E6F7FF',
      progressColor: '#4169E1',
    },
    {
      id: '4',
      label: 'Chất béo',
      value: 0,
      maxValue: 70,
      unit: 'g',
      backgroundColor: '#FFE4E1',
      progressColor: '#FF69B4',
    }
  ];

  // Chạy animation khi nutritionGoals thay đổi
  useEffect(() => {
    if (nutritionGoals && nutritionGoals.length > 0) {
      const animations = progressAnims.map((anim, index) => {
        const goal = nutritionGoals[index];
        if (!goal) return null;
        
        const progressPercentage = goal.maxValue > 0 
          ? Math.min(goal.value / goal.maxValue, 1) 
          : 0;
          
        return Animated.timing(anim, {
          toValue: progressPercentage,
          duration: 1000,
          delay: 300 + index * 200,
          useNativeDriver: false
        });
      }).filter(Boolean); // Lọc bỏ null

      if (animations.length > 0) {
        Animated.stagger(100, animations).start();
      }
    }
  }, [nutritionGoals, nutritionGoalsData]); // Thêm dependency

  // Hàm xử lý khi nhấn vào một mục
  const handleItemPress = (item) => {
    if (item.id === 'app-info') {
      setIsAppInfoSheetOpen(true);
    } else if (item.navigateTo) {
      router.push(item.navigateTo);
    }
  };

  // Hàm xử lý đăng xuất - sử dụng Redux thunk
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      console.log('User logged out successfully');

      // Navigate to login hoặc index page
      // router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Hàm xử lý refresh
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Reload cả user info và nutrition goals
      await Promise.all([
        dispatch(checkTokenAndGetUser()),
        dispatch(getNutritionGoals())
      ]);
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Component hiển thị một mục trong danh sách
  const renderListItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.listItem}
      onPress={() => handleItemPress(item)}
    >
      <View style={styles.listItemLeft}>
        <Image source={item.icon} style={styles.listItemIcon} />
        <Text style={styles.listItemText}>{item.title}</Text>
      </View>

      <View style={styles.listItemRight}>
        {item.badge && (
          <View style={[styles.badge, { backgroundColor: item.badgeColor || '#E86F50' }]}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        )}

        {item.rightComponent === 'arrow' && (
          <Ionicons name="chevron-forward" size={22} color="#CCCCCC" />
        )}

        {item.rightComponent === 'text' && (
          <Text style={styles.rightText}>{item.rightText}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  // Sử dụng data từ Redux state
  const displayUser = user || {
    fullName: isLoading ? 'Đang tải...' : 'Người dùng',
    email: isLoading ? 'Đang tải...' : 'email@example.com',
    userImage: null,
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <HeaderComponent style={styles.header}>
        <Text style={styles.headerTitle}>Cá Nhân</Text>
      </HeaderComponent>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 50 }
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#35A55E']} // Android
            tintColor={'#35A55E'} // iOS
            title="Kéo để làm mới" // iOS
            titleColor={'#35A55E'} // iOS
          />
        }
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={
                displayUser.userImage
                  ? { uri: displayUser.userImage }
                  : require('../../assets/images/google_icon.png') // Fallback image
              }
              style={styles.avatar}
            />
            {isLoading && (
              <View style={styles.loadingOverlay}>
                <Ionicons name="refresh" size={16} color="#666" />
              </View>
            )}
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {displayUser.fullName}
            </Text>
            <View style={styles.emailContainer}>
              <Image
                source={require('../../assets/images/google_icon.png')}
                style={styles.emailIcon}
              />
              <Text style={styles.profileEmail}>
                {displayUser.email}
              </Text>
            </View>
            {error && (
              <Text style={styles.errorText}>
                Lỗi: {error}
              </Text>
            )}
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Nutrition Section */}
        <View style={styles.section}>
          <View style={styles.sectionContent}>
            {nutritionItems.map(renderListItem)}
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Plan Section */}
        <View style={styles.section}>
          <View style={styles.sectionContent}>
            {planItems.map(renderListItem)}
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* General Section */}
        <View style={styles.section}>
          <View style={styles.sectionContent}>
            {generalItems.map(renderListItem)}
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => setIsLogoutSheetOpen(true)}
        >
          <Ionicons name="log-out-outline" size={24} color="#FFFFFF" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Phiên bản 5.0</Text>

      </ScrollView>

      {/* Logout Confirmation Sheet */}
      <LogoutConfirmSheet
        isOpen={isLogoutSheetOpen}
        onClose={() => setIsLogoutSheetOpen(false)}
        onConfirm={handleLogout}
      />

      {/* App Info Sheet */}
      <AppInfoSheet
        isOpen={isAppInfoSheetOpen}
        onClose={() => setIsAppInfoSheetOpen(false)}
      />
    </SafeAreaView>
  );
}