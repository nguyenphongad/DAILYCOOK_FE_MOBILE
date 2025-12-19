import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    Image,
    ActivityIndicator,
    Modal,
    Alert,
    Platform,
    ToastAndroid
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { getRandomMeals, getMealCategories, getMealsByCategory } from '../../../redux/thunk/mealThunk';
import { saveMealPlan, cacheMealPlan } from '../../../redux/thunk/mealPlanThunk';
import HeaderComponent from '../../../components/header/HeaderComponent';
import HeaderLeft from '../../../components/header/HeaderLeft';
import SheetComponent from '../../../components/sheet/SheetComponent';
import MealAcceptedSheet from '../../../components/sheet/MealAcceptedSheet';

// Meal Type Sheet Component
const MealTypeSheet = ({ isOpen, onClose, onSelectMealType }) => {
    const mealTypes = [
        { value: 'breakfast', label: 'Bữa sáng', icon: 'sunny', color: '#FF9800' },
        { value: 'lunch', label: 'Bữa trưa', icon: 'restaurant', color: '#4CAF50' },
        { value: 'dinner', label: 'Bữa tối', icon: 'moon', color: '#9C27B0' }
    ];

    return (
        <SheetComponent isOpen={isOpen} onClose={onClose} snapPoints={[60]}>
            <View style={styles.sheetContent}>
                <Text style={styles.sheetTitle}>Chọn bữa ăn</Text>
                {mealTypes.map((type) => (
                    <TouchableOpacity
                        key={type.value}
                        style={styles.mealTypeOption}
                        onPress={() => onSelectMealType(type.value)}
                    >
                        <View style={[styles.mealTypeIcon, { backgroundColor: `${type.color}20` }]}>
                            <Ionicons name={type.icon} size={24} color={type.color} />
                        </View>
                        <Text style={styles.mealTypeLabel}>{type.label}</Text>
                        <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
                    </TouchableOpacity>
                ))}
            </View>
        </SheetComponent>
    );
};

