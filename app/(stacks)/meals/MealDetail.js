import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Animated,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { getMealDetail } from '../../../redux/thunk/mealThunk';
import { clearMealDetail } from '../../../redux/slice/mealSlice';
import { batchGetIngredientDetails, getMeasurementUnits } from '../../../redux/thunk/ingredientThunk';
import { getRecipeDetail } from '../../../redux/thunk/recipeThunk';
import { styles } from '../../../styles/meals/mealDetail';

// Skeleton Loading Components
const SkeletonBox = ({ width, height, style }) => {
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
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
        ).start();
    }, []);

    return (
        <View style={[{ width, height, backgroundColor: '#E0E0E0', borderRadius: 8, overflow: 'hidden' }, style]}>
            <Animated.View
                style={[
                    StyleSheet.absoluteFill,
                    {
                        backgroundColor: '#F5F5F5',
                        opacity: shimmerAnim,
                    },
                ]}
            />
        </View>
    );
};

export default function MealDetail() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const dispatch = useDispatch();
    
    const [activeTab, setActiveTab] = useState('ingredient');
    const indicatorAnim = useRef(new Animated.Value(0)).current;

    // Redux selectors - thêm recipe state
    const { mealDetail, mealDetailLoading, mealDetailError } = useSelector((state) => state.meal);
    const { ingredientDetails, measurementUnits, ingredientDetailLoading } = useSelector((state) => state.ingredient);
    const { recipeDetail, recipeDetailLoading } = useSelector((state) => state.recipe);

    // Load meal detail khi component mount
    useEffect(() => {
        if (params.id) {
            console.log('Loading meal detail for ID:', params.id);
            dispatch(getMealDetail(params.id));
        }

        return () => {
            dispatch(clearMealDetail());
        };
    }, [params.id, dispatch]);

    // Load ingredient details và measurement units khi có mealDetail
    useEffect(() => {
        const loadIngredientDetails = async () => {
            if (mealDetail && mealDetail.ingredients && mealDetail.ingredients.length > 0) {
                console.log('Loading ingredient details for meal:', mealDetail.nameMeal);
                
                // Lấy danh sách ingredient IDs từ meal
                const ingredientIds = mealDetail.ingredients
                    .map(ing => ing.ingredient_id?._id || ing.ingredient_id)
                    .filter(Boolean);
                
                console.log('Ingredient IDs to load:', ingredientIds);
                
                // Load measurement units nếu chưa có
                if (measurementUnits.length === 0) {
                    dispatch(getMeasurementUnits());
                }
                
                // Load ingredient details
                if (ingredientIds.length > 0) {
                    try {
                        await dispatch(batchGetIngredientDetails(ingredientIds)).unwrap();
                        console.log('Ingredient details loaded successfully');
                    } catch (error) {
                        console.error('Error loading ingredient details:', error);
                    }
                }
            }
        };
        
        loadIngredientDetails();
    }, [mealDetail, dispatch]);

    // Load recipe detail khi có mealDetail
    useEffect(() => {
        const loadRecipeDetail = async () => {
            if (mealDetail && mealDetail.recipe && mealDetail.recipe.recipe_id) {
                console.log('Loading recipe detail for recipe ID:', mealDetail.recipe.recipe_id);
                
                try {
                    await dispatch(getRecipeDetail(mealDetail.recipe.recipe_id)).unwrap();
                    console.log('Recipe detail loaded successfully');
                } catch (error) {
                    console.error('Error loading recipe detail:', error);
                }
            }
        };
        
        loadRecipeDetail();
    }, [mealDetail, dispatch]);

    // Xử lý chuyển tab với animation
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        
        Animated.spring(indicatorAnim, {
            toValue: tab === 'ingredient' ? 0 : 1,
            useNativeDriver: false,
            tension: 60,
            friction: 12,
        }).start();
    };

    // Skeleton Loading UI
    if (mealDetailLoading) {
        return (
            <View style={styles.container}>
                {/* Skeleton Image */}
                <View style={styles.imageContainer}>
                    <SkeletonBox width="100%" height={260} style={{ borderRadius: 0 }} />
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={26} color="#fff" />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content}>
                    {/* Skeleton Type Meal */}
                    <SkeletonBox width={100} height={30} style={{ marginBottom: 15 }} />
                    
                    {/* Skeleton Meal Name */}
                    <SkeletonBox width="80%" height={28} style={{ marginBottom: 10 }} />
                    
                    {/* Skeleton Time */}
                    <View style={styles.timeContainer}>
                        <SkeletonBox width={100} height={20} />
                        <SkeletonBox width={100} height={20} style={{ marginLeft: 20 }} />
                    </View>
                    
                    {/* Skeleton Nutrition */}
                    <View style={styles.nutritionContainer}>
                        {[1, 2, 3, 4].map((_, index) => (
                            <View key={index} style={[styles.nutritionItem, index === 0 && { borderLeftWidth: 0 }]}>
                                <SkeletonBox width={50} height={20} style={{ marginBottom: 4 }} />
                                <SkeletonBox width={60} height={16} />
                            </View>
                        ))}
                    </View>
                    
                    {/* Skeleton Tabs */}
                    <SkeletonBox width="100%" height={40} style={{ marginVertical: 15, marginHorizontal: 40 }} />
                    
                    {/* Skeleton Content */}
                    <View style={{ paddingBottom: 20 }}>
                        {[1, 2, 3].map((_, index) => (
                            <SkeletonBox key={index} width="100%" height={60} style={{ marginBottom: 10 }} />
                        ))}
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Error state
    if (mealDetailError) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <TouchableOpacity style={[styles.backButton, { top: 60, left: 20 }]} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={26} color="#333" />
                </TouchableOpacity>
                <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
                <Text style={{ marginTop: 16, fontSize: 16, color: '#666' }}>
                    {mealDetailError}
                </Text>
                <TouchableOpacity 
                    style={{ marginTop: 20, backgroundColor: '#35A55E', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 }}
                    onPress={() => dispatch(getMealDetail(params.id))}
                >
                    <Text style={{ color: '#fff', fontWeight: '600' }}>Thử lại</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // No data
    if (!mealDetail) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <TouchableOpacity style={[styles.backButton, { top: 60, left: 20 }]} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={26} color="#333" />
                </TouchableOpacity>
                <Text style={{ fontSize: 16, color: '#666' }}>Không tìm thấy thông tin món ăn</Text>
            </View>
        );
    }

    // Extract data từ API response - fix steps extraction
    const recipe = mealDetail.recipeDetail || {};
    const recipeNutrition = recipe.nutrition || {};
    
    // Transform ingredients với data từ ingredientDetails
    const ingredients = mealDetail.ingredientDetails || mealDetail.ingredients?.map(ing => {
        const ingredientId = ing.ingredient_id?._id || ing.ingredient_id;
        const ingredientDetail = ingredientDetails[ingredientId];
        
        // Tìm measurement unit name
        const unitData = measurementUnits.find(u => u.key === ing.unit_id);
        
        return {
            ingredientId: ingredientId,
            nameIngredient: ingredientDetail?.nameIngredient || ing.ingredient_id?.nameIngredient || 'Đang tải...',
            ingredientImage: ingredientDetail?.ingredientImage || ing.ingredient_id?.ingredientImage,
            quantity: ing.quantity || 0,
            unit: unitData?.label || ing.unit_id?.unitName || 'g',
            category: ingredientDetail?.ingredientCategory?.title,
            nutrition: ingredientDetail?.nutrition,
        };
    }) || [];
    
    // Tính tổng dinh dưỡng từ ingredients
    const calculateNutritionFromIngredients = () => {
        let totalNutrition = {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0
        };

        ingredients.forEach(ingredient => {
            if (ingredient.nutrition) {
                // Giả sử nutrition trong ingredient là per 100g
                // Cần tính toán dựa trên quantity thực tế
                const multiplier = ingredient.quantity / 100;
                
                totalNutrition.calories += (ingredient.nutrition.calories || 0) * multiplier;
                totalNutrition.protein += (ingredient.nutrition.protein || 0) * multiplier;
                totalNutrition.carbs += (ingredient.nutrition.carbs || 0) * multiplier;
                totalNutrition.fat += (ingredient.nutrition.fat || 0) * multiplier;
            }
        });

        return totalNutrition;
    };

    // Tính dinh dưỡng hiển thị với adjustment từ recipe
    const getAdjustedNutrition = () => {
        // Tính tổng từ ingredients
        const ingredientTotal = calculateNutritionFromIngredients();

        // Lấy giá trị từ recipe nutrition (đây là % adjustment)
        const adjustments = {
            calories: recipeNutrition.calories || 100,
            protein: recipeNutrition.protein || 100,
            carbs: recipeNutrition.carbs || 100,
            fat: recipeNutrition.fat || 100
        };

        // Apply adjustments (nếu 105 thì tăng 5%, nếu 95 thì giảm 5%)
        return {
            calories: Math.round(ingredientTotal.calories * (adjustments.calories / 100)),
            protein: Math.round(ingredientTotal.protein * (adjustments.protein / 100)),
            carbs: Math.round(ingredientTotal.carbs * (adjustments.carbs / 100)),
            fat: Math.round(ingredientTotal.fat * (adjustments.fat / 100))
        };
    };

    // Sử dụng adjusted nutrition
    const nutrition = getAdjustedNutrition();
    
    // Lấy steps từ recipeDetail
    let steps = [];
    if (recipeDetail && recipeDetail.steps && Array.isArray(recipeDetail.steps)) {
        steps = recipeDetail.steps
            .sort((a, b) => a.stepNumber - b.stepNumber)
            .map(step => step.description);
    } else if (recipe.instructions && Array.isArray(recipe.instructions)) {
        steps = recipe.instructions;
    }

    return (
        <View style={styles.container}>
            {/* Ảnh Header */}
            <View style={styles.imageContainer}>
                <Image 
                    source={mealDetail.mealImage ? { uri: mealDetail.mealImage } : require('../../../assets/images/food1.png')} 
                    style={styles.image} 
                />
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={26} color="#fff" />
                </TouchableOpacity>
                  <View style={styles.typeMealContainer}>
                    <Text style={styles.typeMealText}>{mealDetail.mealCategory?.title || 'danh mục'}</Text>
                </View>
            </View>

            {/* Nội dung */}
            <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 20 }}>

              

                <Text style={styles.mealName}>{mealDetail.nameMeal}</Text>

                {/* Thông tin thời gian */}
                <View style={styles.timeContainer}>
                    <View style={styles.timeItem}>
                        <Ionicons name="time-outline" size={16} color="#666" />
                        <Text style={styles.timeValue}>{recipe.prepTime || '15'} phút</Text>
                    </View>

                    <View style={styles.timeItem}>
                        <Ionicons name="flame-outline" size={16} color="#666" />
                        <Text style={styles.timeValue}>{recipe.cookTime || '30'} phút</Text>
                    </View>
                </View>

                {/* Thông tin dinh dưỡng - Sử dụng nutrition đã tính toán */}
                <View style={styles.nutritionContainer}>
                    {[
                        {value: `${nutrition.calories}kcal`, label: 'Calories', color: '#8ea846' },
                        { value: `${nutrition.protein}g`, label: 'Protein', color: '#35A55E' },
                        { value: `${nutrition.carbs}g`, label: 'Carbs', color: '#FF9500' },
                        { value: `${nutrition.fat}g`, label: 'Fat', color: '#FF6B6B' },
                    ].map((item, index) => (
                        <View key={index} style={[styles.nutritionItem, index === 0 && { borderLeftWidth: 0 }]}>
                            <Text style={[styles.nutritionValue, { color: item.color }]}>{item.value}</Text>
                            <Text style={styles.nutritionLabel}>{item.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Tab chuyển đổi */}
                <View style={styles.tabContainer}>
                    <View style={styles.tabBackground}>
                        <TouchableOpacity
                            style={styles.tabButton}
                            onPress={() => handleTabChange('ingredient')}
                        >
                            <Text style={[styles.tabText, activeTab === 'ingredient' && styles.activeTabText]}>
                                Nguyên liệu
                            </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={styles.tabButton}
                            onPress={() => handleTabChange('guide')}
                        >
                            <Text style={[styles.tabText, activeTab === 'guide' && styles.activeTabText]}>
                                Hướng dẫn
                            </Text>
                        </TouchableOpacity>
                        
                        <Animated.View
                            style={[
                                styles.tabIndicator,
                                {
                                    left: indicatorAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['2%', '52%'],
                                    }),
                                }
                            ]}
                        />
                    </View>
                </View>

                {/* Nội dung Tab */}
                <View style={styles.tabContentContainer}>
                    {activeTab === 'ingredient' ? (
                        <View style={styles.ingredientList}>
                            {ingredientDetailLoading ? (
                                <View style={{ paddingVertical: 20 }}>
                                    <ActivityIndicator size="small" color="#35A55E" />
                                    <Text style={{ textAlign: 'center', color: '#999', marginTop: 8 }}>
                                        Đang tải thông tin nguyên liệu...
                                    </Text>
                                </View>
                            ) : ingredients.length > 0 ? (
                                ingredients.map((ingredient, index) => (
                                    <View key={index} style={styles.ingredientItem}>
                                        <Image 
                                            source={
                                                ingredient.ingredientImage 
                                                    ? { uri: ingredient.ingredientImage } 
                                                    : { uri: 'https://cdn-icons-png.flaticon.com/512/1046/1046769.png' }
                                            } 
                                            style={styles.ingredientIcon} 
                                        />
                                        <Text style={styles.nameIngredient}>{ingredient.nameIngredient}</Text>
                                        <Text style={styles.ingredientAmount}>
                                            {ingredient.quantity} {ingredient.unit}
                                        </Text>
                                    </View>
                                ))
                            ) : (
                                <Text style={{ textAlign: 'center', color: '#999', paddingVertical: 20 }}>
                                    Chưa có thông tin nguyên liệu
                                </Text>
                            )}
                        </View>
                    ) : (
                        <View style={styles.guideContainer}>
                            {recipeDetailLoading ? (
                                <View style={{ paddingVertical: 20 }}>
                                    <ActivityIndicator size="small" color="#35A55E" />
                                    <Text style={{ textAlign: 'center', color: '#999', marginTop: 8 }}>
                                        Đang tải hướng dẫn...
                                    </Text>
                                </View>
                            ) : steps.length > 0 ? (
                                steps.map((step, index) => (
                                    <Text key={index} style={styles.stepText}>
                                        Bước {index + 1}. {step}
                                    </Text>
                                ))) : (
                                <Text style={{ textAlign: 'center', color: '#999', paddingVertical: 20 }}>
                                    Chưa có hướng dẫn nấu
                                </Text>
                            )}
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
