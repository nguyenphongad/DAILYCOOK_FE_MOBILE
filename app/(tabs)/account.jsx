import React, { useState } from 'react';
import { StyleSheet, ScrollView, Image, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import HeaderComponent from '../../components/header/HeaderComponent';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import LogoutConfirmSheet from '../../components/sheet/LogoutConfirmSheet';
import AppInfoSheet from '../../components/sheet/AppInfoSheet';

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
    title: 'Thông tin cá nhân | gia đình',
    icon: require('../../assets/images/icons_account/s1.png'),
    navigateTo: '/nutrition/personal-info',
    badge: null,
    rightComponent: 'arrow'
  },
  {
    id: 'goals',
    title: 'Mục tiêu',
    icon: require('../../assets/images/icons_account/s2.png'),
    navigateTo: '/nutrition/goals',
    badge: null,
    rightComponent: 'arrow'
  },
  {
    id: 'diet',
    title: 'Chế độ ăn',
    icon: require('../../assets/images/icons_account/s3.png'),
    navigateTo: '/nutrition/diet',
    badge: null,
    rightComponent: 'arrow'
  },
  {
    id: 'disliked-food',
    title: 'Thực phẩm không thích',
    icon: require('../../assets/images/icons_account/s4.png'),
    navigateTo: '/nutrition/disliked-food',
    badge: 4,
    badgeColor: '#E86F50',
    rightComponent: 'arrow'
  },
  {
    id: 'cooking-skills',
    title: 'Kĩ năng nấu ăn',
    icon: require('../../assets/images/icons_account/s5.png'),
    navigateTo: '/nutrition/cooking-skills',
    badge: null,
    rightComponent: 'text',
    rightText: 'Cơ bản'
  },
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
    title: 'Lịch sử chế độ ăn uống',
    icon: require('../../assets/images/icons_account/s6.png'),
    navigateTo: '/plan/meal-history',
    badge: null,
    rightComponent: 'arrow'
  },
  {
    id: 'water-reminder',
    title: 'Lịch nhắc uống nước',
    icon: require('../../assets/images/icons_account/s7.png'),
    navigateTo: '/plan/water-reminder',
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
  const [isLogoutSheetOpen, setIsLogoutSheetOpen] = useState(false);
  const [isAppInfoSheetOpen, setIsAppInfoSheetOpen] = useState(false);

  // Hàm xử lý khi nhấn vào một mục
  const handleItemPress = (item) => {
    if (item.id === 'app-info') {
      setIsAppInfoSheetOpen(true);
    } else if (item.navigateTo) {
      console.log(`Navigate to: ${item.navigateTo}`);
      // Implement navigation later
      // router.push(item.navigateTo);
    }
  };

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    console.log('User logged out');
    // Implement actual logout logic here
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <HeaderComponent style={styles.header}>
        <Text style={styles.headerTitle}>Cá Nhân</Text>
      </HeaderComponent>

      {/* Phần nội dung có thể scroll */}
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
          <Image
            source={{ uri: userData.avatarUrl }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userData.name}</Text>
            <Text style={styles.profileEmail}>{userData.email}</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F1E5',
    paddingTop: -40
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingBottom: 40,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#35A55E',
    padding: 16,
    marginHorizontal: 10,
    marginTop: 16,
    borderRadius: 8,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  profileEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  section: {
    marginTop: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 10,
    paddingRight: 10,
    marginHorizontal: 10,
    elevation: 0.7
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#F5f5f5',
    borderRadius: 12,
    marginBottom: 10
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    resizeMode: 'contain',
  },
  listItemText: {
    fontSize: 16,
    color: '#333',
  },
  listItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E86F50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  rightText: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  logoutButton: {
    backgroundColor: '#E86F50',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.6)',
    marginTop: 8,
  },
});