import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Switch,
    ScrollView,
    Platform,
    ToastAndroid,
    Alert,
    Modal,
    Dimensions,
    Image,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import HeaderComponent from '../../../components/header/HeaderComponent';
import HeaderLeft from '../../../components/header/HeaderLeft';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from 'react-native-wheel-pick';
import * as Notifications from 'expo-notifications';

const { height: screenHeight } = Dimensions.get('window');
const SLEEP_REMINDER_KEY = '@sleep_reminder_settings';

// Cấu hình notification
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

// Time Picker Modal
const TimePickerModal = ({ visible, onClose, onSave }) => {
    const [selectedHour, setSelectedHour] = useState(22);
    const [selectedMinute, setSelectedMinute] = useState(0);
    
    const hours = Array.from({ length: 24 }, (_, i) => ({
        value: i,
        label: i.toString().padStart(2, '0')
    }));

    const minutes = Array.from({ length: 60 }, (_, i) => ({
        value: i,
        label: i.toString().padStart(2, '0')
    }));

    const handleSave = () => {
        onSave(selectedHour, selectedMinute);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.modalCancelText}>Hủy</Text>
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Chọn giờ nhắc</Text>
                        <TouchableOpacity onPress={handleSave}>
                            <Text style={styles.modalSaveText}>Thêm</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.pickerWrapper}>
                        <View style={styles.pickerRow}>
                            <View style={styles.pickerColumn}>
                                <Text style={styles.pickerLabel}>Giờ</Text>
                                <Picker
                                    style={styles.picker}
                                    selectedValue={selectedHour}
                                    pickerData={hours}
                                    onValueChange={setSelectedHour}
                                    itemSpace={50}
                                />
                            </View>
                            <Text style={styles.pickerSeparator}>:</Text>
                            <View style={styles.pickerColumn}>
                                <Text style={styles.pickerLabel}>Phút</Text>
                                <Picker
                                    style={styles.picker}
                                    selectedValue={selectedMinute}
                                    pickerData={minutes}
                                    onValueChange={setSelectedMinute}
                                    itemSpace={50}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default function SleepReminderSettings() {
    const [isReminderEnabled, setIsReminderEnabled] = useState(false);
    const [alarms, setAlarms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showTimePicker, setShowTimePicker] = useState(false);

    useEffect(() => {
        loadSettings();
        requestNotificationPermissions();
    }, []);

    const requestNotificationPermissions = async () => {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Cần quyền thông báo',
                'Vui lòng cấp quyền thông báo để nhận nhắc nhở đi ngủ.',
                [{ text: 'OK' }]
            );
        }
    };

    const loadSettings = async () => {
        try {
            const settingsJson = await AsyncStorage.getItem(SLEEP_REMINDER_KEY);
            if (settingsJson) {
                const settings = JSON.parse(settingsJson);
                setIsReminderEnabled(settings.isEnabled || false);
                setAlarms(settings.alarms || []);
                console.log('✅ Loaded sleep reminder settings:', settings);
            } else {
                await saveSettings({ isEnabled: false, alarms: [] });
                console.log('💾 Saved default sleep reminder settings');
            }
        } catch (error) {
            console.error('❌ Error loading sleep reminder settings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveSettings = async (settings) => {
        try {
            await AsyncStorage.setItem(SLEEP_REMINDER_KEY, JSON.stringify(settings));
            console.log('💾 Saved sleep reminder settings:', settings);
            
            // Schedule notifications nếu bật
            if (settings.isEnabled) {
                await scheduleNotifications(settings.alarms);
            } else {
                await Notifications.cancelAllScheduledNotificationsAsync();
            }
        } catch (error) {
            console.error('❌ Error saving sleep reminder settings:', error);
        }
    };

    const scheduleNotifications = async (alarmList) => {
        await Notifications.cancelAllScheduledNotificationsAsync();
        
        const enabledAlarms = alarmList.filter(alarm => alarm.enabled);
        
        for (const alarm of enabledAlarms) {
            const now = new Date();
            const scheduledTime = new Date();
            scheduledTime.setHours(alarm.hour, alarm.minute, 0, 0);
            
            // Nếu giờ đã qua trong ngày hôm nay, lên lịch cho ngày mai
            if (scheduledTime <= now) {
                scheduledTime.setDate(scheduledTime.getDate() + 1);
            }
            
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: '🌙 Đã đến giờ đi ngủ!',
                    body: `Đã ${alarm.time} rồi! Hãy nghỉ ngơi để có sức khỏe tốt nhé!`,
                    sound: true,
                },
                trigger: scheduledTime,
            });
            
            console.log(`Scheduled notification for ${alarm.time} at`, scheduledTime);
        }
    };

    const handleToggleReminder = async (value) => {
        setIsReminderEnabled(value);
        await saveSettings({ isEnabled: value, alarms });
        
        const message = value 
            ? 'Đã bật nhắc nhở đi ngủ! 🌙' 
            : 'Đã tắt nhắc nhở đi ngủ!';
        
        if (Platform.OS === 'android') {
            ToastAndroid.show(message, ToastAndroid.SHORT);
        }
    };

    const handleAddAlarm = (hour, minute) => {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        // Kiểm tra trùng lặp
        const isDuplicate = alarms.some(alarm => alarm.time === time);
        if (isDuplicate) {
            Alert.alert('Thông báo', 'Giờ này đã tồn tại!');
            return;
        }

        const newAlarm = {
            id: Date.now().toString(),
            time,
            hour,
            minute,
            enabled: true
        };

        const updatedAlarms = [...alarms, newAlarm].sort((a, b) => {
            if (a.hour !== b.hour) return a.hour - b.hour;
            return a.minute - b.minute;
        });

        setAlarms(updatedAlarms);
        saveSettings({ isEnabled: isReminderEnabled, alarms: updatedAlarms });

        if (Platform.OS === 'android') {
            ToastAndroid.show(`Đã thêm nhắc nhở lúc ${time}`, ToastAndroid.SHORT);
        }
    };

    const handleToggleAlarm = async (id) => {
        const updatedAlarms = alarms.map(alarm =>
            alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
        );
        setAlarms(updatedAlarms);
        await saveSettings({ isEnabled: isReminderEnabled, alarms: updatedAlarms });
    };

    // Hàm tính thời gian còn lại
    const getTimeRemaining = (hour, minute) => {
        const now = new Date();
        const targetTime = new Date();
        targetTime.setHours(hour, minute, 0, 0);
        
        // Nếu giờ đã qua hôm nay, tính cho ngày mai
        if (targetTime <= now) {
            targetTime.setDate(targetTime.getDate() + 1);
        }
        
        const diffMs = targetTime - now;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        
        if (diffHours > 0) {
            return `còn ${diffHours} giờ ${diffMinutes} phút`;
        } else {
            return `còn ${diffMinutes} phút`;
        }
    };

    const handleDeleteAlarm = (id) => {
        Alert.alert(
            'Xác nhận xóa',
            'Bạn có chắc muốn xóa giờ nhắc này?',
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: async () => {
                        const updatedAlarms = alarms.filter(alarm => alarm.id !== id);
                        setAlarms(updatedAlarms);
                        await saveSettings({ isEnabled: isReminderEnabled, alarms: updatedAlarms });
                        
                        if (Platform.OS === 'android') {
                            ToastAndroid.show('Đã xóa giờ nhắc', ToastAndroid.SHORT);
                        }
                    }
                }
            ]
        );
    };

    const handleGoBack = () => {
        router.back();
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <HeaderComponent>
                    <HeaderLeft onGoBack={handleGoBack} title="Quay lại" />
                    <View style={styles.headerCenter}>
                        <Text style={styles.headerTitle}>Cài đặt nhắc đi ngủ</Text>
                    </View>
                </HeaderComponent>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#6B4EFF" />
                    <Text style={styles.loadingText}>Đang tải cài đặt...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <HeaderComponent>
                <HeaderLeft onGoBack={handleGoBack} title="Quay lại" />
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>Cài đặt nhắc đi ngủ</Text>
                </View>
            </HeaderComponent>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Header Info */}
                <View style={styles.headerInfo}>
                    <Image
                        source={require('../../../assets/images/sleep.png')}
                        style={styles.sleepImage}
                        resizeMode="contain"
                    />
                    <Text style={styles.headerInfoSubtitle}>
                        Thiết lập giờ ngủ để có giấc ngủ ngon và sức khỏe tốt
                    </Text>
                </View>

                {/* Main Settings */}
                <View style={styles.settingsContainer}>
                    {/* Enable/Disable Toggle */}
                    <View style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <View style={[styles.settingIcon, { backgroundColor: '#F0E7FF' }]}>
                                <Ionicons name="moon" size={20} color="#6B4EFF" />
                            </View>
                            <View style={styles.settingTextContainer}>
                                <Text style={styles.settingTitle}>Bật nhắc nhở</Text>
                                <Text style={styles.settingSubtitle}>
                                    {isReminderEnabled ? 'Đang bật thông báo' : 'Đang tắt thông báo'}
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={isReminderEnabled}
                            onValueChange={handleToggleReminder}
                            trackColor={{ false: '#E5E5E5', true: '#6B4EFF' }}
                            thumbColor={'#FFFFFF'}
                            ios_backgroundColor="#E5E5E5"
                        />
                    </View>
                </View>

                {/* Add Alarm Button */}
                <TouchableOpacity
                    style={[styles.addButton, !isReminderEnabled && styles.disabledButton]}
                    onPress={() => isReminderEnabled && setShowTimePicker(true)}
                    disabled={!isReminderEnabled}
                >
                    <Ionicons name="add-circle" size={24} color={isReminderEnabled ? "#6B4EFF" : "#CCCCCC"} />
                    <Text style={[styles.addButtonText, !isReminderEnabled && styles.disabledText]}>
                        Thêm giờ nhắc
                    </Text>
                </TouchableOpacity>

                {/* Alarms List */}
                {alarms.length > 0 ? (
                    <View style={styles.alarmsContainer}>
                        <Text style={styles.alarmsTitle}>Danh sách giờ nhắc ({alarms.length})</Text>
                        {alarms.map((alarm) => (
                            <View
                                key={alarm.id}
                                style={[
                                    styles.alarmItem,
                                    !isReminderEnabled && styles.disabledAlarmItem
                                ]}
                            >
                                <View style={styles.alarmLeft}>
                                    <TouchableOpacity
                                        onPress={() => isReminderEnabled && handleToggleAlarm(alarm.id)}
                                        disabled={!isReminderEnabled}
                                        style={styles.checkboxContainer}
                                    >
                                        <Ionicons
                                            name={alarm.enabled ? "checkbox" : "square-outline"}
                                            size={28}
                                            color={alarm.enabled && isReminderEnabled ? "#6B4EFF" : "#CCCCCC"}
                                        />
                                    </TouchableOpacity>
                                    <View style={styles.alarmTimeContainer}>
                                        <Text style={[
                                            styles.alarmTime,
                                            (!alarm.enabled || !isReminderEnabled) && styles.disabledAlarmTime
                                        ]}>
                                            {alarm.time}
                                        </Text>
                                        {alarm.enabled && isReminderEnabled ? (
                                            <Text style={styles.alarmLabel}>
                                                🌙 {getTimeRemaining(alarm.hour, alarm.minute)}
                                            </Text>
                                        ) : (
                                            <Text style={styles.alarmLabel}>⏸️ Đang tắt</Text>
                                        )}
                                    </View>
                                </View>
                                <TouchableOpacity
                                    onPress={() => handleDeleteAlarm(alarm.id)}
                                    style={styles.deleteButton}
                                >
                                    <Ionicons name="trash-outline" size={22} color="#FF4444" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                ) : (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="alarm-outline" size={60} color="#CCCCCC" />
                        <Text style={styles.emptyText}>Chưa có giờ nhắc nào</Text>
                        <Text style={styles.emptySubtext}>
                            Nhấn nút "Thêm giờ nhắc" để thêm
                        </Text>
                    </View>
                )}

                {/* Info Box */}
                <View style={styles.infoBox}>
                    <Ionicons name="information-circle" size={20} color="#6B4EFF" />
                    <Text style={styles.infoText}>
                        Khi đến giờ đã đặt, bạn sẽ nhận được thông báo nhắc nhở đi ngủ
                    </Text>
                </View>
            </ScrollView>

            {/* Time Picker Modal */}
            <TimePickerModal
                visible={showTimePicker}
                onClose={() => setShowTimePicker(false)}
                onSave={handleAddAlarm}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F1E5',
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 17,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 100,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        color: '#666',
    },
    headerInfo: {
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sleepImage: {
        width: 80,
        height: 80,
        marginBottom: 16,
    },
    headerInfoSubtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
    },
    settingsContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 8,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    settingIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    settingTextContainer: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2C3E50',
        marginBottom: 4,
    },
    settingSubtitle: {
        fontSize: 13,
        color: '#666',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        borderWidth: 2,
        borderColor: '#6B4EFF',
        borderStyle: 'dashed',
    },
    disabledButton: {
        borderColor: '#E5E5E5',
        opacity: 0.5,
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B4EFF',
        marginLeft: 8,
    },
    disabledText: {
        color: '#CCCCCC',
    },
    alarmsContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    alarmsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2C3E50',
        marginBottom: 16,
    },
    alarmItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    disabledAlarmItem: {
        opacity: 0.5,
    },
    alarmLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    checkboxContainer: {
        marginRight: 12,
    },
    alarmTimeContainer: {
        flex: 1,
    },
    alarmTime: {
        fontSize: 24,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 4,
    },
    disabledAlarmTime: {
        color: '#CCCCCC',
    },
    alarmLabel: {
        fontSize: 12,
        color: '#666',
    },
    deleteButton: {
        padding: 8,
    },
    emptyContainer: {
        alignItems: 'center',
        padding: 40,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 24,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#999',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#CCCCCC',
        marginTop: 8,
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#F0E7FF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 32,
        alignItems: 'center',
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: '#6B4EFF',
        marginLeft: 12,
        lineHeight: 18,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        width: '85%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 8,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2C3E50',
    },
    modalCancelText: {
        fontSize: 16,
        color: '#999',
        fontWeight: '500',
    },
    modalSaveText: {
        fontSize: 16,
        color: '#6B4EFF',
        fontWeight: '600',
    },
    pickerWrapper: {
        paddingVertical: 20,
    },
    pickerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pickerColumn: {
        alignItems: 'center',
    },
    pickerLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        fontWeight: '500',
    },
    picker: {
        width: 100,
        height: 150,
    },
    pickerSeparator: {
        fontSize: 32,
        fontWeight: '700',
        color: '#2C3E50',
        marginHorizontal: 16,
    },
});
