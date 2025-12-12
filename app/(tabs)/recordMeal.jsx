import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, FlatList, Dimensions, SafeAreaView, Image, RefreshControl, ActivityIndicator, ToastAndroid, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import HeaderComponent from '../../components/header/HeaderComponent';
import { useDispatch, useSelector } from 'react-redux';
import { getMealHistory, toggleMealEaten } from '../../redux/thunk/mealPlanThunk';
import { getNutritionGoals } from '../../redux/thunk/surveyThunk';

export default function RecordMeal() {
    const today = new Date();
    const dispatch = useDispatch();

    // Redux selectors - thêm nutritionGoals
    const { mealHistory, mealHistoryLoading, mealHistoryError } = useSelector((state) => state.mealPlan);
    const { nutritionGoals, nutritionGoalsLoading } = useSelector((state) => state.survey);

    const [selectedDate, setSelectedDate] = useState(today);
    const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const flatListRef = useRef(null);

    // Hàm lấy tên tháng từ số tháng
    const getMonthName = (monthNumber) => {
        const months = [
            'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
            'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
        ];
        return months[monthNumber - 1];
    };
    
    const [currentMonth, setCurrentMonth] = useState(getMonthName(today.getMonth() + 1));

    // Hàm để lấy các ngày trong tuần với offset
    const getWeekDays = (date = new Date(), weekOffset = 0) => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + (weekOffset * 7));

        const day = newDate.getDay();
        const diff = newDate.getDate() - day + (day === 0 ? -6 : 1);

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
                isFuture: weekDate > new Date(new Date().setHours(23, 59, 59, 999)),
                // Thêm flag để check ngày được chọn
                isSelected: selectedDate && 
                    weekDate.getDate() === selectedDate.getDate() &&
                    weekDate.getMonth() === selectedDate.getMonth() &&
                    weekDate.getFullYear() === selectedDate.getFullYear()
            };
        });
    };

    // Load meal history và nutrition goals khi component mount
    useEffect(() => {
        loadMealHistory(today);
        dispatch(getNutritionGoals());
    }, []);

    // Load meal history
    const loadMealHistory = async (date) => {
        try {
            await dispatch(getMealHistory(date)).unwrap();
        } catch (error) {
            console.error('Error loading meal history:', error);
        }
    };

    // Refresh handler
    const onRefresh = async () => {
        setRefreshing(true);
        await loadMealHistory(today);
        setRefreshing(false);
    };

    // Tính tổng dinh dưỡng từ mealHistory
    const getTotalNutrition = () => {
        if (!mealHistory || !mealHistory.stats) {
            return { calories: 0, protein: 0, fat: 0, carbs: 0 };
        }
        return mealHistory.stats.totalNutrition;
    };

    // Lấy target nutrition từ nutritionGoals
    const getTargetNutrition = () => {
        // Nếu không có data thì return 0
        if (!nutritionGoals || !nutritionGoals.nutritionGoals) {
            return {
                calories: 0,
                protein: 0,
                fat: 0,
                carbs: 0
            };
        }

        const goals = nutritionGoals.nutritionGoals;
        const caloriesPerDay = goals.caloriesPerDay || 0;

        // Tính macro từ calories và percentages
        // 1g protein = 4 calo, 1g carbs = 4 calo, 1g fat = 9 calo
        const proteinCalories = (caloriesPerDay * (goals.proteinPercentage || 0)) / 100;
        const carbsCalories = (caloriesPerDay * (goals.carbPercentage || 0)) / 100;
        const fatCalories = (caloriesPerDay * (goals.fatPercentage || 0)) / 100;

        return {
            calories: caloriesPerDay,
            protein: Math.round(proteinCalories / 4),
            carbs: Math.round(carbsCalories / 4),
            fat: Math.round(fatCalories / 9)
        };
    };

    // Cập nhật dữ liệu dinh dưỡng từ API với target từ nutritionGoals
    const totalNutrition = getTotalNutrition();
    const targetNutrition = getTargetNutrition();
    
    const nutritionData = [
        { 
            icon: 'food-steak', 
            label: 'Protein', 
            current: totalNutrition.protein, 
            target: targetNutrition.protein, 
            unit: 'g', 
            color: '#4ECDC4' 
        },
        { 
            icon: 'nutrition', 
            label: 'Fat', 
            current: totalNutrition.fat, 
            target: targetNutrition.fat, 
            unit: 'g', 
            color: '#FFB347' 
        },
        { 
            icon: 'barley', 
            label: 'Carbs', 
            current: totalNutrition.carbs, 
            target: targetNutrition.carbs, 
            unit: 'g', 
            color: '#45B7D1' 
        },
    ];

    // Tạo mảng các tuần
    const weeks = [
        { id: '-1', days: getWeekDays(today, -1) },
        { id: '0', days: getWeekDays(today, 0) }
    ];

    // Get meals từ mealHistory và group theo servingTime
    const getMealsByServingTime = (servingTime) => {
        if (!mealHistory || !mealHistory.history) return [];
        
        return mealHistory.history.filter(item => item.servingTime === servingTime);
    };

    // Thêm handler để uneat meal
    const handleUneatMeal = async (historyItem) => {
        try {
            // Lấy dateString từ selectedDate với format đúng
            let dateString;
            if (selectedDate instanceof Date) {
                const year = selectedDate.getFullYear();
                const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                const day = String(selectedDate.getDate()).padStart(2, '0');
                dateString = `${year}-${month}-${day}`;
            } else {
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const day = String(today.getDate()).padStart(2, '0');
                dateString = `${year}-${month}-${day}`;
            }

            console.log('Uneat meal - Date string:', dateString);

            await dispatch(toggleMealEaten({
                date: dateString,
                servingTime: historyItem.servingTime,
                mealId: historyItem.mealDetail._id,
                action: 'UNEAT'
            })).unwrap();

            // Reload meal history để cập nhật UI
            await loadMealHistory(selectedDate);
            
            // Hiển thị toast thông báo
            if (Platform.OS === 'android') {
                ToastAndroid.show('Đã hủy ghi nhận món ăn', ToastAndroid.SHORT);
            } else {
                Alert.alert('Thành công', 'Đã hủy ghi nhận món ăn');
            }
        } catch (error) {
            console.error('Error uneating meal:', error);
            if (Platform.OS === 'android') {
                ToastAndroid.show('Không thể hủy ghi nhận món ăn', ToastAndroid.SHORT);
            } else {
                Alert.alert('Lỗi', error || 'Không thể hủy ghi nhận món ăn');
            }
        }
    };

    // Render meal card
    const renderMealCard = (historyItem) => {
        const meal = historyItem.mealDetail;
        const servingTimeLabel = {
            breakfast: 'Bữa sáng',
            lunch: 'Bữa trưa',
            dinner: 'Bữa tối',
            snack: 'Ăn vặt'
        }[historyItem.servingTime] || historyItem.servingTime;

        return (
            <View key={historyItem._id} style={styles.mealCard}>
                <View style={styles.mealTimeLabel}>
                    <Text style={styles.mealTimeBadge}>{servingTimeLabel}</Text>
                </View>
                
                {/* Thêm nút back để uneat */}
                <TouchableOpacity 
                    style={styles.uneatButton}
                    onPress={() => handleUneatMeal(historyItem)}
                >
                    <Ionicons name="arrow-back" size={20} color="#FF6B6B" />
                </TouchableOpacity>

                <Image
                    source={{ uri: meal.mealImage }}
                    style={styles.mealImage}
                />
                <View style={styles.mealInfo}>
                    <Text style={styles.mealName}>{meal.nameMeal}</Text>
                    <View style={styles.nutritionInfo}>
                        <Text style={styles.nutritionText}>
                            <MaterialCommunityIcons name="food-steak" size={16} /> {Math.round(meal.actualNutrition.protein)}g
                        </Text>
                        <Text style={styles.nutritionText}>
                            <MaterialCommunityIcons name="nutrition" size={16} /> {Math.round(meal.actualNutrition.fat)}g
                        </Text>
                        <Text style={styles.nutritionText}>
                            <MaterialCommunityIcons name="barley" size={16} /> {Math.round(meal.actualNutrition.carbs)}g
                        </Text>
                        <Text style={styles.calories}>{Math.round(meal.actualNutrition.calories)} kcal</Text>
                    </View>
                </View>
            </View>
        );
    };

    const handleDatePress = () => {
        if (Platform.OS === 'android') {
            ToastAndroid.show('Chức năng chọn ngày sẽ được phát triển', ToastAndroid.SHORT);
        } else {
            Alert.alert('Date Picker', 'Chức năng chọn ngày sẽ được phát triển');
        }
    };

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
            <View style={styles.calendarContainer}>
                <View style={styles.calendarNavigationContainer}>
                    <FlatList
                        ref={flatListRef}
                        data={weeks}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.id}
                        initialScrollIndex={1}
                        getItemLayout={(data, index) => ({
                            length: Dimensions.get('window').width - 30,
                            offset: (Dimensions.get('window').width - 30) * index,
                            index,
                        })}
                        onMomentumScrollEnd={(event) => {
                            const position = event.nativeEvent.contentOffset.x;
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
                                            day.isSelected ? styles.activeDateItem : null,
                                            day.isFuture ? styles.futureDateItem : null,
                                        ]}
                                        disabled={day.isFuture}
                                        onPress={() => {
                                            console.log('Selected date:', day.fullDate);
                                            setSelectedDate(day.fullDate);
                                            loadMealHistory(day.fullDate);
                                        }}
                                    >
                                        <Text
                                            style={[
                                                styles.dayText,
                                                day.isSelected ? styles.activeDayText : null,
                                                day.isFuture ? styles.futureDayText : null,
                                            ]}
                                        >
                                            {day.day}
                                        </Text>

                                        <View style={[
                                            styles.dateCircle,
                                            day.isSelected ? styles.activeDateCircle : null,
                                            day.isFuture ? styles.futureDateCircle : null,
                                        ]}>
                                            <Text
                                                style={[
                                                    styles.dateText,
                                                    day.isSelected ? styles.activeDateText : null,
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

            {/* Nutrition Info Box - Cập nhật hiển thị */}
            <View style={styles.nutritionBox}>
                <View style={styles.nutritionContent}>
                    <View style={styles.caloriesSection}>
                        <View style={styles.caloriesCircle}>
                            <MaterialCommunityIcons name="fire" size={24} color="#FF6B6B" />
                        </View>
                        <Text style={styles.caloriesNumber}>
                            {Math.round(totalNutrition.calories)}
                        </Text>
                        <Text style={styles.caloriesLabel}>Calo đã ăn</Text>
                        
                        {/* Hiển thị target calories */}
                        <Text style={styles.caloriesTarget}>
                            / {targetNutrition.calories} kcal
                        </Text>
                    </View>
                    
                    <View style={styles.nutritionGrid}>
                        {nutritionData.map((item, index) => (
                            <View key={index} style={styles.nutritionItem}>
                                <View style={styles.nutritionHeader}>
                                    <MaterialCommunityIcons name={item.icon} size={20} color={item.color} />
                                    <Text style={styles.nutritionLabel}>{item.label}</Text>
                                    <Text style={styles.nutritionValue}>
                                        {Math.round(item.current)}/{item.target} {item.unit}
                                    </Text>
                                </View>
                                <View style={styles.nutritionProgressBar}>
                                    <View style={[
                                        styles.nutritionProgress, 
                                        { 
                                            width: `${Math.min((item.current / item.target) * 100, 100)}%`, 
                                            backgroundColor: item.color 
                                        }
                                    ]} />
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            </View>

            <View style={styles.mealHeader}>
                <Text style={styles.mealHeaderText}>Lượng calo tiêu thụ</Text>
                <Text style={styles.caloriesCount}>{Math.round(totalNutrition.calories)} kcal</Text>
            </View>

            {mealHistoryLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#35A55E" />
                    <Text style={styles.loadingText}>Đang tải...</Text>
                </View>
            ) : (
                <ScrollView 
                    style={styles.scrollContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#35A55E']}
                            tintColor="#35A55E"
                        />
                    }
                >
                    <View style={styles.mealSection}>
                        {mealHistory && mealHistory.history && mealHistory.history.length > 0 ? (
                            mealHistory.history.map((historyItem) => renderMealCard(historyItem))
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Ionicons name="restaurant-outline" size={64} color="#CCCCCC" />
                                <Text style={styles.emptyText}>Chưa có món ăn nào được ghi nhận</Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
            )}
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
    // Thêm style mới cho target calories
    caloriesTarget: {
        fontSize: 11,
        color: '#999',
        marginTop: 2,
        fontWeight: '500',
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
        backgroundColor: "#e6f2ed",
        position: 'relative', // Thêm để định vị nút back
    },
    // Thêm style cho nút uneat
    uneatButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#FFF',
        borderRadius: 20,
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        zIndex: 10,
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#666',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
    },
});
