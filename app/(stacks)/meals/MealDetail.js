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
    Modal,
    Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { getMealDetail } from '../../../redux/thunk/mealThunk';
import { clearMealDetail } from '../../../redux/slice/mealSlice';
import { batchGetIngredientDetails, getMeasurementUnits } from '../../../redux/thunk/ingredientThunk';
import { getRecipeDetail } from '../../../redux/thunk/recipeThunk';
import { getMealCategory } from '../../../redux/thunk/mealThunk';
import { styles } from '../../../styles/meals/mealDetail';
import { WebView } from 'react-native-webview';

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
    const [isWebViewModalVisible, setIsWebViewModalVisible] = useState(false);
    const webViewRef = useRef(null);
    const indicatorAnim = useRef(new Animated.Value(0)).current;

    // Redux selectors - thêm mealCategories
    const { mealDetail, mealDetailLoading, mealDetailError, mealCategories } = useSelector((state) => state.meal);
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

    // Load meal category khi có mealDetail
    useEffect(() => {
        const loadMealCategory = async () => {
            if (mealDetail && mealDetail.category_id) {
                console.log('Loading meal category for ID:', mealDetail.category_id);
                
                try {
                    await dispatch(getMealCategory(mealDetail.category_id)).unwrap();
                    console.log('Meal category loaded successfully');
                } catch (error) {
                    console.error('Error loading meal category:', error);
                }
            }
        };
        
        loadMealCategory();
    }, [mealDetail, dispatch]);

    console.log("mealDetail ", mealDetail)

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

    // JavaScript code để inject vào WebView
    const getInjectedJavaScript = (mealName) => {
        return `
            (function() {
                // Đợi trang load xong
                function waitForElement(selector, callback) {
                    const checkExist = setInterval(function() {
                        const element = document.evaluate(selector, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                        if (element) {
                            clearInterval(checkExist);
                            callback(element);
                        }
                    }, 100);
                    
                    // Timeout sau 10 giây
                    setTimeout(() => clearInterval(checkExist), 10000);
                }
                
                // Đợi input và button xuất hiện
                setTimeout(() => {
                    // Tìm input field bằng XPath
                    const searchInput = document.evaluate('//*[@id="search-input"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    
                    if (searchInput) {
                        // Điền giá trị
                        searchInput.value = "${mealName}";
                        
                        // Trigger input event
                        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                        searchInput.dispatchEvent(new Event('change', { bubbles: true }));
                        
                        // Đợi một chút rồi click button search
                        setTimeout(() => {
                            const searchButton = document.evaluate('//*[@id="search-form"]/div/div[4]/div/button[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                            
                            if (searchButton) {
                                searchButton.click();
                            }
                        }, 500);
                    }
                }, 2000);
                
                true;
            })();
        `;
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

    // Extract data từ API response
    const recipe = mealDetail.recipeDetail || {};
    
    // Lấy meal category từ Redux store
    const mealCategory = mealCategories[mealDetail.category_id];
    const categoryTitle = mealCategory?.title || 'Danh mục';
    
    // Lấy nutrition từ nutritional_components
    const nutritionalComponents = mealDetail.nutritional_components || [];
    
    // Transform ingredients với data từ ingredientDetails
    const ingredients = mealDetail.ingredientDetails || mealDetail.ingredients?.map(ing => {
        const ingredientId = ing.ingredient_id;
        const ingredientDetail = ingredientDetails[ingredientId];
        
        // Tìm measurement unit name
        const unitData = measurementUnits.find(u => u.key === ing.unit);
        
        return {
            ingredientId: ingredientId,
            nameIngredient: ingredientDetail?.nameIngredient || ing.detail?.nameIngredient || 'Đang tải...',
            ingredientImage: ingredientDetail?.ingredientImage || ing.detail?.image,
            quantity: ing.quantity || 0,
            unit: unitData?.label || ing.unit || 'g',
            category: ingredientDetail?.ingredientCategory?.title,
            nutrition: ingredientDetail?.nutrition,
        };
    }) || [];
    
    // Lấy steps từ mealDetail.steps
    const steps = mealDetail.steps || [];

    // Nhóm nutrition theo từng dòng 4 items
    const groupNutrition = (items) => {
        const grouped = [];
        for (let i = 0; i < items.length; i += 4) {
            grouped.push(items.slice(i, i + 4));
        }
        return grouped;
    };

    const groupedNutrition = groupNutrition(nutritionalComponents);

    // Render stars cho popularity
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<Ionicons key={i} name="star" size={16} color="#FFD700" />);
            } else if (i === fullStars && hasHalfStar) {
                stars.push(<Ionicons key={i} name="star-half" size={16} color="#FFD700" />);
            } else {
                stars.push(<Ionicons key={i} name="star-outline" size={16} color="#FFD700" />);
            }
        }
        return stars;
    };

    return (
        <View style={styles.container}>
            {/* Ảnh Header */}
            <View style={styles.imageContainer}>
                <Image 
                    source={mealDetail.image ? { uri: mealDetail.image } : require('../../../assets/images/food1.png')} 
                    style={styles.image} 
                />
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={26} color="#fff" />
                </TouchableOpacity>
                <View style={styles.typeMealContainer}>
                    <Text style={styles.typeMealText}>{categoryTitle}</Text>
                </View>
            </View>

            {/* Nội dung */}
            <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 20 }}>
                <Text style={styles.mealName}>{mealDetail.nameMeal}</Text>

                {/* Popularity Rating */}
                {mealDetail.popularity && (
                    <View style={styles.ratingContainer}>
                        <View style={styles.starsContainer}>
                            {renderStars(mealDetail.popularity)}
                        </View>
                        <Text style={styles.ratingText}>
                            {mealDetail.popularity.toFixed(1)} / 5.0
                        </Text>
                    </View>
                )}

                {/* Thông tin thời gian */}
                <View style={styles.timeContainer}>
                    <View style={styles.timeItem}>
                        <Ionicons name="time-outline" size={16} color="#666" />
                        <Text style={styles.timeValue}>{mealDetail.prepTimeMinutes || '15'} phút</Text>
                    </View>

                    <View style={styles.timeItem}>
                        <Ionicons name="flame-outline" size={16} color="#666" />
                        <Text style={styles.timeValue}>{mealDetail.cookTimeMinutes || '30'} phút</Text>
                    </View>
                </View>

                {/* Thông tin dinh dưỡng */}
                {nutritionalComponents.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Thông tin dinh dưỡng (100g)</Text>
                        <View style={styles.nutritionGridContainer}>
                            {groupedNutrition.map((row, rowIndex) => (
                                <View key={rowIndex} style={styles.nutritionRow}>
                                    {row.map((item, index) => (
                                        <View key={item._id || index} style={styles.nutritionGridItem}>
                                            <Text style={styles.nutritionGridValue}>
                                                {item.amount} {item.unit_name}
                                            </Text>
                                            <Text style={styles.nutritionGridName} numberOfLines={2}>
                                                {item.name}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            ))}
                        </View>
                    </>
                )}

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
                            {steps.length > 0 ? (
                                steps
                                    .sort((a, b) => a.stepNumber - b.stepNumber)
                                    .map((step, index) => (
                                        <View key={index} style={styles.stepContainer}>
                                            <Text style={styles.stepTitle}>
                                                Bước {step.stepNumber}. {step.title}
                                            </Text>
                                            <Text style={styles.stepDescription}>
                                                {step.description}
                                            </Text>
                                        </View>
                                    ))
                            ) : (
                                <Text style={{ textAlign: 'center', color: '#999', paddingVertical: 20 }}>
                                    Chưa có hướng dẫn nấu
                                </Text>
                            )}
                        </View>
                    )}
                </View>

                {/* WebView - Tra cứu dinh dưỡng món ăn */}
                <View style={styles.webviewSection}>
                    <View style={styles.webviewHeader}>
                        <Text style={styles.sectionTitle}>Tra cứu giá trị dinh dưỡng món ăn</Text>
                        <TouchableOpacity 
                            style={styles.expandButton}
                            onPress={() => setIsWebViewModalVisible(true)}
                        >
                            <Ionicons name="expand-outline" size={24} color="#35A55E" />
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.webviewContainer}>
                        <WebView
                            ref={webViewRef}
                            source={{ uri: 'https://viendinhduong.vn/vi/cong-cu-va-tien-ich/gia-tri-dinh-duong-mon-an?page=2&pageSize=15' }}
                            style={styles.webview}
                            startInLoadingState={true}
                            injectedJavaScript={getInjectedJavaScript(mealDetail.nameMeal)}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            renderLoading={() => (
                                <ActivityIndicator
                                    color="#35A55E"
                                    size="large"
                                    style={styles.webviewLoader}
                                />
                            )}
                            onMessage={(event) => {
                                console.log('WebView message:', event.nativeEvent.data);
                            }}
                        />
                    </View>
                </View>
            </ScrollView>

            {/* Modal WebView toàn màn hình */}
            <Modal
                visible={isWebViewModalVisible}
                animationType="slide"
                onRequestClose={() => setIsWebViewModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    {/* Header Modal */}
                    <View style={styles.modalHeader}>
                        <TouchableOpacity 
                            style={styles.modalCloseButton}
                            onPress={() => setIsWebViewModalVisible(false)}
                        >
                            <Ionicons name="close" size={28} color="#333" />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>viendinhduong.vn</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    {/* WebView toàn màn hình */}
                    <WebView
                        source={{ uri: 'https://viendinhduong.vn/vi/cong-cu-va-tien-ich/gia-tri-dinh-duong-mon-an?page=2&pageSize=15' }}
                        style={styles.modalWebview}
                        startInLoadingState={true}
                        injectedJavaScript={getInjectedJavaScript(mealDetail.nameMeal)}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        renderLoading={() => (
                            <View style={styles.modalLoadingContainer}>
                                <ActivityIndicator
                                    color="#35A55E"
                                    size="large"
                                />
                                <Text style={styles.modalLoadingText}>Đang tải...</Text>
                            </View>
                        )}
                    />
                </View>
            </Modal>
        </View>
    );
}
