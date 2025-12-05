import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, Image, Text, View, TouchableOpacity, FlatList, Animated } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import HeaderComponent from '../../components/header/HeaderComponent';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import LogoutConfirmSheet from '../../components/sheet/LogoutConfirmSheet';
import AppInfoSheet from '../../components/sheet/AppInfoSheet';
import { useDispatch, useSelector } from 'react-redux';
import { checkTokenAndGetUser, logoutUser } from '../../redux/thunk/authThunk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../../styles/AccoutPage';

// Thông tin người dùng
const userData = {
  name: 'Tran Thi Huyen Tran',
  email: 'tranthihuyentran@gmail.com',
  avatarUrl: 'https://maunaildep.com/wp-content/uploads/2025/04/gai-xinh-2k11-1.jpg',
};

// Danh sách các mục trong phần Dinh Dưỡng
const nutritionItems = [
  {
    id: 'personal-info',
    title: 'Thông tin cá nhân',
    icon: require('../../assets/images/icons_account/s1.png'),
    navigateTo: '/(stacks)/account/PersonalInfo',
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
  {
    id: 'diet',
    title: 'Chế độ ăn',
    icon: require('../../assets/images/icons_account/s3.png'),
    navigateTo: '/account/DietType',
    badge: null,
    rightComponent: 'arrow'
  },
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

// Thêm dữ liệu nutrition goals
const nutritionGoals = [
  {
    id: '1',
    label: 'Protein',
    value: 215,
    maxValue: 250,
    unit: 'gram',
    postfix: '+',
    backgroundColor: '#FFFFFF',
    iconSource: require('../../assets/images/icons_home/protein.png'),
    textColor: '#000000',
    progressColor: '#38B74C',
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
    progressColor: '#FF8C00',
  },
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
    progressColor: '#4169E1',
  },
  {
    id: '5',
    label: 'Carb',
    value: 180,
    maxValue: 300,
    unit: 'gr',
    postfix: '',
    backgroundColor: '#FFE4E1',
    iconSource: require('../../assets/images/icons_home/lipid.png'),
    textColor: '#000000',
    progressColor: '#FF69B4',
  }
];

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  // Redux selectors
  const { user, isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [isLogoutSheetOpen, setIsLogoutSheetOpen] = useState(false);
  const [isAppInfoSheetOpen, setIsAppInfoSheetOpen] = useState(false);

  // Thêm refs cho animation
  const progressAnims = useRef(nutritionGoals.map(() => new Animated.Value(0))).current;

  // Fetch user info khi component mount
  useEffect(() => {
    dispatch(checkTokenAndGetUser());
  }, [dispatch]);

  // Chạy animation khi component mount
  useEffect(() => {
    const animations = progressAnims.map((anim, index) => {
      const progressPercentage = Math.min(nutritionGoals[index].value / nutritionGoals[index].maxValue, 1);
      return Animated.timing(anim, {
        toValue: progressPercentage,
        duration: 1000,
        delay: 300 + index * 200,
        useNativeDriver: false
      });
    });

    Animated.stagger(100, animations).start();
  }, []);

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
          <Ionicons name="chevron-forward" size={24} color="#CCCCCC" />
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

        {/* Daily Nutrition Goals Section */}
        <View style={styles.nutritionSection}>
          <Text style={styles.nutritionSectionTitle}>Chế độ dinh dưỡng hàng ngày của bạn</Text>

          <View style={styles.nutritionGrid}>
            {nutritionGoals.map((item, index) => (
              <View key={item.id} style={[styles.nutritionCard, { backgroundColor: item.backgroundColor }]}>
                <View style={styles.nutritionCardHeader}>
                  <Text style={[styles.nutritionCardLabel, { color: item.textColor }]}>
                    {item.label}
                  </Text>
                  <Image
                    source={item.iconSource}
                    style={styles.nutritionCardIcon}
                  />
                </View>

                <View style={styles.nutritionCardContent}>
                  <Text style={[styles.nutritionCardValue, { color: item.textColor }]}>
                    {item.value}
                    <Text style={styles.nutritionCardUnit}>
                      {item.unit}
                    </Text>
                  </Text>

                </View>

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
            ))}
          </View>
        </View>

        {/* Nutrition Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dinh Dưỡng</Text>
          <View style={styles.sectionContent}>
            {nutritionItems.map(renderListItem)}
          </View>
        </View>

        {/* Plan Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kế Hoạch</Text>
          <View style={styles.sectionContent}>
            {planItems.map(renderListItem)}
          </View>
        </View>

        {/* General Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chung</Text>
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