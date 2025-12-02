import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    SafeAreaView,
    Linking,
    Animated,
    RefreshControl,
    ToastAndroid,
    Platform,
    Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { router } from 'expo-router';
import SheetComponent from '../../../components/sheet/SheetComponent';
import HeaderComponent from '../../../components/header/HeaderComponent';
import HeaderLeft from '../../../components/header/HeaderLeft';
import { getDietTypes } from '../../../redux/thunk/mealThunk';
import { getDietaryPreferences, updateDietaryPreferences } from '../../../redux/thunk/surveyThunk';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from '../../../styles/accounts/StyleDietType';

// Skeleton Loading Component
const SkeletonDietCard = () => {
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const shimmerAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmerAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );
        shimmerAnimation.start();

        return () => shimmerAnimation.stop();
    }, [shimmerAnim]);

    const translateX = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-300, 300],
    });

    return (
        <View style={styles.skeletonCard}>
            <View style={styles.skeletonCardLeft}>
                {/* Skeleton Title */}
                <View style={styles.skeletonTitle}>
                    <Animated.View
                        style={[
                            styles.shimmerOverlay,
                            {
                                transform: [{ translateX }],
                            },
                        ]}
                    />
                </View>
                
                {/* Skeleton Description */}
                <View style={styles.skeletonDescription}>
                    <Animated.View
                        style={[
                            styles.shimmerOverlay,
                            {
                                transform: [{ translateX }],
                            },
                        ]}
                    />
                </View>
                
                <View style={[styles.skeletonDescription, { width: '60%', marginTop: 4 }]}>
                    <Animated.View
                        style={[
                            styles.shimmerOverlay,
                            {
                                transform: [{ translateX }],
                            },
                        ]}
                    />
                </View>

                {/* Skeleton Detail Button */}
                <View style={styles.skeletonDetailButton}>
                    <Animated.View
                        style={[
                            styles.shimmerOverlay,
                            {
                                transform: [{ translateX }],
                            },
                        ]}
                    />
                </View>
            </View>

            {/* Skeleton Image */}
            <View style={styles.skeletonCardRight}>
                <View style={styles.skeletonImage}>
                    <Animated.View
                        style={[
                            styles.shimmerOverlay,
                            {
                                transform: [{ translateX }],
                            },
                        ]}
                    />
                </View>
            </View>
        </View>
    );
};

