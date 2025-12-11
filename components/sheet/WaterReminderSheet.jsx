import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import SheetComponent from './SheetComponent';

const WATER_REMINDER_KEY = '@water_reminder_settings';

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
  const [countdown, setCountdown] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [nextReminderTime, setNextReminderTime] = useState(null);
  
  const notificationListener = useRef();
  const responseListener = useRef();
  const countdownInterval = useRef(null);

  // Load settings khi sheet mở
  useEffect(() => {
    if (isOpen) {
      loadSettingsAndCalculate();
    }
    
    return () => {
      if (countdownInterval.current) {
        clearInterval(countdownInterval.current);
      }
    };
  }, [isOpen]);

  // Setup notifications
  useEffect(() => {
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

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response received:', response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const loadSettingsAndCalculate = async () => {
    try {
      setIsLoading(true);
      const settingsJson = await AsyncStorage.getItem(WATER_REMINDER_KEY);
      
      if (settingsJson) {
        const loadedSettings = JSON.parse(settingsJson);
        setSettings(loadedSettings);
        console.log('📱 Loaded water reminder settings:', loadedSettings);
        
        if (!loadedSettings.isEnabled) {
          setCountdown({ hours: 0, minutes: 0, seconds: 0 });
          setIsLoading(false);
          return;
        }
        
        calculateNextReminder(loadedSettings);
      } else {
        // Nếu chưa có settings, tạo mặc định
        const defaultSettings = {
          isEnabled: false,
          startTime: 8,
          endTime: 22,
          interval: 2
        };
        await AsyncStorage.setItem(WATER_REMINDER_KEY, JSON.stringify(defaultSettings));
        setSettings(defaultSettings);
        setCountdown({ hours: 0, minutes: 0, seconds: 0 });
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('❌ Error loading settings:', error);
      setIsLoading(false);
    }
  };

  const calculateNextReminder = (loadedSettings) => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();
    const currentTimeInMinutes = currentHour * 60 + currentMinute + currentSecond / 60;
    
    const startTimeInMinutes = loadedSettings.startTime * 60;
    const endTimeInMinutes = loadedSettings.endTime * 60;
    const intervalInMinutes = loadedSettings.interval * 60;
    
    console.log('⏰ Current time:', `${currentHour}:${currentMinute}:${currentSecond}`);
    console.log('⏰ Start time:', loadedSettings.startTime);
    console.log('⏰ End time:', loadedSettings.endTime);
    console.log('⏰ Interval:', loadedSettings.interval, 'hours');
    
    let nextReminderInMinutes;
    
    // Nếu chưa đến giờ bắt đầu
    if (currentTimeInMinutes < startTimeInMinutes) {
      nextReminderInMinutes = startTimeInMinutes;
      console.log('⏰ Chưa đến giờ bắt đầu, nhắc lúc:', loadedSettings.startTime, ':00');
    }
    // Nếu đã qua giờ kết thúc
    else if (currentTimeInMinutes >= endTimeInMinutes) {
      // Nhắc vào ngày mai lúc startTime
      nextReminderInMinutes = startTimeInMinutes + 24 * 60;
      console.log('⏰ Đã qua giờ kết thúc, nhắc ngày mai lúc:', loadedSettings.startTime, ':00');
    }
    // Đang trong khoảng thời gian nhắc
    else {
      // Tính thời điểm nhắc tiếp theo
      const timeSinceStart = currentTimeInMinutes - startTimeInMinutes;
      const remindersPassed = Math.floor(timeSinceStart / intervalInMinutes);
      nextReminderInMinutes = startTimeInMinutes + (remindersPassed + 1) * intervalInMinutes;
      
      // Nếu thời gian nhắc tiếp theo vượt quá endTime
      if (nextReminderInMinutes >= endTimeInMinutes) {
        // Nhắc vào ngày mai lúc startTime
        nextReminderInMinutes = startTimeInMinutes + 24 * 60;
        console.log('⏰ Nhắc tiếp theo vượt quá giờ kết thúc, nhắc ngày mai');
      }
    }
    
    // Tính thời gian còn lại
    const timeDiffInMinutes = nextReminderInMinutes - currentTimeInMinutes;
    const totalSeconds = Math.round(timeDiffInMinutes * 60);
    
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    console.log('⏰ Thời gian còn lại:', `${hours}h ${minutes}m ${seconds}s`);
    
    setCountdown({ hours, minutes, seconds });
    setNextReminderTime(nextReminderInMinutes);
    
    // Bắt đầu đếm ngược
    startCountdown(totalSeconds);
  };

  const startCountdown = (totalSeconds) => {
    if (countdownInterval.current) {
      clearInterval(countdownInterval.current);
    }
    
    let remainingSeconds = totalSeconds;
    
    countdownInterval.current = setInterval(() => {
      remainingSeconds--;
      
      if (remainingSeconds <= 0) {
        // Hết thời gian, gửi thông báo
        sendWaterReminder();
        // Load lại settings và tính toán lần tiếp theo
        if (settings) {
          calculateNextReminder(settings);
        }
      } else {
        const hours = Math.floor(remainingSeconds / 3600);
        const minutes = Math.floor((remainingSeconds % 3600) / 60);
        const seconds = remainingSeconds % 60;
        
        setCountdown({ hours, minutes, seconds });
      }
    }, 1000);
  };

  const sendWaterReminder = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '💧 Nhắc nhở uống nước',
          body: 'Đã đến giờ uống nước rồi! Hãy uống một ly nước ngay bây giờ nhé.',
          sound: true,
          vibrate: [0, 250, 250, 250],
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: null,
      });
      
      console.log('✅ Water reminder notification sent');
    } catch (error) {
      console.error('❌ Error sending water reminder:', error);
    }
  };

  const sendTestNotification = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Không có quyền thông báo',
          'Vui lòng cấp quyền thông báo trong cài đặt để sử dụng tính năng này.',
          [{ text: 'OK' }]
        );
        return;
      }
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '💧 Nhắc nhở uống nước (Test)',
          body: 'Đây là thông báo test. Hãy uống một ly nước ngay bây giờ nhé!',
          sound: true,
          vibrate: [0, 250, 250, 250],
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: null,
      });
      
      console.log('✅ Test notification sent');
    } catch (error) {
      console.error('❌ Error sending test notification:', error);
      Alert.alert('Lỗi', 'Không thể gửi thông báo. Vui lòng thử lại sau.');
    }
  };
  
  const formatTime = (value) => {
    return value.toString().padStart(2, '0');
  };
  
  const handleNavigateToSettings = () => {
    onClose();
    setTimeout(() => {
      router.push('/(stacks)/account/WaterReminderSettings');
    }, 100);
  };
  
  // // Loading state
  // if (isLoading) {
  //   return (
  //     <View style={styles.container}>
  //       <ActivityIndicator size="small" color="#35A55E" />
  //       <Text style={[styles.title, { marginTop: 12 }]}>Đang tải...</Text>
  //     </View>
  //   );
  // }
  
  // // Disabled state
  // if (!settings || !settings.isEnabled) {
  //   return (
  //     <View style={styles.container}>
  //       <Text style={styles.title}>Nhắc nhở uống nước</Text>
  //       <Text style={styles.disabledText}>
  //         Chức năng nhắc nhở đang tắt
  //       </Text>
        
  //       <TouchableOpacity 
  //         style={styles.settingButton}
  //         onPress={handleNavigateToSettings}
  //       >
  //         <Text style={styles.settingButtonText}>
  //           Bật nhắc nhở uống nước
  //         </Text>
  //       </TouchableOpacity>
  //     </View>
  //   );
  // }
  
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
  disabledText: {
    fontSize: 15,
    color: '#999',
    marginBottom: 24,
    textAlign: 'center',
  },
});

export default WaterReminderSheet;
