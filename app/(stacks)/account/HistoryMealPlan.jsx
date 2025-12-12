import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    FlatList,
    Dimensions,
    SafeAreaView,
    Image,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import HeaderComponent from '../../../components/header/HeaderComponent';
import HeaderLeft from '../../../components/header/HeaderLeft';
import { useDispatch, useSelector } from 'react-redux';
import { getMealPlanFromDatabase } from '../../../redux/thunk/mealPlanThunk';

export default function HistoryMealPlan() {
    const router = useRouter();
    const dispatch = useDispatch();
    const today = new Date();
    
    const [selectedDate, setSelectedDate] = useState(today);
    const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const flatListRef = useRef(null);

    // Redux selectors
    const { databaseMealPlan, getMealPlanFromDatabaseLoading } = useSelector(
        (state) => state.mealPlan
    );

    // Load meal plan khi component mount
    useEffect(() => {
        loadMealPlan(today);
    }, []);

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
                isToday:
                    weekDate.getDate() === new Date().getDate() &&
                    weekDate.getMonth() === new Date().getMonth() &&
                    weekDate.getFullYear() === new Date().getFullYear(),
                isFuture: weekDate > new Date(new Date().setHours(23, 59, 59, 999)),
                isSelected:
                    selectedDate &&
                    weekDate.getDate() === selectedDate.getDate() &&
                    weekDate.getMonth() === selectedDate.getMonth() &&
                    weekDate.getFullYear() === selectedDate.getFullYear(),
            };
        });
    };

    // Load meal plan
    const loadMealPlan = async (date) => {
        try {
            await dispatch(getMealPlanFromDatabase(date)).unwrap();
        } catch (error) {
            console.error('Error loading meal plan:', error);
        }
    };

    // Refresh handler
    const onRefresh = async () => {
        setRefreshing(true);
        await loadMealPlan(selectedDate);
        setRefreshing(false);
    };

    // Tạo mảng các tuần
    const weeks = [
        { id: '-1', days: getWeekDays(today, -1) },
        { id: '0', days: getWeekDays(today, 0) },
    ];

    const handleGoBack = () => {
        router.back();
    };

    // Navigate to meal detail
    const handleViewMealDetail = (mealId) => {
        router.push({
            pathname: '/(stacks)/meals/MealDetail',
            params: { id: mealId },
        });
    };

    // Render meal card
    const renderMealCard = (meal, servingTime) => {
        const mealDetail = meal.mealDetail;
        const servingTimeLabel = {
            breakfast: 'Bữa sáng',
            lunch: 'Bữa trưa',
            dinner: 'Bữa tối',
            snack: 'Ăn vặt',
        }[servingTime] || servingTime;

        return (
            <TouchableOpacity
                key={meal._id}
                style={styles.mealCard}
                onPress={() => handleViewMealDetail(mealDetail._id)}
                activeOpacity={0.7}
            >
                <View style={styles.mealTimeLabel}>
                    <Text style={styles.mealTimeBadge}>{servingTimeLabel}</Text>
                </View>

                {/* Badge đã ăn */}
                {meal.isEaten && (
                    <View style={styles.eatenBadge}>
                        <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
                        <Text style={styles.eatenBadgeText}>Đã ăn</Text>
                    </View>
                )}

                <Image
                    source={
                        mealDetail.mealImage
                            ? { uri: mealDetail.mealImage }
                            : require('../../../assets/images/food1.png')
                    }
                    style={styles.mealImage}
                />
                <View style={styles.mealInfo}>
                    <Text style={styles.mealName}>{mealDetail.nameMeal}</Text>
                    <View style={styles.nutritionInfo}>
                        <Text style={styles.nutritionText}>
                            <MaterialCommunityIcons name="food-steak" size={16} />{' '}
                            {Math.round(mealDetail.nutrition?.protein || 0)}g
                        </Text>
                        <Text style={styles.nutritionText}>
                            <MaterialCommunityIcons name="nutrition" size={16} />{' '}
                            {Math.round(mealDetail.nutrition?.fat || 0)}g
                        </Text>
                        <Text style={styles.nutritionText}>
                            <MaterialCommunityIcons name="barley" size={16} />{' '}
                            {Math.round(mealDetail.nutrition?.carbs || 0)}g
                        </Text>
                        <Text style={styles.calories}>
                            {Math.round(mealDetail.nutrition?.calories || 0)} kcal
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />

            {/* Header */}
            <HeaderComponent>
                <HeaderLeft onGoBack={handleGoBack} title="Quay lại" />
                <TouchableOpacity style={styles.backButton}>
                    <Text style={styles.TextPage}>Lịch sử thực đơn</Text>
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
                            const newOffset =
                                position < Dimensions.get('window').width / 2 ? -1 : 0;
                            setCurrentWeekOffset(newOffset);
                        }}
                        contentContainerStyle={styles.calendarFlatListContent}
                        renderItem={({ item }) => (
                            <View
                                style={[
                                    styles.weekContainer,
                                    item.id === '0' ? styles.activeWeekContainer : null,
                                ]}
                            >
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
                                            loadMealPlan(day.fullDate);
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

                                        <View
                                            style={[
                                                styles.dateCircle,
                                                day.isSelected ? styles.activeDateCircle : null,
                                                day.isFuture ? styles.futureDateCircle : null,
                                            ]}
                                        >
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

            {/* Meal Plan Content */}
            {getMealPlanFromDatabaseLoading ? (
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
                        {databaseMealPlan &&
                        databaseMealPlan.mealPlan &&
                        databaseMealPlan.mealPlan.length > 0 ? (
                            databaseMealPlan.mealPlan.map((mealTime) => (
                                <View key={mealTime.servingTime} style={styles.servingTimeSection}>
                                    <Text style={styles.servingTimeTitle}>
                                        {mealTime.servingTime === 'breakfast'
                                            ? 'Bữa sáng'
                                            : mealTime.servingTime === 'lunch'
                                            ? 'Bữa trưa'
                                            : 'Bữa tối'}
                                    </Text>
                                    {mealTime.meals.map((meal) =>
                                        renderMealCard(meal, mealTime.servingTime)
                                    )}
                                </View>
                            ))
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Ionicons name="calendar-outline" size={64} color="#CCCCCC" />
                                <Text style={styles.emptyText}>
                                    Không có thực đơn cho ngày này
                                </Text>
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
    },
    backButton: {
        flex: 1,
        alignItems: 'center',
    },
    TextPage: {
        fontSize: 17,
        fontWeight: '600',
        color: '#fff',
    },
    calendarContainer: {
        marginTop: 100,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    calendarNavigationContainer: {
        position: 'relative',
    },
    calendarFlatListContent: {},
    weekContainer: {
        width: Dimensions.get('window').width - 42,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 0,
        alignSelf: 'center',
    },
    dateItem: {
        width: 40,
        height: 65,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        backgroundColor: 'transparent',
        marginHorizontal: 3,
    },
    activeDateItem: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#35A55E',
    },
    futureDateItem: {
        backgroundColor: 'transparent',
        borderColor: '#E0E0E0',
    },
    dayText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 4,
        fontWeight: '400',
    },
    activeDayText: {
        color: '#35A55E',
        fontWeight: '600',
    },
    futureDayText: {
        color: '#999',
    },
    dateCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderWidth: 0,
    },
    activeDateCircle: {
        backgroundColor: '#35A55E',
        borderWidth: 0,
    },
    futureDateCircle: {
        borderWidth: 0,
    },
    dateText: {
        fontSize: 16,
        color: '#333',
    },
    activeDateText: {
        color: '#fff',
    },
    futureDateText: {
        color: '#999',
    },
    scrollContent: {
        flex: 1,
    },
    mealSection: {
        padding: 10,
        paddingBottom: 30,
    },
    servingTimeSection: {
        marginBottom: 30,
    },
    servingTimeTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 15,
        paddingLeft: 5,
    },
    mealCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 12,
        marginBottom: 15,
        backgroundColor: '#e6f2ed',
        position: 'relative',
    },
    mealTimeLabel: {
        position: 'absolute',
        top: -10,
        left: 10,
        zIndex: 2,
    },
    mealTimeBadge: {
        backgroundColor: '#ce5214',
        color: '#FFF',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
        fontSize: 11,
        fontWeight: '600',
    },
    eatenBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#35A55E',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        zIndex: 2,
    },
    eatenBadgeText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '600',
        marginLeft: 4,
    },
    mealImage: {
        width: 70,
        height: 70,
        borderRadius: 8,
        backgroundColor: '#F0F0F0',
    },
    mealInfo: {
        flex: 1,
        paddingLeft: 15,
    },
    mealName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2C3E50',
        marginBottom: 8,
    },
    nutritionInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flexWrap: 'wrap',
    },
    nutritionText: {
        fontSize: 13,
        color: '#666',
    },
    calories: {
        fontSize: 13,
        color: '#35A55E',
        fontWeight: '600',
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
        paddingVertical: 80,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
    },
});
