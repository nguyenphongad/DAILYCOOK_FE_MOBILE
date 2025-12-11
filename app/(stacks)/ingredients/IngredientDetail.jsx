import React, { useEffect, useRef } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { getIngredientDetail } from '../../../redux/thunk/ingredientThunk';

// Skeleton Loading Component
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

export default function IngredientDetail() {
    const router = useRouter();
    const dispatch = useDispatch();
    const params = useLocalSearchParams();

    // Redux selectors
    const { ingredientDetails, ingredientDetailLoading, ingredientDetailError } = useSelector(
        (state) => state.ingredient
    );

    // Load ingredient detail khi component mount
    useEffect(() => {
        if (params.id) {
            console.log('Loading ingredient detail for ID:', params.id);
            dispatch(getIngredientDetail(params.id));
        }
    }, [params.id, dispatch]);

    // Lấy data từ Redux store
    const ingredientDetail = ingredientDetails[params.id];

    // Skeleton Loading UI
    if (ingredientDetailLoading && !ingredientDetail) {
        return (
            <View style={styles.container}>
                {/* Skeleton Image */}
                <View style={styles.imageContainer}>
                    <SkeletonBox width="100%" height={230} style={{ borderRadius: 0 }} />
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={26} color="#fff" />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
                    {/* Skeleton Category */}
                    <SkeletonBox width={120} height={20} style={{ alignSelf: 'flex-end', marginBottom: 10 }} />
                    
                    {/* Skeleton Title */}
                    <SkeletonBox width="60%" height={24} style={{ marginBottom: 10 }} />
                    
                    {/* Skeleton Description */}
                    <SkeletonBox width="100%" height={80} style={{ marginBottom: 20 }} />
                    
                    {/* Skeleton Nutrition */}
                    <SkeletonBox width={200} height={20} style={{ marginBottom: 10 }} />
                    <View style={styles.nutritionContainer}>
                        <SkeletonBox width="100%" height={60} style={{ marginBottom: 15 }} />
                        <View style={styles.nutritionItems}>
                            {[1, 2, 3].map((_, index) => (
                                <SkeletonBox key={index} width="30%" height={70} />
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Error state
    if (ingredientDetailError) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={26} color="#333" />
                </TouchableOpacity>
                <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
                <Text style={styles.errorText}>{ingredientDetailError}</Text>
                <TouchableOpacity 
                    style={styles.retryButton}
                    onPress={() => dispatch(getIngredientDetail(params.id))}
                >
                    <Text style={styles.retryButtonText}>Thử lại</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // No data
    if (!ingredientDetail) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={26} color="#333" />
                </TouchableOpacity>
                <Text style={styles.errorText}>Không tìm thấy thông tin nguyên liệu</Text>
            </View>
        );
    }

    // Extract data
    const nutrition = ingredientDetail.nutrition || {};
    const commonUses = ingredientDetail.commonUses || [];
    const defaultAmount = ingredientDetail.defaultAmount || 100;
    const defaultUnit = ingredientDetail.defaultUnit || 'g';

    return (
        <View style={styles.container}>
            {/* Ảnh Header */}
            <View style={styles.imageContainer}>
                <Image 
                    source={
                        ingredientDetail.ingredientImage 
                            ? { uri: ingredientDetail.ingredientImage } 
                            : require('../../../assets/images/logo.png')
                    } 
                    style={styles.image} 
                />
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={26} color="#fff" />
                </TouchableOpacity>
                
                <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>
                        {ingredientDetail.ingredientCategory?.title || 'Thực phẩm'}
                    </Text>
                </View>
            </View>

            {/* Nội dung */}
            <ScrollView 
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.ingredientName}>{ingredientDetail.nameIngredient}</Text>
                
                <Text style={styles.description}>{ingredientDetail.description}</Text>

                {/* Dinh dưỡng */}
                <Text style={styles.sectionTitle}>
                    Giá trị dinh dưỡng (trong {defaultAmount}{defaultUnit})
                </Text>

                <View style={styles.nutritionContainer}>
                    {/* Calories */}
                    <View style={styles.nutritionItemCalories}>
                        <Text style={styles.nutritionValue}>{Math.round(nutrition.calories || 0)}</Text>
                        <Text style={styles.nutritionName}>Calories</Text>
                    </View>

                    {/* 3 nhóm còn lại */}
                    <View style={styles.nutritionItems}>
                        <View style={styles.nutritionItem}>
                            <Text style={styles.nutritionValue}>{Math.round(nutrition.protein || 0)}g</Text>
                            <Text style={styles.nutritionName}>Protein</Text>
                            <View style={[styles.nutritionBar, styles.proteinBar]} />
                        </View>

                        <View style={styles.nutritionItem}>
                            <Text style={styles.nutritionValue}>{Math.round(nutrition.carbs || 0)}g</Text>
                            <Text style={styles.nutritionName}>Carbs</Text>
                            <View style={[styles.nutritionBar, styles.carbsBar]} />
                        </View>

                        <View style={styles.nutritionItem}>
                            <Text style={styles.nutritionValue}>{Math.round(nutrition.fat || 0)}g</Text>
                            <Text style={styles.nutritionName}>Fat</Text>
                            <View style={[styles.nutritionBar, styles.fatBar]} />
                        </View>
                    </View>
                </View>

                {/* Công dụng */}
                {commonUses.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Công dụng phổ biến</Text>
                        <View style={styles.usesContainer}>
                            {commonUses.map((use, index) => (
                                <View key={index} style={styles.useChip}>
                                    <Text style={styles.useText}>{use}</Text>
                                </View>
                            ))}
                        </View>
                    </>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#D4E9E1'
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 260,
        backgroundColor: '#F0F0F0',
    },
    backButton: {
        position: 'absolute',
        top: 60,
        left: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    categoryBadge: {
        position: 'absolute',
        top: 60,
        right: 20,
        backgroundColor: 'rgba(53, 165, 94, 0.9)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    categoryBadgeText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 30,
    },
    ingredientName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#35A55E',
        marginTop: 20,
        marginBottom: 12,
    },
    description: {
        fontSize: 15,
        color: '#666',
        lineHeight: 22,
        textAlign: 'justify',
    },
    nutritionContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginTop: 8,
    },
    nutritionItemCalories: {
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: '#E0E0E0',
        marginBottom: 16,
    },
    nutritionItems: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    nutritionItem: {
        alignItems: 'center',
        flex: 1,
    },
    nutritionValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    nutritionName: {
        fontSize: 13,
        color: '#666',
        marginTop: 4,
        marginBottom: 8,
    },
    nutritionBar: {
        width: '80%',
        height: 4,
        borderRadius: 2,
    },
    proteinBar: {
        backgroundColor: '#35A55E',
    },
    carbsBar: {
        backgroundColor: '#FF9500',
    },
    fatBar: {
        backgroundColor: '#FF6B6B',
    },
    usesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8,
    },
    useChip: {
        backgroundColor: 'rgba(53, 165, 94, 0.1)', 
        borderRadius: 16,
        paddingVertical: 8,
        paddingHorizontal: 14,
    },
    useText: {
        fontSize: 14,
        color: '#35A55E',
        fontWeight: '500',
    },
    errorText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        paddingHorizontal: 32,
    },
    retryButton: {
        marginTop: 24,
        backgroundColor: '#35A55E',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
