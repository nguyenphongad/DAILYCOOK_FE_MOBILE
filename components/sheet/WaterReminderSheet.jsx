import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import SheetComponent from './SheetComponent';

// Cấu hình thông báo với đầy đủ các trường cần thiết
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
    priority: Notifications.AndroidNotificationPriority.HIGH
  }),
});

const WaterReminderSheet = ({ isOpen, onClose }) => {
  // State để lưu thời gian đếm ngược (cập nhật thành 30 phút)
  const [countdown, setCountdown] = useState({
    hours: 0,
    minutes: 30,
    seconds: 0
  });
  
  // Refs cho notification
  const notificationListener = useRef();
  const responseListener = useRef();
  
  // Thiết lập notification khi component mount
  useEffect(() => {
    // Kiểm tra và yêu cầu quyền thông báo một cách đơn giản hơn
    const requestPermissions = async () => {
      try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        
        if (finalStatus !== 'granted') {
          Alert.alert(
            'Cần quyền thông báo',
            'Vui lòng cấp quyền thông báo để nhận nhắc nhở uống nước.',
            [{ text: 'OK' }]
          );
          return false;
        }
        
        return true;
      } catch (error) {
        console.log('Error requesting notification permissions:', error);
        return false;
      }
    };

    requestPermissions();

    // Thiết lập listeners cho thông báo
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response received:', response);
    });

    // Cleanup
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // Effect để đếm ngược thời gian khi sheet mở
  useEffect(() => {
    let timer = null;
    
    if (isOpen) {
      timer = setInterval(() => {
        setCountdown(prevTime => {
          // Nếu hết thời gian, hiển thị thông báo và reset
          if (prevTime.hours === 0 && prevTime.minutes === 0 && prevTime.seconds === 0) {
            // Thông báo khi hết giờ
            sendTestNotification();
            return { hours: 0, minutes: 30, seconds: 0 }; // Reset lại thành 30 phút
          }
          
          // Logic đếm ngược
          let newHours = prevTime.hours;
          let newMinutes = prevTime.minutes;
          let newSeconds = prevTime.seconds;
          
          if (newSeconds > 0) {
            newSeconds--;
          } else {
            newSeconds = 59;
            if (newMinutes > 0) {
              newMinutes--;
            } else {
              newMinutes = 59;
              if (newHours > 0) {
                newHours--;
              }
            }
          }
          
          return { hours: newHours, minutes: newMinutes, seconds: newSeconds };
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isOpen]);

  // Hàm đơn giản để gửi thông báo test
  const sendTestNotification = async () => {
    try {
      // Kiểm tra quyền một lần nữa trước khi gửi thông báo
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Không có quyền thông báo',
          'Vui lòng cấp quyền thông báo trong cài đặt để sử dụng tính năng này.',
          [{ text: 'OK' }]
        );
        return;
      }
      
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Nhắc nhở uống nước',
          body: 'Đã đến giờ uống nước rồi! Hãy uống một ly nước ngay bây giờ nhé.',
          sound: true,
          vibrate: [0, 250, 250, 250],
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: null, // Hiển thị ngay lập tức
      });
      console.log('Notification sent with ID:', notificationId);
    } catch (error) {
      console.error('Error sending notification:', error);
      Alert.alert('Lỗi', 'Không thể gửi thông báo. Vui lòng thử lại sau.');
    }
  };
  
  // Format thời gian với 2 chữ số (01, 02, etc.)
  const formatTime = (value) => {
    return value.toString().padStart(2, '0');
  };
  
  // Hàm chuyển đến trang cài đặt nhắc nhở
  const handleNavigateToSettings = () => {
    onClose(); // Đóng sheet trước khi điều hướng
    
    // Thêm setTimeout để tránh animation bị giật
    setTimeout(() => {
      router.push('/(stacks)/account/WaterReminderSettings');
    }, 100);
  };
  
  return (
    <SheetComponent
      isOpen={isOpen}
      onClose={onClose}
      snapPoints={[40]}
      position={0}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Nhắc nhở uống nước</Text>
        <Text style={styles.countdownText}>
          Nhắc nhở uống nước sau{' '}
          <Text style={styles.timeText}>
            {formatTime(countdown.hours)}:{formatTime(countdown.minutes)}:{formatTime(countdown.seconds)}
          </Text>{' '}
          nữa
        </Text>
        
        {/* Chỉ giữ lại nút thông báo ngay, bỏ nút đặt lại 10s */}
        <TouchableOpacity 
          style={[styles.actionButton, styles.testButton]}
          onPress={sendTestNotification}
        >
          <Text style={styles.actionButtonText}>
            Thông báo ngay
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingButton}
          onPress={handleNavigateToSettings}
        >
          <Text style={styles.settingButtonText}>
            Cài đặt thời gian nhắc uống nước
          </Text>
        </TouchableOpacity>
      </View>
    </SheetComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#35A55E',
    marginBottom: 16,
    textAlign: 'center',
  },
  countdownText: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  timeText: {
    fontWeight: 'bold',
    color: '#E86F50',
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    width: '100%',  // Đã thay đổi từ flex: 0.48 để nút chiếm toàn bộ chiều rộng
    marginBottom: 16, // Thêm margin bottom để tách biệt với nút bên dưới
  },
  testButton: {
    backgroundColor: '#FFB800',
  },
  settingButton: {
    backgroundColor: '#35A55E',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 8,
    width: '100%',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  settingButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default WaterReminderSheet;
