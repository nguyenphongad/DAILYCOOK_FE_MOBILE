import React, { useEffect, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Animated, ActivityIndicator, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { getIngredientDetail } from '../../../redux/thunk/ingredientThunk';
import { WebView } from 'react-native-webview';

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
    const [isWebViewModalVisible, setIsWebViewModalVisible] = useState(false);

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

    console.log("ingredientDetails[params.id] : ", ingredientDetails[params.id])


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
    const nutrition = ingredientDetail.nutrition || [];
    const commonUses = ingredientDetail.commonUses || [];
    const defaultAmount = ingredientDetail.defaultAmount || 100;
    const defaultUnit = ingredientDetail.defaultUnit || 'g';

    // Nhóm nutrition theo từng dòng 4 items
    const groupNutrition = (items) => {
        const grouped = [];
        for (let i = 0; i < items.length; i += 4) {
            grouped.push(items.slice(i, i + 4));
        }
        return grouped;
    };

    const groupedNutrition = groupNutrition(nutrition);

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
                {nutrition.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>
                            Giá trị dinh dưỡng (trong {defaultAmount}{defaultUnit})
                        </Text>

                        <View style={styles.nutritionContainer}>
                            {groupedNutrition.map((row, rowIndex) => (
                                <View key={rowIndex} style={styles.nutritionRow}>
                                    {row.map((item, index) => (
                                        <View key={item._id || index} style={styles.nutritionItem}>
                                            <Text style={styles.nutritionValue}>
                                                {item.value} {item.unit}
                                            </Text>
                                            <Text style={styles.nutritionName} numberOfLines={2}>
                                                {item.name}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            ))}
                        </View>
                    </>
                )}

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

                {/* WebView - Tra cứu dinh dưỡng */}
                <View style={styles.webviewSection}>
                    <View style={styles.webviewHeader}>
                        <Text style={styles.sectionTitle}>Tra cứu giá trị dinh dưỡng</Text>
                        <TouchableOpacity 
                            style={styles.expandButton}
                            onPress={() => setIsWebViewModalVisible(true)}
                        >
                            <Ionicons name="expand-outline" size={24} color="#35A55E" />
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.webviewContainer}>
                        <WebView
                            source={{ uri: 'https://viendinhduong.vn/vi/cong-cu-va-tien-ich/gia-tri-dinh-duong-thuc-pham' }}
                            style={styles.webview}
                            startInLoadingState={true}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            renderLoading={() => (
                                <ActivityIndicator
                                    color="#35A55E"
                                    size="large"
                                    style={styles.webviewLoader}
                                />
                            )}
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
                        source={{ uri: 'https://viendinhduong.vn/vi/cong-cu-va-tien-ich/gia-tri-dinh-duong-thuc-pham' }}
                        style={styles.modalWebview}
                        startInLoadingState={true}
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
    nutritionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        gap: 8,
    },
    nutritionItem: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        padding: 12,
        borderRadius: 12,
        minHeight: 70,
        justifyContent: 'center',
    },
    nutritionValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#35A55E',
        marginBottom: 4,
    },
    nutritionName: {
        fontSize: 11,
        color: '#666',
        textAlign: 'center',
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
    webviewSection: {
        marginTop: 20,
    },
    webviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 0,
        marginTop: 0,
    },
    expandButton: {
        padding: 8,
        backgroundColor: 'rgba(53, 165, 94, 0.1)',
        borderRadius: 8,
    },
    webviewContainer: {
        height: 600,
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        marginTop: 8,
        marginBottom: 20,
    },
    webview: {
        flex: 1,
    },
    webviewLoader: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -20,
        marginTop: -20,
    },
    
    // Modal styles
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingTop: 50,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    modalCloseButton: {
        padding: 4,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    modalWebview: {
        flex: 1,
    },
    modalLoadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    modalLoadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#666',
    },
});
