import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, FlatList, Dimensions, SafeAreaView, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import HeaderComponent from '../../components/header/HeaderComponent';

export default function RecordMeal() {
    const today = new Date();

    // Hàm lấy tên tháng từ số tháng
    const getMonthName = (monthNumber) => {
        const months = [
            'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
            'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
        ];
        return months[monthNumber - 1];
    };

    const [mealData, setMealData] = useState({
        name: '',
        description: '',
        calories: '',
        mealTime: 'breakfast'
    });

    const [selectedDate, setSelectedDate] = useState(today.getDate());
    const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
    const [currentMonth, setCurrentMonth] = useState(getMonthName(today.getMonth() + 1));
    const flatListRef = useRef(null);


    // Hàm để lấy các ngày trong tuần với offset (tuần trước, tuần này, tuần sau)
    const getWeekDays = (date = new Date(), weekOffset = 0) => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + (weekOffset * 7)); // Thêm/trừ số ngày theo tuần

        const day = newDate.getDay(); // 0 là Chủ nhật, 1 là Thứ hai,...
        const diff = newDate.getDate() - day + (day === 0 ? -6 : 1); // Điều chỉnh về thứ hai

        // Tạo mảng 7 ngày từ thứ 2 đến Chủ nhật
        return Array(7).fill(0).map((_, i) => {
            const weekDate = new Date(newDate);
            weekDate.setDate(diff + i);
            return {
                id: weekOffset + '-' + i.toString(),
                date: weekDate.getDate().toString().padStart(2, '0'),
                month: weekDate.getMonth() + 1,
                year: weekDate.getFullYear(),
                day: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][weekDate.getDay()],
                fullDate: weekDate,
                isPast: weekDate < new Date(new Date().setHours(0, 0, 0, 0)),
                isToday: weekDate.getDate() === new Date().getDate() &&
                    weekDate.getMonth() === new Date().getMonth() &&
                    weekDate.getFullYear() === new Date().getFullYear(),
                isFuture: weekDate > new Date(new Date().setHours(23, 59, 59, 999))
            };
        });
    };

    // Cập nhật dữ liệu dinh dưỡng mẫu
    const nutritionData = [
        { icon: 'food-steak', label: 'Protein', current: 0, target: 88, unit: 'g', color: '#4ECDC4' },
        { icon: 'nutrition', label: 'Fat', current: 0, target: 49, unit: 'g', color: '#FFB347' },
        { icon: 'barley', label: 'Carbs', current: 0, target: 241, unit: 'g', color: '#45B7D1' },
    ];

    // Tạo mảng các tuần (-1: tuần trước, 0: tuần hiện tại)
    const weeks = [
        { id: '-1', days: getWeekDays(today, -1) },
        { id: '0', days: getWeekDays(today, 0) }
    ];

    const handleInputChange = (field, value) => {
        setMealData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = () => {
        if (!mealData.name || !mealData.calories) {
            Alert.alert('Lỗi', 'Vui lòng nhập tên món ăn và calories');
            return;
        }
        Alert.alert('Thành công', 'Đã lưu món ăn!');
        handleReset();
    };

    const handleReset = () => {
        setMealData({
            name: '',
            description: '',
            calories: '',
            mealTime: 'breakfast'
        });
    };

    const mealTimes = [
        { value: 'breakfast', label: 'Sáng' },
        { value: 'lunch', label: 'Trưa' },
        { value: 'dinner', label: 'Tối' },
        { value: 'snack', label: 'Ăn vặt' }
    ];

    const handleDatePress = () => {
        Alert.alert('Date Picker', 'Chức năng chọn ngày sẽ được phát triển');
    };

    // Thêm dữ liệu mẫu cho món ăn
    const sampleMeals = [
        {
            id: 1,
            name: 'Cơm gà xối mỡ',
            protein: 25,
            fat: 15,
            carbs: 40,
            calories: 450,
            mealTime: 'breakfast',
            image: 'https://images.squarespace-cdn.com/content/v1/53883795e4b016c956b8d243/1597822154096-LK0WD8P39LYLJAG0PXJ6/chup-anh-thuc-an-1.jpg'
        },
        {
            id: 2,
            name: 'Cơm gà xối mỡ',
            protein: 25,
            fat: 15,
            carbs: 40,
            calories: 450,
            mealTime: 'breakfast',
            image: 'https://images.squarespace-cdn.com/content/v1/53883795e4b016c956b8d243/1597822154096-LK0WD8P39LYLJAG0PXJ6/chup-anh-thuc-an-1.jpg'
        },
        {
            id: 3,
            name: 'Cơm gà xối mỡ',
            protein: 25,
            fat: 15,
            carbs: 40,
            calories: 450,
            mealTime: 'breakfast',
            image: 'https://images.squarespace-cdn.com/content/v1/53883795e4b016c956b8d243/1597822154096-LK0WD8P39LYLJAG0PXJ6/chup-anh-thuc-an-1.jpg'
        },
        {
            id: 4,
            name: 'Cơm gà xối mỡ',
            protein: 25,
            fat: 15,
            carbs: 40,
            calories: 450,
            mealTime: 'breakfast',
            image: 'https://images.squarespace-cdn.com/content/v1/53883795e4b016c956b8d243/1597822154096-LK0WD8P39LYLJAG0PXJ6/chup-anh-thuc-an-1.jpg'
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <HeaderComponent>
                <Text style={styles.headerTitle}>Ghi nhận món ăn</Text>
                <View style={styles.headerPlaceholder} />
                <TouchableOpacity onPress={handleDatePress} style={styles.datePickerButton}>
                    <Ionicons name="calendar-outline" size={20} color="#fff" />
                </TouchableOpacity>
            </HeaderComponent>

            {/* Calendar Section */}
            {/* Calendar Section */}
            <View style={styles.calendarContainer}>
                {/* <View style={styles.calendarHeader}>
                        <Text style={styles.sectionTitle}>Ghi nhận</Text>
                        <View style={styles.monthTitleContainer}>
                            <Text style={styles.monthTitle}>{currentMonth}</Text>
                        </View>
                    </View> */}

                <View style={styles.calendarNavigationContainer}>
                    <FlatList
                        ref={flatListRef}
                        data={weeks}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.id}
                        initialScrollIndex={1} // Bắt đầu từ tuần hiện tại
                        getItemLayout={(data, index) => ({
                            length: Dimensions.get('window').width - 30,
                            offset: (Dimensions.get('window').width - 30) * index,
                            index,
                        })}
                        onMomentumScrollEnd={(event) => {
                            const position = event.nativeEvent.contentOffset.x;
                            // Xác định tuần hiện tại dựa trên vị trí scroll
                            const newOffset = position < (Dimensions.get('window').width / 2) ? -1 : 0;
                            setCurrentWeekOffset(newOffset);
                        }}
                        contentContainerStyle={styles.calendarFlatListContent}
                        renderItem={({ item }) => (
                            <View style={[
                                styles.weekContainer,
                                item.id === '0' ? styles.activeWeekContainer : null
                            ]}>
                                {item.days.map((day) => (
                                    <TouchableOpacity
                                        key={day.id}
                                        style={[
                                            styles.dateItem,
                                            day.isToday ? styles.activeDateItem : null,
                                            day.isFuture ? styles.futureDateItem : null,
                                        ]}
                                        disabled={day.isFuture}
                                        onPress={() => setSelectedDate(day.date)}
                                    >
                                        {/* Thứ - không có viền và không có nền cho active */}
                                        <Text
                                            style={[
                                                styles.dayText,
                                                day.isToday ? styles.activeDayText : null,
                                                day.isFuture ? styles.futureDayText : null,
                                            ]}
                                        >
                                            {day.day}
                                        </Text>

                                        {/* Ngày - có hình tròn với nền xanh đậm cho active */}
                                        <View style={[
                                            styles.dateCircle,
                                            day.isToday ? styles.activeDateCircle : null,
                                            day.isFuture ? styles.futureDateCircle : null,
                                        ]}>
                                            <Text
                                                style={[
                                                    styles.dateText,
                                                    day.isToday ? styles.activeDateText : null,
                                                    day.isFuture ? styles.futureDateText : null,
                                                ]}
                                            >
                                                {day.date}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    />
                </View>
            </View>

            {/* Nutrition Info Box */}
            <View style={styles.nutritionBox}>
                <View style={styles.nutritionContent}>
                    <View style={styles.caloriesSection}>
                        <View style={styles.caloriesCircle}>
                            <MaterialCommunityIcons name="fire" size={24} color="#FF6B6B" />
                        </View>
                        <Text style={styles.caloriesNumber}>1750</Text>
                        <Text style={styles.caloriesLabel}>Calo còn lại</Text>
                    </View>
                    <View style={styles.nutritionGrid}>
                        {nutritionData.map((item, index) => (
                            <View key={index} style={styles.nutritionItem}>
                                <View style={styles.nutritionHeader}>
                                    <MaterialCommunityIcons name={item.icon} size={20} color={item.color} />
                                    <Text style={styles.nutritionLabel}>{item.label}</Text>
                                    <Text style={styles.nutritionValue}>
                                        {item.current}/{item.target} {item.unit}
                                    </Text>
                                </View>
                                <View style={styles.nutritionProgressBar}>
                                    <View style={[styles.nutritionProgress, { width: `${(item.current / item.target) * 100}%`, backgroundColor: item.color }]} />
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
            <View style={styles.mealHeader}>
                <Text style={styles.mealHeaderText}>Lượng calo tiêu thụ</Text>
                <Text style={styles.caloriesCount}>450 kcal</Text>
            </View>

            <ScrollView style={styles.scrollContent}>
                <View style={styles.mealSection}>


                    {sampleMeals.map((meal) => (
                        <View key={meal.id} style={styles.mealCard}>
                            <View style={styles.mealTimeLabel}>
                                <Text style={styles.mealTimeBadge}>Bữa sáng</Text>
                            </View>
                            <Image
                                source={{ uri: meal.image }}
                                style={styles.mealImage}
                            />
                            <View style={styles.mealInfo}>
                                <Text style={styles.mealName}>{meal.name}</Text>
                                <View style={styles.nutritionInfo}>
                                    <Text style={styles.nutritionText}>
                                        <MaterialCommunityIcons name="food-steak" size={16} /> {meal.protein}g
                                    </Text>
                                    <Text style={styles.nutritionText}>
                                        <MaterialCommunityIcons name="nutrition" size={16} /> {meal.fat}g
                                    </Text>
                                    <Text style={styles.nutritionText}>
                                        <MaterialCommunityIcons name="barley" size={16} /> {meal.carbs}g
                                    </Text>
                                    <Text style={styles.calories}>{meal.calories} kcal</Text>
                                </View>
                            </View>

                        </View>
                    ))}


                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#D4E9E1',
        paddingTop: 95,
        padding: 10,
    },
    scrollContent: {
        paddingTop: 10,
    },
    datePickerButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    headerPlaceholder: {
        width: 40,
    },
    calendarContainer: {
        marginTop: 20,
        paddingHorizontal: 10,
    },
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        paddingHorizontal: 5,
    },
    sectionTitle: {
        fontWeight: 600,
        fontSize: 17,
    },
    monthTitleContainer: {
        backgroundColor: 'rgba(53, 165, 94, 0.2)', // Màu xanh chủ đạo mờ nhạt
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    monthTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#35A55E',
    },

    calendarNavigationContainer: {
        position: 'relative',
        marginBottom: 10,
    },
    calendarFlatListContent: {
        // Giữ trống hoặc thêm padding nếu cần
    },
    weekContainer: {
        width: Dimensions.get('window').width - 42, // Tăng kích thước lên vì không còn nút điều hướng
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 0,
        alignSelf: 'center', // Căn giữa tuần
    },
    dateItem: {
        width: 40,
        height: 65,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        backgroundColor: 'transparent',
        marginHorizontal: 3,
        // Thêm viền xanh nhạt cho tất cả các item ngày
        // borderWidth: 1,
        // borderColor: 'rgba(53, 165, 94, 0.3)',
    },
    activeDateItem: {
        backgroundColor: 'transparent',
        // Viền xanh đậm cho item ngày active
        borderWidth: 1,
        borderColor: '#35A55E',
    },
    futureDateItem: {
        backgroundColor: 'transparent',
        // Viền xám nhạt cho ngày tương lai
        // borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    dayText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 4,
        fontWeight: '400',
    },
    activeDayText: {
        color: '#35A55E', // Chỉ đổi màu chữ mà không đổi nền
        fontWeight: '600',
    },
    futureDayText: {
        color: '#999',
    },

    // Điều chỉnh lại style của date circle (không cần viền vì đã có viền ở item cha)
    dateCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderWidth: 0, // Bỏ viền của circle
    },
    activeDateCircle: {
        backgroundColor: '#35A55E', // Nền xanh đậm cho ngày active
        borderWidth: 0,
    },
    futureDateCircle: {
        // backgroundColor: 'transparent',
        borderWidth: 0,
    },
    nutritionBox: {
        // backgroundColor: '#fff',
        borderRadius: 12,
        padding: 0,
        marginBottom: 20,
    },
    nutritionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    activeDateText: {
        color: '#fff',
    },
    caloriesSection: {
        alignItems: 'center',
        // backgroundColor: '#fff',
        padding: 30,
        borderStyle: 'solid',
        // borderWidth: 1,
        borderColor: '#f4fffb',
        borderRadius: 15,
        backgroundColor: "#e6f2ed"
    },
    caloriesCircle: {
        width: 45,
        height: 45,
        borderRadius: 25,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FF6B6B',
        marginBottom: 8,
    },
    caloriesNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
    },
    caloriesLabel: {
        fontSize: 12,
        color: '#666',
    },
    nutritionGrid: {
        flex: 1,
        gap: 8,
    },
    nutritionItem: {
        width: '100%',
        padding: 8,
        borderStyle: 'solid',
        // borderWidth: 1,
        borderColor: '#f4fffb',
        borderRadius: 10,

        backgroundColor: "#e6f2ed"
    },
    nutritionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    nutritionLabel: {
        fontSize: 13,
        color: '#666',
        marginLeft: 8,
        flex: 1,
    },
    nutritionValue: {
        fontSize: 13,
        color: '#333',
        fontWeight: '500',
    },
    nutritionProgressBar: {
        height: 6,
        backgroundColor: '#cccccc',
        borderRadius: 3,
        overflow: 'hidden',
    },
    nutritionProgress: {
        height: '100%',
        backgroundColor: '#E0E0E0',
        borderRadius: 3,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        color: '#333',
    },
    mealSection: {
        padding: 10,
        // backgroundColor: '#fff',
        borderRadius: 12,
        paddingBottom: 60,
    },
    mealHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    mealHeaderText: {
        fontSize: 17,
        fontWeight: '600',
        color: '#333',
    },
    caloriesCount: {
        fontSize: 16,
        fontWeight: '600',
        color: '#35A55E',
    },
    mealTimeLabel: {
        marginLeft: 10,
        zIndex: 2,
        position: 'absolute',
        top: -15
    },
    mealTimeBadge: {
        backgroundColor: '#ce5214',
        color: '#FFF',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
        fontSize: 12,
        alignSelf: 'flex-start',
    },
    mealCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 8,
        marginBottom: 25,
        backgroundColor: "#e6f2ed"
    },
    mealInfo: {
        flex: 1,
        paddingLeft: 15,
    },
    mealName: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
    },
    nutritionInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    nutritionText: {
        fontSize: 13,
        color: '#666',
    },
    calories: {
        fontSize: 13,
        color: '#35A55E',
        fontWeight: '500',
    },
    mealImage: {
        width: 70,
        height: 70,
        borderRadius: 8,
    },

});