// Cart Modal Component
const CartModal = ({ visible, onClose, cart, onRemoveMeal, onConfirm, saveMealPlanLoading }) => {
    const mealTypeLabels = {
        breakfast: 'Bữa sáng',
        lunch: 'Bữa trưa',
        dinner: 'Bữa tối'
    };

    const getTotalNutrition = () => {
        let total = { calories: 0, protein: 0, carbs: 0, fat: 0 };
        Object.values(cart).forEach(meals => {
            meals.forEach(meal => {
                total.calories += meal.calories;
                total.protein += meal.protein;
                total.carbs += meal.carbs;
                total.fat += meal.fat;
            });
        });
        return total;
    };

    const totalNutrition = getTotalNutrition();
    const totalMeals = Object.values(cart).reduce((sum, meals) => sum + meals.length, 0);

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    {/* Modal Header */}
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{totalMeals} Thực đơn đã chọn </Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    {/* Nutrition Summary */}
                    {/* <View style={styles.nutritionSummary}>
                        <View style={styles.nutritionItem}>
                            <Text style={styles.nutritionValue}>{totalNutrition.calories}</Text>
                            <Text style={styles.nutritionLabel}>Kcal</Text>
                        </View>
                        <View style={styles.nutritionItem}>
                            <Text style={styles.nutritionValue}>{totalNutrition.protein}g</Text>
                            <Text style={styles.nutritionLabel}>Protein</Text>
                        </View>
                        <View style={styles.nutritionItem}>
                            <Text style={styles.nutritionValue}>{totalNutrition.carbs}g</Text>
                            <Text style={styles.nutritionLabel}>Carbs</Text>
                        </View>
                        <View style={styles.nutritionItem}>
                            <Text style={styles.nutritionValue}>{totalNutrition.fat}g</Text>
                            <Text style={styles.nutritionLabel}>Chất béo</Text>
                        </View>
                    </View> */}

                    {/* Cart Content */}
                    <ScrollView style={styles.cartContent} showsVerticalScrollIndicator={false}>
                        {Object.entries(cart).map(([mealType, meals]) => {
                            if (meals.length === 0) return null;
                            return (
                                <View key={mealType} style={styles.cartSection}>
                                    <Text style={styles.cartSectionTitle}>
                                        {mealTypeLabels[mealType]} ({meals.length})
                                    </Text>
                                    {meals.map((meal) => (
                                        <View key={meal.id} style={styles.cartMealItem}>
                                            <Image
                                                source={{ uri: meal.image }}
                                                style={styles.cartMealImage}
                                            />
                                            <View style={styles.cartMealInfo}>
                                                <Text style={styles.cartMealName}>{meal.name}</Text>
                                                <Text style={styles.cartMealNutrition}>
                                                    {meal.calories} kcal • {meal.protein}g protein
                                                </Text>
                                            </View>
                                            <TouchableOpacity
                                                onPress={() => onRemoveMeal(mealType, meal.id)}
                                                style={styles.removeButton}
                                            >
                                                <Ionicons name="trash-outline" size={20} color="#FF4444" />
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </View>
                            );
                        })}
                    </ScrollView>

                    {/* Modal Footer */}
                    <View style={styles.modalFooter}>
                        <TouchableOpacity
                            style={[
                                styles.confirmButton, 
                                (totalMeals === 0 || saveMealPlanLoading) && styles.confirmButtonDisabled
                            ]}
                            onPress={onConfirm}
                            disabled={totalMeals === 0 || saveMealPlanLoading}
                        >
                            {saveMealPlanLoading ? (
                                <>
                                    <ActivityIndicator size="small" color="#FFFFFF" />
                                    <Text style={styles.confirmButtonText}>Đang lưu...</Text>
                                </>
                            ) : (
                                <>
                                    <Text style={styles.confirmButtonText}>
                                        Ghi nhận thực đơn
                                    </Text>
                                    <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

// Meal Card Component - Update để có thể click vào
const MealCard = ({ meal, isSelected, onAddMeal, onViewDetail }) => {
    return (
        <TouchableOpacity 
            style={styles.mealCard}
            onPress={() => onViewDetail(meal.id)}
            activeOpacity={0.7}
        >
            <Image source={{ uri: meal.image }} style={styles.mealImage} />
            <View style={styles.mealInfo}>
                <Text style={styles.mealName} numberOfLines={2}>{meal.name}</Text>
                <Text style={styles.mealDescription} numberOfLines={1}>
                    {meal.description}
                </Text>
                <View style={styles.mealNutrition}>
                    <Text style={styles.nutritionText}>{meal.calories} kcal</Text>
                    <Text style={styles.nutritionSeparator}>•</Text>
                    <Text style={styles.nutritionText}>{meal.protein}g protein</Text>
                </View>
            </View>
            <TouchableOpacity
                style={[styles.addButton, isSelected && styles.addButtonDisabled]}
                onPress={(e) => {
                    e.stopPropagation(); // Ngăn event bubble lên parent
                    onAddMeal(meal);
                }}
                disabled={isSelected}
            >
                {isSelected ? (
                    <>
                        <Ionicons name="checkmark" size={16} color="#999" />
                        <Text style={styles.addButtonTextDisabled}>Đã chọn</Text>
                    </>
                ) : (
                    <Ionicons name="add" size={24} color="#35A55E" />
                )}
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

// Confirmation Modal Component
const ConfirmationModal = ({ visible, onClose, onConfirm, title, message, confirmText, cancelText, type = 'default' }) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.confirmModalOverlay}>
                <View style={styles.confirmModalContainer}>
                    <View style={styles.confirmModalIcon}>
                        <Ionicons
                            name={type === 'delete' ? 'trash-outline' : type === 'warning' ? 'alert-circle-outline' : 'information-circle-outline'}
                            size={48}
                            color={type === 'delete' ? '#FF4444' : type === 'warning' ? '#FF9800' : '#35A55E'}
                        />
                    </View>
                    <Text style={styles.confirmModalTitle}>{title}</Text>
                    <Text style={styles.confirmModalMessage}>{message}</Text>
                    <View style={styles.confirmModalButtons}>
                        <TouchableOpacity
                            style={styles.confirmModalCancelButton}
                            onPress={onClose}
                        >
                            <Text style={styles.confirmModalCancelText}>{cancelText || 'Hủy'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.confirmModalConfirmButton,
                                type === 'delete' && styles.confirmModalDeleteButton
                            ]}
                            onPress={onConfirm}
                        >
                            <Text style={styles.confirmModalConfirmText}>{confirmText || 'Xác nhận'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

// Category Modal Component
const CategoryModal = ({ visible, onClose, categories, selectedCategory, onSelectCategory }) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.categoryModalOverlay}>
                <View style={styles.categoryModalContainer}>
                    {/* Modal Header */}
                    <View style={styles.categoryModalHeader}>
                        <Text style={styles.categoryModalTitle}>Chọn danh mục món ăn</Text>
                        <TouchableOpacity onPress={onClose} style={styles.categoryModalCloseButton}>
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    {/* Category List */}
                    <ScrollView 
                        style={styles.categoryModalContent} 
                        contentContainerStyle={styles.categoryModalContentContainer}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Tất cả */}
                        <TouchableOpacity
                            style={[
                                styles.categoryModalItem,
                                selectedCategory === null && styles.categoryModalItemActive
                            ]}
                            onPress={() => {
                                onSelectCategory(null);
                                onClose();
                            }}
                        >
                            <Ionicons 
                                name="apps" 
                                size={24} 
                                color={selectedCategory === null ? '#35A55E' : '#666'} 
                            />
                            <Text style={[
                                styles.categoryModalItemText,
                                selectedCategory === null && styles.categoryModalItemTextActive
                            ]}>
                                Tất cả món ăn
                            </Text>
                            {selectedCategory === null && (
                                <Ionicons name="checkmark-circle" size={24} color="#35A55E" />
                            )}
                        </TouchableOpacity>

                        {/* Các danh mục */}
                        {Array.isArray(categories) && categories.length > 0 ? (
                            categories.map((category) => (
                                <TouchableOpacity
                                    key={category._id}
                                    style={[
                                        styles.categoryModalItem,
                                        selectedCategory === category._id && styles.categoryModalItemActive
                                    ]}
                                    onPress={() => {
                                        onSelectCategory(category._id);
                                        onClose();
                                    }}
                                >
                                    <Ionicons 
                                        name="restaurant" 
                                        size={24} 
                                        color={selectedCategory === category._id ? '#35A55E' : '#666'} 
                                    />
                                    <View style={styles.categoryModalItemInfo}>
                                        <Text style={[
                                            styles.categoryModalItemText,
                                            selectedCategory === category._id && styles.categoryModalItemTextActive
                                        ]}>
                                            {category.title}
                                        </Text>
                                        <Text style={styles.categoryModalItemSubtext}>
                                            {category.title_en}
                                        </Text>
                                    </View>
                                    {selectedCategory === category._id && (
                                        <Ionicons name="checkmark-circle" size={24} color="#35A55E" />
                                    )}
                                </TouchableOpacity>
                            ))
                        ) : (
                            <View style={styles.categoryModalEmpty}>
                                <Text style={styles.categoryModalEmptyText}>
                                    Không có danh mục nào
                                </Text>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default function PageSelectMeal() {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [showMealTypeSheet, setShowMealTypeSheet] = useState(false);
    const [showCartModal, setShowCartModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [isMealAcceptedSheetOpen, setIsMealAcceptedSheetOpen] = useState(false);
    const [confirmModal, setConfirmModal] = useState({
        visible: false,
        title: '',
        message: '',
        onConfirm: null,
        confirmText: '',
        cancelText: '',
        type: 'default'
    });
    const [cart, setCart] = useState({
        breakfast: [],
        lunch: [],
        dinner: []
    });

    // Redux selectors
    const { randomMeals = [], randomMealsLoading } = useSelector((state) => state.meal);
    const { mealCategoriesList = [], mealCategoriesLoading } = useSelector((state) => state.meal);
    const { mealsByCategory = [], mealsByCategoryLoading } = useSelector((state) => state.meal);
    const { saveMealPlanLoading, cacheMealPlanLoading } = useSelector((state) => state.mealPlan);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setIsLoading(true);
            // Load categories và meals song song
            await Promise.all([
                dispatch(getMealCategories({ page: 1, limit: 30 })).unwrap(),
                dispatch(getRandomMeals({ page: 1, limit: 100 })).unwrap()
            ]);
        } catch (error) {
            console.error('Error loading data:', error);
            if (Platform.OS === 'android') {
                ToastAndroid.show('Không thể tải dữ liệu', ToastAndroid.SHORT);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Xử lý khi chọn category
    const handleSelectCategory = async (categoryId) => {
        setSelectedCategory(categoryId);
        
        if (categoryId === null) {
            // Chọn "Tất cả" - load random meals
            try {
                await dispatch(getRandomMeals({ page: 1, limit: 100 })).unwrap();
            } catch (error) {
                console.error('Error loading random meals:', error);
                if (Platform.OS === 'android') {
                    ToastAndroid.show('Không thể tải món ăn', ToastAndroid.SHORT);
                }
            }
        } else {
            // Load meals theo category được chọn
            try {
                await dispatch(getMealsByCategory({ categoryId, page: 1, limit: 100 })).unwrap();
            } catch (error) {
                console.error('Error loading meals by category:', error);
                if (Platform.OS === 'android') {
                    ToastAndroid.show('Không thể tải món ăn theo danh mục', ToastAndroid.SHORT);
                }
            }
        }
    };

    // Filter meals theo category - thêm safety check
    const filteredMeals = selectedCategory
        ? (randomMeals || []).filter(meal => meal.category_id === selectedCategory)
        : (randomMeals || []);

    const handleAddMeal = (meal) => {
        setSelectedMeal(meal);
        setShowMealTypeSheet(true);
    };

    const handleSelectMealType = (mealType) => {
        if (selectedMeal) {
            setCart(prevCart => ({
                ...prevCart,
                [mealType]: [...prevCart[mealType], selectedMeal]
            }));

            setShowMealTypeSheet(false);
            setSelectedMeal(null);

            if (Platform.OS === 'android') {
                ToastAndroid.show(`Đã thêm "${selectedMeal.name}" vào thực đơn`, ToastAndroid.SHORT);
            }
        }
    };

    const handleRemoveMeal = (mealType, mealId) => {
        const meal = cart[mealType].find(m => m.id === mealId);
        setConfirmModal({
            visible: true,
            title: 'Xác nhận xóa',
            message: `Bạn có chắc muốn xóa "${meal?.name}" khỏi thực đơn?`,
            type: 'delete',
            confirmText: 'Xóa',
            cancelText: 'Hủy',
            onConfirm: () => {
                setCart(prevCart => ({
                    ...prevCart,
                    [mealType]: prevCart[mealType].filter(m => m.id !== mealId)
                }));

                if (Platform.OS === 'android') {
                    ToastAndroid.show('Đã xóa món khỏi thực đơn', ToastAndroid.SHORT);
                }

                setConfirmModal({ ...confirmModal, visible: false });
            }
        });
    };

    // Helper function để format date đúng
    const formatDateString = (date = new Date()) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleConfirmMealPlan = async () => {
        const totalMeals = Object.values(cart).reduce((sum, meals) => sum + meals.length, 0);

        if (totalMeals === 0) {
            setConfirmModal({
                visible: false,
                title: 'Thông báo',
                message: 'Vui lòng chọn ít nhất 1 món ăn',
                type: 'warning',
                confirmText: 'OK',
                cancelText: '',
                onConfirm: () => {
                    setConfirmModal({ ...confirmModal, visible: false });
                }
            });
            return;
        }

        setConfirmModal({
            visible: true,
            title: 'Xác nhận tạo thực đơn',
            message: `Bạn đã chọn ${totalMeals} món. Xác nhận tạo thực đơn?`,
            type: 'default',
            confirmText: 'Xác nhận',
            cancelText: 'Hủy',
            onConfirm: async () => {
                setConfirmModal({ ...confirmModal, visible: false });
                setShowCartModal(false);
                
                // Gọi handleAcceptMenu để save meal plan
                await handleAcceptMenu();
            }
        });
    };

    // Hàm save meal plan - Cache trước, sau đó save
    const handleAcceptMenu = async () => {
        console.log('Accept menu - Caching and Saving meal plan...');
        
        try {
            // Format date to YYYY-MM-DD
            const today = new Date();
            const dateString = formatDateString(today);
            
            console.log('Save meal plan - Date string:', dateString);
            console.log('Cart data:', cart);
            
            // Transform cart data thành format mealPlan
            const mealPlan = transformCartToMealPlan(cart);
            console.log('Transformed meal plan:', mealPlan);
            
            // Step 1: Cache meal plan trước
            console.log('Step 1: Caching meal plan...');
            await dispatch(cacheMealPlan({ 
                date: dateString, 
                mealPlan: mealPlan 
            })).unwrap();
            console.log('✓ Meal plan cached successfully');
            
            // Step 2: Save meal plan vào database
            console.log('Step 2: Saving meal plan to database...');
            await dispatch(saveMealPlan(dateString)).unwrap();
            console.log('✓ Meal plan saved successfully');
            
            // Show success sheet
            setIsMealAcceptedSheetOpen(true);
            
            if (Platform.OS === 'android') {
                ToastAndroid.show('Đã tạo thực đơn thành công!', ToastAndroid.LONG);
            }
            
        } catch (error) {
            console.error('Error in handleAcceptMenu:', error);
            if (Platform.OS === 'android') {
                ToastAndroid.show('Không thể lưu thực đơn: ' + error, ToastAndroid.LONG);
            } else {
                Alert.alert('Lỗi', 'Không thể lưu thực đơn: ' + error);
            }
        }
    };

    // Helper function để transform cart sang format mealPlan
    const transformCartToMealPlan = (cart) => {
        const mealPlan = [];
        
        // Transform breakfast
        if (cart.breakfast && cart.breakfast.length > 0) {
            mealPlan.push({
                servingTime: 'breakfast',
                meals: cart.breakfast.map(meal => ({
                    meal_id: meal.id,
                    portionSize: {
                        amount: 1,
                        unit: 'portion'
                    }
                }))
            });
        }
        
        // Transform lunch
        if (cart.lunch && cart.lunch.length > 0) {
            mealPlan.push({
                servingTime: 'lunch',
                meals: cart.lunch.map(meal => ({
                    meal_id: meal.id,
                    portionSize: {
                        amount: 1,
                        unit: 'portion'
                    }
                }))
            });
        }
        
        // Transform dinner
        if (cart.dinner && cart.dinner.length > 0) {
            mealPlan.push({
                servingTime: 'dinner',
                meals: cart.dinner.map(meal => ({
                    meal_id: meal.id,
                    portionSize: {
                        amount: 1,
                        unit: 'portion'
                    }
                }))
            });
        }
        
        return mealPlan;
    };

    // Đóng MealAcceptedSheet và quay về Home
    const handleCloseAcceptedSheet = () => {
        setIsMealAcceptedSheetOpen(false);
        
        // Tạo acceptedMeals từ cart
        const acceptedMeals = {
            breakfast: cart.breakfast || [],
            lunch: cart.lunch || [],
            dinner: cart.dinner || [],
        };
        
        router.back();
        
        setTimeout(() => {
            router.replace({
                pathname: '/(tabs)/',
                params: { 
                    acceptedMeals: JSON.stringify(acceptedMeals),
                    showAISection: 'false'
                }
            });
        }, 100);
    };

    // Xử lý khi ấn nút "Đi chợ"
    const handleGoShopping = () => {
        setIsMealAcceptedSheetOpen(false);
        
        // Truyền dữ liệu menu về HomeScreen trước để lưu trạng thái
        const acceptedMeals = {
            breakfast: cart.breakfast,
            lunch: cart.lunch,
            dinner: cart.dinner,
        };
        
        // Quay về HomeScreen trước (xóa stack PageSelectMeal)
        router.back();
        
        // Delay để đảm bảo đã quay về HomeScreen
        setTimeout(() => {
            // Replace HomeScreen với dữ liệu mới
            router.replace({
                pathname: '/(tabs)/',
                params: { 
                    acceptedMeals: JSON.stringify(acceptedMeals),
                    showAISection: 'false'
                }
            });
            
            // Sau đó push sang tab shopping
            setTimeout(() => {
                router.push('/(tabs)/shopping');
            }, 100);
        }, 100);
    };

    const isMealSelected = (mealId) => {
        return Object.values(cart).some(meals =>
            meals.some(meal => meal.id === mealId)
        );
    };

    const getTotalMealsInCart = () => {
        return Object.values(cart).reduce((sum, meals) => sum + meals.length, 0);
    };

    const handleGoBack = () => {
        const totalMeals = getTotalMealsInCart();
        if (totalMeals > 0) {
            setConfirmModal({
                visible: true,
                title: 'Xác nhận thoát',
                message: 'Bạn có thực đơn chưa lưu. Bạn có chắc muốn thoát?',
                type: 'warning',
                confirmText: 'Thoát',
                cancelText: 'Ở lại',
                onConfirm: () => {
                    setConfirmModal({ ...confirmModal, visible: false });
                    router.back();
                }
            });
        } else {
            router.back();
        }
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <HeaderComponent>
                    <HeaderLeft onGoBack={handleGoBack} title="Quay lại" />
                    <View style={styles.headerCenter}>
                        <Text style={styles.headerTitle}>Chọn món ăn</Text>
                    </View>
                </HeaderComponent>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#35A55E" />
                    <Text style={styles.loadingText}>Đang tải món ăn...</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Meals để hiển thị - lấy từ category hoặc random
    const displayMeals = selectedCategory === null ? randomMeals : mealsByCategory;
    const isLoadingMeals = selectedCategory === null ? randomMealsLoading : mealsByCategoryLoading;

    // Lấy tên category đang chọn
    const getSelectedCategoryName = () => {
        if (selectedCategory === null) return 'Tất cả món ăn';
        const category = mealCategoriesList.find(c => c._id === selectedCategory);
        return category ? category.title : 'Danh mục';
    };

    // Thêm function navigate sang MealDetail
    const handleViewMealDetail = (mealId) => {
        router.push({
            pathname: '/(stacks)/meals/MealDetail',
            params: { id: mealId }
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <HeaderComponent>
                <HeaderLeft onGoBack={handleGoBack} title="Quay lại" />
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>Chọn món ăn</Text>
                </View>
            </HeaderComponent>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.infoCard}>
                    <Ionicons name="information-circle" size={24} color="#35A55E" />
                    <Text style={styles.infoText}>
                        Chọn các món ăn và phân loại vào bữa sáng, trưa hoặc tối
                    </Text>
                </View>

                {/* Category Filter Button */}
                <TouchableOpacity 
                    style={styles.categoryFilterButton}
                    onPress={() => setShowCategoryModal(true)}
                >
                    <View style={styles.categoryFilterLeft}>
                        <Ionicons name="filter" size={20} color="#35A55E" />
                        <Text style={styles.categoryFilterText}>{getSelectedCategoryName()}</Text>
                    </View>
                    <Ionicons name="chevron-down" size={20} color="#35A55E" />
                </TouchableOpacity>

                {/* Meals Grid */}
                {isLoadingMeals ? (
                    <View style={styles.loadingMealsContainer}>
                        <ActivityIndicator size="large" color="#35A55E" />
                        <Text style={styles.loadingText}>Đang tải món ăn...</Text>
                    </View>
                ) : displayMeals.length > 0 ? (
                    <View style={styles.mealsGrid}>
                        {displayMeals.map((meal) => (
                            <MealCard
                                key={meal._id}
                                meal={{
                                    ...meal,
                                    id: meal._id,
                                    name: meal.nameMeal,
                                    description: meal.description || 'Món ăn ngon',
                                    image: meal.image || require('../../../assets/images/food1.png'),
                                    calories: meal.total_energy || 0,
                                    protein: meal.nutritional_components?.find(n => n.nameEn === 'Protein')?.amount || 0,
                                    carbs: meal.nutritional_components?.find(n => n.nameEn === 'Carbohydrate')?.amount || 0,
                                    fat: meal.nutritional_components?.find(n => n.nameEn === 'Lipid')?.amount || 0
                                }}
                                isSelected={isMealSelected(meal._id)}
                                onAddMeal={handleAddMeal}
                                onViewDetail={handleViewMealDetail}
                            />
                        ))}
                    </View>
                ) : (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="restaurant-outline" size={64} color="#CCCCCC" />
                        <Text style={styles.emptyText}>
                            Không có món ăn nào trong danh mục này
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Floating Cart Button */}
            {getTotalMealsInCart() > 0 && (
                <TouchableOpacity
                    style={styles.floatingCartButton}
                    onPress={() => setShowCartModal(true)}
                >
                    <Ionicons name="list" size={24} color="#FFFFFF" />
                    <View style={styles.cartBadge}>
                        <Text style={styles.cartBadgeText}>{getTotalMealsInCart()}</Text>
                    </View>
                </TouchableOpacity>
            )}

            {/* Meal Type Sheet */}
            <MealTypeSheet
                isOpen={showMealTypeSheet}
                onClose={() => {
                    setShowMealTypeSheet(false);
                    setSelectedMeal(null);
                }}
                onSelectMealType={handleSelectMealType}
            />

            {/* Cart Modal */}
            <CartModal
                visible={showCartModal}
                onClose={() => setShowCartModal(false)}
                cart={cart}
                onRemoveMeal={handleRemoveMeal}
                onConfirm={handleConfirmMealPlan}
                saveMealPlanLoading={saveMealPlanLoading || cacheMealPlanLoading}
            />

            {/* Confirmation Modal */}
            <ConfirmationModal
                visible={confirmModal.visible}
                title={confirmModal.title}
                message={confirmModal.message}
                type={confirmModal.type}
                confirmText={confirmModal.confirmText}
                cancelText={confirmModal.cancelText}
                onClose={() => setConfirmModal({ ...confirmModal, visible: false })}
                onConfirm={confirmModal.onConfirm}
            />

            {/* Category Modal */}
            <CategoryModal
                visible={showCategoryModal}
                onClose={() => setShowCategoryModal(false)}
                categories={mealCategoriesList}
                selectedCategory={selectedCategory}
                onSelectCategory={handleSelectCategory}
            />

            {/* Meal Accepted Sheet */}
            <MealAcceptedSheet
                isOpen={isMealAcceptedSheetOpen}
                onClose={handleCloseAcceptedSheet}
                onGoShopping={handleGoShopping}
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
        alignItems: 'flex-end',
    },
    headerTitle: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 17,
    },
    content: {
        flex: 1,
        paddingTop: 80,
    },
    contentContainer: {
        padding: 16,
        paddingBottom: 100,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        color: '#666',
        fontSize: 14,
    },
    infoCard: {
        flexDirection: 'row',
        backgroundColor: '#E8F5E8',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        alignItems: 'center',
    },
    infoText: {
        flex: 1,
        marginLeft: 12,
        fontSize: 14,
        color: '#35A55E',
        lineHeight: 20,
    },
    mealsGrid: {
        gap: 12,
    },
    mealCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    mealImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    mealInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },
    mealName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2C3E50',
    },
    mealDescription: {
        fontSize: 13,
        color: '#666',
        marginTop: 4,
    },
    mealNutrition: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    nutritionText: {
        fontSize: 12,
        color: '#999',
    },
    nutritionSeparator: {
        marginHorizontal: 6,
        color: '#999',
    },
    addButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#E8F5E8',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    addButtonDisabled: {
        backgroundColor: '#F5F5F5',
        flexDirection: 'row',
        width: 'auto',
        paddingHorizontal: 12,
        gap: 4,
    },
    addButtonTextDisabled: {
        fontSize: 12,
        color: '#999',
        fontWeight: '500',
    },
    floatingCartButton: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#35A55E',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    cartBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#FF4444',
        borderRadius: 12,
        minWidth: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    cartBadgeText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
    },
    // Sheet Styles
    sheetContent: {
        padding: 20,
    },
    sheetTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2C3E50',
        marginBottom: 20,
    },
    mealTypeOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        marginBottom: 12,
    },
    mealTypeIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    mealTypeLabel: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: '#2C3E50',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: '90%', // Thay đổi từ maxHeight thành height
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2C3E50',
    },
    closeButton: {
        padding: 4,
    },
    nutritionSummary: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 16,
        backgroundColor: '#F8F9FA',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    nutritionItem: {
        alignItems: 'center',
    },
    nutritionValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#35A55E',
    },
    nutritionLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    cartContent: {
        flex: 1,
        padding: 16,
    },
    cartSection: {
        marginBottom: 24,
    },
    cartSectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2C3E50',
        marginBottom: 12,
    },
    cartMealItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
    },
    cartMealImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
    },
    cartMealInfo: {
        flex: 1,
        marginLeft: 12,
    },
    cartMealName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2C3E50',
    },
    cartMealNutrition: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    removeButton: {
        padding: 8,
    },
    modalFooter: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    confirmButton: {
        backgroundColor: '#35A55E',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    confirmButtonDisabled: {
        backgroundColor: '#CCCCCC',
    },
    confirmButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    // Confirmation Modal Styles (z-index cao hơn cart modal)
    confirmModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    confirmModalContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        width: '85%',
        maxWidth: 400,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 12,
    },
    confirmModalIcon: {
        marginBottom: 16,
    },
    confirmModalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 12,
        textAlign: 'center',
    },
    confirmModalMessage: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
    },
    confirmModalButtons: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
    },
    confirmModalCancelButton: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 14,
        alignItems: 'center',
    },
    confirmModalCancelText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },
    confirmModalConfirmButton: {
        flex: 1,
        backgroundColor: '#35A55E',
        borderRadius: 12,
        padding: 14,
        alignItems: 'center',
    },
    confirmModalDeleteButton: {
        backgroundColor: '#FF4444',
    },
    confirmModalConfirmText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    // Category Section Styles
    categorySection: {
        marginBottom: 16,
    },
    categorySectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2C3E50',
        marginBottom: 12,
    },
    categoryList: {
        paddingRight: 16,
        gap: 8,
    },
    categoryChip: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginRight: 8,
    },
    categoryChipActive: {
        backgroundColor: '#35A55E',
        borderColor: '#35A55E',
    },
    categoryChipText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
    },
    categoryChipTextActive: {
        color: '#FFFFFF',
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
    // Category Filter Button
    categoryFilterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    categoryFilterLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    categoryFilterText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2C3E50',
    },
    // Category Modal Styles
    categoryModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    categoryModalContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '80%',
        height: '80%', // Thêm height cố định
    },
    categoryModalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    categoryModalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2C3E50',
    },
    categoryModalCloseButton: {
        padding: 4,
    },
    categoryModalContent: {
        flex: 1, // Thêm flex: 1
    },
    categoryModalContentContainer: {
        padding: 16,
        paddingBottom: 40, // Thêm padding bottom
    },
    categoryModalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        marginBottom: 12,
        gap: 12,
    },
    categoryModalItemActive: {
        backgroundColor: '#E8F5E8',
        borderWidth: 1,
        borderColor: '#35A55E',
    },
    categoryModalItemInfo: {
        flex: 1,
    },
    categoryModalItemText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#2C3E50',
    },
    categoryModalItemTextActive: {
        color: '#35A55E',
        fontWeight: '600',
    },
    categoryModalItemSubtext: {
        fontSize: 13,
        color: '#999',
        marginTop: 2,
    },
    categoryModalEmpty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    categoryModalEmptyText: {
        fontSize: 14,
        color: '#999',
    },
});
