import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    RefreshControl,
    FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { getRandomMeals } from '../../../redux/thunk/mealThunk';

export default function MealTab() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);

    // Redux selectors
    const { 
        randomMeals, 
        randomMealsLoading, 
        randomMealsError,
        randomMealsPagination 
    } = useSelector((state) => state.meal);

    // Load meals khi component mount
    useEffect(() => {
        loadMeals(1);
    }, []);

    const loadMeals = async (pageNum = 1) => {
        try {
            await dispatch(getRandomMeals({ page: pageNum, limit: 20 })).unwrap();
            setPage(pageNum);
        } catch (error) {
            console.error('Error loading random meals:', error);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadMeals(1);
        setRefreshing(false);
    };

    // Filter meals based on search query
    const filteredMeals = randomMeals.filter(item =>
        item.nameMeal.toLowerCase().includes(search.toLowerCase())
    );

    // Điều hướng sang chi tiết món ăn
    const handleViewMealDetail = (meal) => {
        router.push({
            pathname: '/(stacks)/meals/MealDetail',
            params: { id: meal._id },
        });
    };

    const renderMealItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => handleViewMealDetail(item)}
            activeOpacity={0.7}
        >
            <Image 
                source={
                    item.mealImage 
                        ? { uri: item.mealImage } 
                        : require('../../../assets/images/food1.png')
                } 
                style={styles.logo} 
            />
            <Text style={styles.title} numberOfLines={2}>
                {item.nameMeal}
            </Text>
            
            {/* Hiển thị category nếu có */}
            {item.mealCategory && (
                <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>
                        {item.mealCategory.title}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );

    const renderEmptyComponent = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="restaurant-outline" size={64} color="#CCCCCC" />
            <Text style={styles.emptyText}>
                {search ? 'Không tìm thấy món ăn nào' : 'Chưa có món ăn nào'}
            </Text>
        </View>
    );

    const renderFooter = () => {
        if (!randomMealsLoading) return null;
        
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#35A55E" />
            </View>
        );
    };

    if (randomMealsLoading && page === 1) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#35A55E" />
                <Text style={styles.loadingText}>Đang tải món ăn...</Text>
            </View>
        );
    }

    if (randomMealsError) {
        return (
            <View style={styles.errorContainer}>
                <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
                <Text style={styles.errorText}>{randomMealsError}</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => loadMeals(1)}
                >
                    <Text style={styles.retryButtonText}>Thử lại</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Thanh tìm kiếm + icon sắp xếp */}
            <View style={styles.searchBarContainer}>
                <View style={styles.searchInputContainer}>
                    <Ionicons name="search-outline" size={20} color="#35A55E" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Tìm món ăn..."
                        value={search}
                        onChangeText={setSearch}
                    />
                    {search.length > 0 && (
                        <TouchableOpacity onPress={() => setSearch('')}>
                            <Ionicons name="close-circle" size={20} color="#999" />
                        </TouchableOpacity>
                    )}
                </View>

                <TouchableOpacity style={styles.sortButton}>
                    <Ionicons name="filter-outline" size={22} color="#35A55E" />
                </TouchableOpacity>
            </View>

            {/* Danh sách món ăn với FlatList */}
            <FlatList
                data={filteredMeals}
                renderItem={renderMealItem}
                keyExtractor={(item) => item._id}
                numColumns={3}
                contentContainerStyle={styles.gridContainer}
                columnWrapperStyle={styles.row}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={renderEmptyComponent}
                ListFooterComponent={renderFooter}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#35A55E']}
                        tintColor="#35A55E"
                    />
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#666',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    retryButton: {
        marginTop: 20,
        backgroundColor: '#35A55E',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    searchInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 42,
        borderWidth: 1,
        borderColor: '#35A55E',
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
        height: 40,
        color: '#333',
    },
    sortButton: {
        marginLeft: 10,
        padding: 8,
        borderRadius: 10,
        backgroundColor: 'rgba(53, 165, 94, 0.1)',
    },
    gridContainer: {
        paddingBottom: 80,
    },
    row: {
        justifyContent: 'flex-start',
        gap: 10,
        marginBottom: 10,
    },
    card: {
        width: '31%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 8,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        position: 'relative',
    },
    logo: {
        width: '100%',
        height: 80,
        borderRadius: 8,
        marginBottom: 8,
        backgroundColor: '#F0F0F0',
    },
    title: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        textAlign: 'center',
        minHeight: 36,
    },
    categoryBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(53, 165, 94, 0.9)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    categoryText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '600',
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
    },
    footerLoader: {
        paddingVertical: 20,
        alignItems: 'center',
    },
});
