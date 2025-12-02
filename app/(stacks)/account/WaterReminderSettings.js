import React, { useState, useRef } from 'react';
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
    Image
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import HeaderComponent from '../../../components/header/HeaderComponent';
import HeaderLeft from '../../../components/header/HeaderLeft';

const { height: screenHeight } = Dimensions.get('window');

export default function WaterReminderSettings() {
    const [isReminderEnabled, setIsReminderEnabled] = useState(true);
    const [startTime, setStartTime] = useState(8); // 8h
    const [endTime, setEndTime] = useState(22); // 22h
    const [interval, setInterval] = useState(2); // 2 tiếng
    
    // Modal states
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);
    const [showIntervalPicker, setShowIntervalPicker] = useState(false);
    
    // Temporary values for pickers
    const [tempStartTime, setTempStartTime] = useState(8);
    const [tempEndTime, setTempEndTime] = useState(22);
    const [tempInterval, setTempInterval] = useState(2);

    // Refs for scroll views
    const startTimeScrollRef = useRef(null);
    const endTimeScrollRef = useRef(null);
    const intervalScrollRef = useRef(null);

    // Danh sách giờ từ 0h đến 24h
    const hours = Array.from({ length: 25 }, (_, i) => i);

    // Các khoảng cách thời gian
    const intervalOptions = [
        { value: 0.167, label: '10 phút' }, // 10/60 = 0.167
        { value: 0.5, label: '30 phút' },
        { value: 1, label: '1 tiếng' },
        { value: 2, label: '2 tiếng' },
        { value: 5, label: '5 tiếng' },
        { value: 7, label: '7 tiếng' },
        { value: 10, label: '10 tiếng' },
        { value: 12, label: '12 tiếng' }
    ];

    const handleGoBack = () => {
        router.back();
    };

    const handleSaveSettings = () => {
        // Logic lưu cài đặt
        console.log('Saving water reminder settings:', {
            isReminderEnabled,
            startTime,
            endTime,
            interval
        });

        if (Platform.OS === 'android') {
            ToastAndroid.show('Đã lưu cài đặt thông báo uống nước! 💧', ToastAndroid.LONG);
        } else {
            Alert.alert('Thành công', 'Đã lưu cài đặt thông báo uống nước!');
        }

        router.back();
    };

    const formatTime = (hour) => {
        return `${hour.toString().padStart(2, '0')}:00`;
    };

    const getIntervalLabel = (value) => {
        const option = intervalOptions.find(opt => opt.value === value);
        return option ? option.label : `${value} tiếng`;
    };

    // Time Picker Modal Component with improved scroll
    const TimePickerModal = ({ 
        visible, 
        onClose, 
        selectedValue, 
        onValueChange, 
        onSave,
        title 
    }) => {
        const scrollRef = useRef(null);
        const itemHeight = 60;
        
        React.useEffect(() => {
            if (visible && scrollRef.current) {
                const index = hours.findIndex(h => h === selectedValue);
                setTimeout(() => {
                    scrollRef.current?.scrollTo({ 
                        y: index * itemHeight, 
                        animated: false 
                    });
                }, 100);
            }
        }, [visible, selectedValue]);

        const handleScroll = (event) => {
            const y = event.nativeEvent.contentOffset.y;
            const index = Math.round(y / itemHeight);
            const newHour = hours[Math.max(0, Math.min(hours.length - 1, index))];
            onValueChange(newHour);
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
                            <Text style={styles.modalTitle}>{title}</Text>
                            <TouchableOpacity onPress={onSave}>
                                <Text style={styles.modalSaveText}>Lưu</Text>
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styles.pickerContainer}>
                            <View style={styles.selectionIndicator} />
                            <ScrollView 
                                ref={scrollRef}
                                style={styles.picker}
                                showsVerticalScrollIndicator={false}
                                onScroll={handleScroll}
                                scrollEventThrottle={16}
                                snapToInterval={itemHeight}
                                decelerationRate="fast"
                                contentContainerStyle={{ 
                                    paddingTop: itemHeight * 2,
                                    paddingBottom: itemHeight * 2
                                }}
                            >
                                {hours.map((hour) => (
                                    <TouchableOpacity
                                        key={hour}
                                        style={[
                                            styles.pickerItem,
                                            { height: itemHeight },
                                            selectedValue === hour && styles.selectedPickerItem
                                        ]}
                                        onPress={() => {
                                            onValueChange(hour);
                                            const index = hours.findIndex(h => h === hour);
                                            scrollRef.current?.scrollTo({ 
                                                y: index * itemHeight, 
                                                animated: true 
                                            });
                                        }}
                                    >
                                        <Text style={[
                                            styles.pickerItemText,
                                            selectedValue === hour && styles.selectedPickerItemText
                                        ]}>
                                            {formatTime(hour)}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };

    // Interval Picker Modal Component with improved scroll
    const IntervalPickerModal = ({ 
        visible, 
        onClose, 
        selectedValue, 
        onValueChange, 
        onSave 
    }) => {
        const scrollRef = useRef(null);
        const itemHeight = 60;
        
        React.useEffect(() => {
            if (visible && scrollRef.current) {
                const index = intervalOptions.findIndex(opt => opt.value === selectedValue);
                setTimeout(() => {
                    scrollRef.current?.scrollTo({ 
                        y: index * itemHeight, 
                        animated: false 
                    });
                }, 100);
            }
        }, [visible, selectedValue]);

        const handleScroll = (event) => {
            const y = event.nativeEvent.contentOffset.y;
            const index = Math.round(y / itemHeight);
            const newInterval = intervalOptions[Math.max(0, Math.min(intervalOptions.length - 1, index))];
            onValueChange(newInterval.value);
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
                            <Text style={styles.modalTitle}>Khoảng cách thời gian</Text>
                            <TouchableOpacity onPress={onSave}>
                                <Text style={styles.modalSaveText}>Lưu</Text>
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styles.pickerContainer}>
                            <View style={styles.selectionIndicator} />
                            <ScrollView 
                                ref={scrollRef}
                                style={styles.picker}
                                showsVerticalScrollIndicator={false}
                                onScroll={handleScroll}
                                scrollEventThrottle={16}
                                snapToInterval={itemHeight}
                                decelerationRate="fast"
                                contentContainerStyle={{ 
                                    paddingTop: itemHeight * 2,
                                    paddingBottom: itemHeight * 2
                                }}
                            >
                                {intervalOptions.map((option) => (
                                    <TouchableOpacity
                                        key={option.value}
                                        style={[
                                            styles.pickerItem,
                                            { height: itemHeight },
                                            selectedValue === option.value && styles.selectedPickerItem
                                        ]}
                                        onPress={() => {
                                            onValueChange(option.value);
                                            const index = intervalOptions.findIndex(opt => opt.value === option.value);
                                            scrollRef.current?.scrollTo({ 
                                                y: index * itemHeight, 
                                                animated: true 
                                            });
                                        }}
                                    >
                                        <Text style={[
                                            styles.pickerItemText,
                                            selectedValue === option.value && styles.selectedPickerItemText
                                        ]}>
                                            {option.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            {/* Header */}
            <HeaderComponent>
                <HeaderLeft onGoBack={handleGoBack} title="Quay lại" />
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>Cài đặt nhắc uống nước</Text>
                </View>
            </HeaderComponent>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Header Info with Image */}
                <View style={styles.headerInfo}>
                    <Image
                        source={require('../../../assets/images/icons_home/water-bottle.png')}
                        style={styles.waterImage}
                        resizeMode="contain"
                    />
                    <Text style={styles.headerInfoSubtitle}>
                        Thiết lập lịch nhắc nhở để duy trì đủ nước mỗi ngày
                    </Text>
                </View>

                {/* Main Settings */}
                <View style={styles.settingsContainer}>
                    {/* Enable/Disable Toggle */}
                    <View style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <View style={[styles.settingIcon, { backgroundColor: '#E8F5E8' }]}>
                                <Ionicons name="notifications" size={20} color="#35A55E" />
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
                            onValueChange={setIsReminderEnabled}
                            trackColor={{ false: '#E5E5E5', true: '#35A55E' }}
                            thumbColor={isReminderEnabled ? '#FFFFFF' : '#FFFFFF'}
                            ios_backgroundColor="#E5E5E5"
                        />
                    </View>

                    {/* Start Time Setting */}
                    <TouchableOpacity
                        style={[styles.settingItem, !isReminderEnabled && styles.disabledSetting]}
                        onPress={() => {
                            if (isReminderEnabled) {
                                setTempStartTime(startTime);
                                setShowStartTimePicker(true);
                            }
                        }}
                        disabled={!isReminderEnabled}
                    >
                        <View style={styles.settingLeft}>
                            <View style={[styles.settingIcon, { backgroundColor: '#FFF3E0' }]}>
                                <Ionicons name="sunny" size={20} color="#FF9800" />
                            </View>
                            <View style={styles.settingTextContainer}>
                                <Text style={[styles.settingTitle, !isReminderEnabled && styles.disabledText]}>
                                    Thời gian bắt đầu
                                </Text>
                                <Text style={[styles.settingSubtitle, !isReminderEnabled && styles.disabledText]}>
                                    Bắt đầu nhắc từ {formatTime(startTime)}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.settingRight}>
                            <Text style={[styles.timeValue, !isReminderEnabled && styles.disabledText]}>
                                {formatTime(startTime)}
                            </Text>
                            <Ionicons 
                                name="chevron-forward" 
                                size={20} 
                                color={isReminderEnabled ? "#CCCCCC" : "#E5E5E5"} 
                            />
                        </View>
                    </TouchableOpacity>

                    {/* End Time Setting */}
                    <TouchableOpacity
                        style={[styles.settingItem, !isReminderEnabled && styles.disabledSetting]}
                        onPress={() => {
                            if (isReminderEnabled) {
                                setTempEndTime(endTime);
                                setShowEndTimePicker(true);
                            }
                        }}
                        disabled={!isReminderEnabled}
                    >
                        <View style={styles.settingLeft}>
                            <View style={[styles.settingIcon, { backgroundColor: '#E3F2FD' }]}>
                                <Ionicons name="moon" size={20} color="#2196F3" />
                            </View>
                            <View style={styles.settingTextContainer}>
                                <Text style={[styles.settingTitle, !isReminderEnabled && styles.disabledText]}>
                                    Thời gian kết thúc
                                </Text>
                                <Text style={[styles.settingSubtitle, !isReminderEnabled && styles.disabledText]}>
                                    Dừng nhắc lúc {formatTime(endTime)}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.settingRight}>
                            <Text style={[styles.timeValue, !isReminderEnabled && styles.disabledText]}>
                                {formatTime(endTime)}
                            </Text>
                            <Ionicons 
                                name="chevron-forward" 
                                size={20} 
                                color={isReminderEnabled ? "#CCCCCC" : "#E5E5E5"} 
                            />
                        </View>
                    </TouchableOpacity>

                    {/* Interval Setting */}
                    <TouchableOpacity
                        style={[styles.settingItem, !isReminderEnabled && styles.disabledSetting]}
                        onPress={() => {
                            if (isReminderEnabled) {
                                setTempInterval(interval);
                                setShowIntervalPicker(true);
                            }
                        }}
                        disabled={!isReminderEnabled}
                    >
                        <View style={styles.settingLeft}>
                            <View style={[styles.settingIcon, { backgroundColor: '#F3E5F5' }]}>
                                <Ionicons name="timer" size={20} color="#9C27B0" />
                            </View>
                            <View style={styles.settingTextContainer}>
                                <Text style={[styles.settingTitle, !isReminderEnabled && styles.disabledText]}>
                                    Khoảng cách thời gian
                                </Text>
                                <Text style={[styles.settingSubtitle, !isReminderEnabled && styles.disabledText]}>
                                    Nhắc nhở mỗi {getIntervalLabel(interval)}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.settingRight}>
                            <Text style={[styles.timeValue, !isReminderEnabled && styles.disabledText]}>
                                {getIntervalLabel(interval)}
                            </Text>
                            <Ionicons 
                                name="chevron-forward" 
                                size={20} 
                                color={isReminderEnabled ? "#CCCCCC" : "#E5E5E5"} 
                            />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Save Button */}
                <TouchableOpacity 
                    style={styles.saveButton}
                    onPress={handleSaveSettings}
                >
                    <Ionicons name="checkmark-circle" size={20} color="white" />
                    <Text style={styles.saveButtonText}>Lưu cài đặt</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Time Picker Modals */}
            <TimePickerModal
                visible={showStartTimePicker}
                title="Thời gian bắt đầu"
                selectedValue={tempStartTime}
                onValueChange={setTempStartTime}
                onClose={() => setShowStartTimePicker(false)}
                onSave={() => {
                    setStartTime(tempStartTime);
                    setShowStartTimePicker(false);
                }}
            />

            <TimePickerModal
                visible={showEndTimePicker}
                title="Thời gian kết thúc"
                selectedValue={tempEndTime}
                onValueChange={setTempEndTime}
                onClose={() => setShowEndTimePicker(false)}
                onSave={() => {
                    setEndTime(tempEndTime);
                    setShowEndTimePicker(false);
                }}
            />

            <IntervalPickerModal
                visible={showIntervalPicker}
                selectedValue={tempInterval}
                onValueChange={setTempInterval}
                onClose={() => setShowIntervalPicker(false)}
                onSave={() => {
                    setInterval(tempInterval);
                    setShowIntervalPicker(false);
                }}
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
    waterImage: {
        width: 80,
        height: 80,
        marginBottom: 16,
    },
    headerInfoTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 8,
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
        marginBottom: 24,
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
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
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
    settingRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#35A55E',
        marginRight: 8,
    },
    disabledSetting: {
        opacity: 0.5,
    },
    disabledText: {
        color: '#CCCCCC',
    },
    intervalGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        justifyContent: 'space-between',
    },
    intervalOption: {
        width: '48%',
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedInterval: {
        backgroundColor: '#E8F5E8',
        borderColor: '#35A55E',
    },
    disabledInterval: {
        backgroundColor: '#F0F0F0',
    },
    intervalText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
    },
    selectedIntervalText: {
        color: '#35A55E',
        fontWeight: '600',
    },
    previewContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    previewTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2C3E50',
        marginBottom: 12,
    },
    previewItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    previewText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
    },
    saveButton: {
        flexDirection: 'row',
        backgroundColor: '#35A55E',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
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
        maxHeight: screenHeight * 0.6,
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
        color: '#35A55E',
        fontWeight: '600',
    },
    pickerContainer: {
        height: 300,
        paddingVertical: 10,
        position: 'relative',
    },
    selectionIndicator: {
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        height: 60,
        backgroundColor: 'rgba(53, 165, 94, 0.1)',
        borderRadius: 8,
        transform: [{ translateY: -30 }],
        zIndex: 1,
        borderWidth: 2,
        borderColor: 'rgba(53, 165, 94, 0.3)',
    },
    picker: {
        flex: 1,
    },
    pickerItem: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    selectedPickerItem: {
        // Remove background since we use selectionIndicator
    },
    pickerItemText: {
        fontSize: 18,
        color: '#666',
    },
    selectedPickerItemText: {
        fontSize: 22,
        fontWeight: '600',
        color: '#35A55E',
    },
});