export default function DietType() {
    const [selectedDiet, setSelectedDiet] = useState(null);
    const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
    const [currentDietDetail, setCurrentDietDetail] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [initialDietLoaded, setInitialDietLoaded] = useState(false);
    const dispatch = useDispatch();

    // Lấy dữ liệu từ Redux
    const { dietTypes, loading: dietTypesLoading, error: dietTypesError } = useSelector(state => state.meal);
    const { 
        currentDietaryPreferences, 
        dietaryPreferencesLoading, 
        dietaryPreferencesError,
        updateDietaryPreferencesLoading 
    } = useSelector(state => state.survey);
    const { user } = useSelector(state => state.auth);

    // Reset initialDietLoaded khi component mount để luôn check lại
    useEffect(() => {
        setInitialDietLoaded(false);
        setSelectedDiet(null);
        
        // Cleanup function khi component unmount
        return () => {
            setInitialDietLoaded(false);
        };
    }, []); // Chạy khi component mount

    // Lấy danh sách chế độ ăn khi component mount
    useEffect(() => {
        if (dietTypes.length === 0) {
            dispatch(getDietTypes());
        }
    }, [dispatch, dietTypes.length]);

    // Lấy chế độ ăn hiện tại của user - Reset khi vào trang
    useEffect(() => {
        if (user && user._id) {
            console.log('Fetching dietary preferences for user:', user._id);
            dispatch(getDietaryPreferences(user._id));
        }
    }, [dispatch, user]);

    // Set selectedDiet khi có dữ liệu dietary preferences và diet types
    useEffect(() => {
       
        
        if (!initialDietLoaded && 
            currentDietaryPreferences && 
            dietTypes.length > 0 && 
            currentDietaryPreferences.DietType_id) {
            
            // Tìm diet có keyword matching với DietType_id
            const matchingDiet = dietTypes.find(diet => 
                diet.keyword === currentDietaryPreferences.DietType_id
            );
            
            console.log('Debug - searching for diet:', {
                searchKeyword: currentDietaryPreferences.DietType_id,
                availableDiets: dietTypes.map(d => ({ id: d._id, keyword: d.keyword, title: d.title })),
                matchingDiet: matchingDiet ? { id: matchingDiet._id, keyword: matchingDiet.keyword, title: matchingDiet.title } : null
            });
            
            if (matchingDiet) {
                console.log('Found matching diet, setting selectedDiet:', matchingDiet._id);
                setSelectedDiet(matchingDiet._id);
                setInitialDietLoaded(true);
            } else {
                console.warn('No matching diet found for keyword:', currentDietaryPreferences.DietType_id);
                setInitialDietLoaded(true);
            }
        }
    }, [currentDietaryPreferences, dietTypes, initialDietLoaded]);

    // Reset dietary preferences khi component unmount
    useEffect(() => {
        return () => {
            // Reset dietary preferences state khi rời khỏi trang
            const { resetDietaryPreferences } = require('../../../redux/slice/surveySlice');
            dispatch(resetDietaryPreferences());
        };
    }, [dispatch]);

    // Lưu chế độ ăn đã chọn
    const saveDietSelection = async () => {
        if (!selectedDiet || !user) return;

        try {
            // Tìm diet object để lấy keyword
            const selectedDietObject = sortedDietTypes.find(diet => diet._id === selectedDiet);
            if (!selectedDietObject) {
                if (Platform.OS === 'android') {
                    ToastAndroid.show('Không tìm thấy thông tin chế độ ăn đã chọn', ToastAndroid.SHORT);
                } else {
                    Alert.alert('Lỗi', 'Không tìm thấy thông tin chế độ ăn đã chọn');
                }
                return;
            }

            console.log('Updating dietary preferences:', {
                userId: user._id,
                dietTypeId: selectedDietObject.keyword
            });

            // Gọi API cập nhật dietary preferences
            await dispatch(updateDietaryPreferences({
                userId: user._id,
                dietTypeId: selectedDietObject.keyword
            })).unwrap();

            // Hiển thị thông báo thành công
            if (Platform.OS === 'android') {
                ToastAndroid.show('Đã cập nhật chế độ ăn thành công! 🎉', ToastAndroid.LONG);
            } else {
                Alert.alert('Thành công', 'Đã cập nhật chế độ ăn thành công!');
            }
            
            setHasChanges(false);
            router.back();
        } catch (error) {
            console.error('Error updating dietary preferences:', error);
            
            if (Platform.OS === 'android') {
                ToastAndroid.show('Có lỗi xảy ra khi cập nhật chế độ ăn. Vui lòng thử lại.', ToastAndroid.LONG);
            } else {
                Alert.alert('Lỗi', 'Có lỗi xảy ra khi cập nhật chế độ ăn. Vui lòng thử lại.');
            }
        }
    };

    // Hiển thị lỗi nếu có
    useEffect(() => {
        if (dietTypesError) {
            if (Platform.OS === 'android') {
                ToastAndroid.show('Có lỗi xảy ra khi tải danh sách chế độ ăn: ' + dietTypesError, ToastAndroid.LONG);
            } else {
                Alert.alert('Lỗi', 'Có lỗi xảy ra khi tải danh sách chế độ ăn: ' + dietTypesError);
            }
        }
        if (dietaryPreferencesError) {
            console.warn('Dietary preferences error:', dietaryPreferencesError);
        }
    }, [dietTypesError, dietaryPreferencesError]);

    // Giả định lấy chế độ ăn đã chọn từ trước (ví dụ từ API)
    useEffect(() => {
        // Mô phỏng việc lấy chế độ ăn từ API hoặc storage
        const fetchInitialDiet = () => {
            // Giả sử không có chế độ ăn nào được chọn trước đó
            setSelectedDiet(null);
        };

        fetchInitialDiet();
    }, []);

    // Tạo một mảng đã sắp xếp để hiển thị
    const sortedDietTypes = useMemo(() => {
        if (!Array.isArray(dietTypes)) return [];
        
        // Sắp xếp từ dưới lên trên (reverse)
        return [...dietTypes].reverse();
    }, [dietTypes]);

    // Hàm xử lý pull to refresh
    const onRefresh = async () => {
        setRefreshing(true);
        try {
            // Reset meal state để force reload
            const { resetMealState } = await import('../../../redux/slice/mealSlice');
            dispatch(resetMealState());
            
            // Gọi lại API
            await dispatch(getDietTypes());
        } catch (error) {
            console.error('Refresh error:', error);
        } finally {
            setRefreshing(false);
        }
    };

    // Mở sheet chi tiết cho chế độ ăn được chọn
    const openDietDetail = (diet) => {
        setCurrentDietDetail(diet);
        setIsDetailSheetOpen(true);
    };

    // Chọn chế độ ăn từ danh sách
    const selectDiet = (dietId) => {
        // Chỉ cho phép chọn, không cho phép bỏ chọn
        if (selectedDiet !== dietId) {
            setSelectedDiet(dietId);
            setHasChanges(true);
        }
    };

    // Chọn chế độ ăn từ sheet chi tiết
    const selectDietFromDetail = () => {
        if (currentDietDetail) {
            setSelectedDiet(currentDietDetail._id);
            setIsDetailSheetOpen(false);
            setHasChanges(true);
        }
    };

    // Handler functions
    const handleGoBack = () => {
        console.log('Quay lại');
        router.back();
    };

    // Reset state mỗi khi trang được focus
    useFocusEffect(
        useCallback(() => {
            console.log('DietType screen focused - resetting state');
            setInitialDietLoaded(false);
            setSelectedDiet(null);
            setHasChanges(false);
            
            // Lấy lại dietary preferences
            if (user && user._id) {
                dispatch(getDietaryPreferences(user._id));
            }
            
            return () => {
                // Cleanup khi unfocus
                console.log('DietType screen unfocused');
            };
        }, [user, dispatch])
    );

    // Hiển thị loading skeleton khi đang tải dữ liệu, refreshing, hoặc khi dietTypes không phải là array
    if (dietTypesLoading || refreshing || !Array.isArray(dietTypes) || dietaryPreferencesLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar style="dark" />

                {/* Header */}
                <HeaderComponent>
                    <HeaderLeft onGoBack={handleGoBack} title="Quay lại" />
                    <TouchableOpacity style={styles.backButton}>
                        <Text style={styles.TextPage}>Chế độ ăn</Text>
                    </TouchableOpacity>
                </HeaderComponent>

                {/* Phần giới thiệu */}
                <View style={styles.introContainer}>
                    <Text style={styles.introText}>
                        Chúng tôi đề xuất các chế độ ăn dưới đây, hãy chọn phù hợp nhất với sở thích của bạn?
                    </Text>
                </View>

                {/* Loading Skeleton với RefreshControl */}
                <ScrollView 
                    style={styles.scrollContainer}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#35A55E']} // Android
                            tintColor={'#35A55E'} // iOS
                            title="Đang tải..." // iOS
                            titleColor={'#35A55E'} // iOS
                        />
                    }
                >
                    {Array.from({ length: 6 }, (_, index) => (
                        <SkeletonDietCard key={index} />
                    ))}
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            {/* Header */}
            <HeaderComponent>
                <HeaderLeft onGoBack={handleGoBack} title="Quay lại" />
                <TouchableOpacity style={styles.backButton}>
                    <Text style={styles.TextPage}>Chế độ ăn</Text>
                </TouchableOpacity>
            </HeaderComponent>

            {/* Phần giới thiệu */}
            <View style={styles.introContainer}>
                <Text style={styles.introText}>
                    Chúng tôi đề xuất các chế độ ăn dưới đây, hãy chọn phù hợp nhất với sở thích của bạn?
                </Text>
            </View>

            {/* Danh sách chế độ ăn với RefreshControl */}
            <ScrollView 
                style={styles.scrollContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#35A55E']} // Android
                        tintColor={'#35A55E'} // iOS
                        title="Kéo để làm mới" // iOS
                        titleColor={'#35A55E'} // iOS
                    />
                }
            >
                {sortedDietTypes.map(diet => (
                    <TouchableOpacity
                        key={diet._id}
                        style={[
                            styles.dietCard,
                            selectedDiet === diet._id && styles.selectedDietCard
                        ]}
                        onPress={() => selectDiet(diet._id)}
                        activeOpacity={0.7}
                    >
                        {/* Thông tin chế độ ăn */}
                        <View style={styles.dietCardLeft}>
                            <Text style={[
                                styles.dietTitle,
                                selectedDiet === diet._id && styles.selectedDietTitle
                            ]}>
                                {diet.title}
                            </Text>
                            <Text style={styles.dietDescription}>
                                {diet.description}
                            </Text>

                            {/* Nút xem chi tiết */}
                            <TouchableOpacity
                                style={styles.detailButton}
                                onPress={() => openDietDetail(diet)}
                            >
                                <Text style={styles.detailButtonText}>
                                    Xem chi tiết chế độ ăn {">"}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Hình ảnh chế độ ăn */}
                        <View style={styles.dietCardRight}>
                            {diet.dietTypeImage ? (
                                <Image
                                    source={{ uri: diet.dietTypeImage }}
                                    style={styles.dietImage}
                                    resizeMode="cover"
                                />
                            ) : (
                                <View style={[styles.dietImage, { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }]}>
                                    <Text style={{ color: '#999' }}>Không có ảnh</Text>
                                </View>
                            )}

                            {/* Hiển thị dấu tích nếu đã chọn */}
                            {selectedDiet === diet._id && (
                                <View style={styles.checkmarkContainer}>
                                    <Ionicons name="checkmark-circle" size={28} color="#35A55E" />
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Nút lưu chế độ ăn */}
            {hasChanges && (
                <View style={styles.saveButtonContainer}>
                    <TouchableOpacity
                        style={[styles.saveButton, updateDietaryPreferencesLoading && styles.buttonDisabled]}
                        onPress={saveDietSelection}
                        disabled={updateDietaryPreferencesLoading}
                    >
                        <Text style={styles.saveButtonText}>
                            {updateDietaryPreferencesLoading ? 'Đang lưu...' : 'Lưu'}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Sheet chi tiết chế độ ăn */}
            <SheetComponent
                isOpen={isDetailSheetOpen}
                onClose={() => setIsDetailSheetOpen(false)}
                snapPoints={[90]}
                position={0}
            >
                {currentDietDetail && (
                    <View style={styles.detailSheet}>
                        {/* Header của sheet */}
                        <View style={styles.sheetHeader}>
                            <Text style={styles.sheetTitle}>{currentDietDetail.title}</Text>
                            <TouchableOpacity
                                onPress={() => setIsDetailSheetOpen(false)}
                            >
                                <Ionicons name="close" size={24} color="#666666" />
                            </TouchableOpacity>
                        </View>

                        {/* Phần nội dung chi tiết */}
                        <ScrollView 
                            style={styles.sheetContent}
                            contentContainerStyle={styles.sheetScrollContent}
                        >
                            {/* Hình ảnh minh họa */}
                            {currentDietDetail.dietTypeImage ? (
                                <Image
                                    source={{ uri: currentDietDetail.dietTypeImage }}
                                    style={styles.sheetImage}
                                    resizeMode="cover"
                                />
                            ) : (
                                <View style={[styles.sheetImage, { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }]}>
                                    <Text style={{ color: '#999' }}>Không có ảnh</Text>
                                </View>
                            )}

                            {/* Phần mô tả chi tiết */}
                            <View style={styles.sheetDescriptionContainer}>
                                <Text style={styles.sheetDescription}>
                                    {currentDietDetail.descriptionDetail}
                                </Text>
                            </View>

                            {/* Thông tin dinh dưỡng - Hiển thị nếu có dữ liệu */}
                            {currentDietDetail.nutrition && (
                                <View style={styles.nutritionContainer}>
                                    <Text style={styles.sectionTitle}>Thông tin dinh dưỡng</Text>
                                    
                                    {/* Macros display in cards */}
                                    <View style={styles.macroCardContainer}>
                                        {/* Calories */}
                                        <View style={styles.macroCard}>
                                            <View style={[styles.macroIcon, { backgroundColor: '#FF6B6B' }]}>
                                                <Ionicons name="flame" size={20} color="white" />
                                            </View>
                                            <Text style={styles.macroValue}>{currentDietDetail.nutrition.calories}</Text>
                                            <Text style={styles.macroLabel}>Calo</Text>
                                        </View>
                                        
                                        {/* Protein */}
                                        <View style={styles.macroCard}>
                                            <View style={[styles.macroIcon, { backgroundColor: '#4ECDC4' }]}>
                                                <Ionicons name="fitness" size={20} color="white" />
                                            </View>
                                            <Text style={styles.macroValue}>{currentDietDetail.nutrition.protein}g</Text>
                                            <Text style={styles.macroLabel}>Protein</Text>
                                        </View>
                                        
                                        {/* Carbs */}
                                        <View style={styles.macroCard}>
                                            <View style={[styles.macroIcon, { backgroundColor: '#45B7D1' }]}>
                                                <Ionicons name="leaf" size={20} color="white" />
                                            </View>
                                            <Text style={styles.macroValue}>{currentDietDetail.nutrition.carbs}g</Text>
                                            <Text style={styles.macroLabel}>Carbs</Text>
                                        </View>
                                        
                                        {/* Fat */}
                                        <View style={styles.macroCard}>
                                            <View style={[styles.macroIcon, { backgroundColor: '#96CEB4' }]}>
                                                <Ionicons name="water" size={20} color="white" />
                                            </View>
                                            <Text style={styles.macroValue}>{currentDietDetail.nutrition.fat}g</Text>
                                            <Text style={styles.macroLabel}>Chất béo</Text>
                                        </View>
                                    </View>
                                    
                                    {/* Nguồn khuyến nghị - Đảm bảo luôn hiển thị nếu có */}
                                    {currentDietDetail.researchSource && (
                                        <View style={styles.sourceContainer}>
                                            <Text style={styles.sourceTitle}>Nguồn khuyến nghị:</Text>
                                            <TouchableOpacity 
                                                onPress={() => Linking.openURL(currentDietDetail.researchSource)}
                                                style={styles.sourceLink}
                                            >
                                                <Text style={styles.sourceLinkText}>
                                                    {currentDietDetail.researchSource}
                                                </Text>
                                                <Ionicons name="open-outline" size={16} color="#35A55E" style={{ marginLeft: 5 }} />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            )}

                            {/* Thêm nguồn khuyến nghị riêng biệt nếu không có nutrition */}
                            {!currentDietDetail.nutrition && currentDietDetail.researchSource && (
                                <View style={styles.nutritionContainer}>
                                    <View style={styles.sourceContainer}>
                                        <Text style={styles.sourceTitle}>Nguồn khuyến nghị:</Text>
                                        <TouchableOpacity 
                                            onPress={() => Linking.openURL(currentDietDetail.researchSource)}
                                            style={styles.sourceLink}
                                        >
                                            <Text style={styles.sourceLinkText}>
                                                {currentDietDetail.researchSource}
                                            </Text>
                                            <Ionicons name="open-outline" size={16} color="#35A55E" style={{ marginLeft: 5 }} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </ScrollView>

                        {/* Nút chọn chế độ ăn - Fixed position */}
                        <View style={styles.selectButtonContainer}>
                            <TouchableOpacity
                                style={[styles.selectButton, selectedDiet === currentDietDetail._id && styles.selectedButton]}
                                onPress={selectDietFromDetail}
                            >
                                <Text style={styles.selectButtonText}>
                                    {selectedDiet === currentDietDetail._id
                                        ? "Đã chọn chế độ ăn này"
                                        : "Chọn chế độ ăn này"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </SheetComponent>
        </SafeAreaView>
    );
}
