import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    SafeAreaView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { H2, Paragraph } from 'tamagui';
import { nextStep, prevStep, setDietaryPreferences } from '../../redux/slice/surveySlice';
import { saveOnboardingData } from '../../redux/thunk/surveyThunk';
import SheetComponent from '../../components/sheet/SheetComponent';
import dietTypes from '../../data/dietTypes';
import HeaderComponent from '../../components/header/HeaderComponent';
import ButtonComponent from '../../components/button/ButtonComponent';

export default function SelectDietTypeScreen() {
    const [selectedDiet, setSelectedDiet] = useState(null);
    const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
    const [currentDietDetail, setCurrentDietDetail] = useState(null);
    const dispatch = useDispatch();
    const router = useRouter();
    
    // Lấy dữ liệu từ Redux
    const { onboardingData, saveLoading, saveError } = useSelector(state => state.survey);

    // Mở sheet chi tiết cho chế độ ăn được chọn
    const openDietDetail = (diet) => {
        setCurrentDietDetail(diet);
        setIsDetailSheetOpen(true);
    };

    // Chọn chế độ ăn từ danh sách
    const selectDiet = (dietId) => {
        if (selectedDiet === dietId) {
            setSelectedDiet(null);
        } else {
            setSelectedDiet(dietId);
        }
    };

    // Chọn chế độ ăn từ sheet chi tiết
    const selectDietFromDetail = () => {
        if (currentDietDetail) {
            setSelectedDiet(currentDietDetail.id);
            setIsDetailSheetOpen(false);
        }
    };

    const handleNext = async () => {
        if (selectedDiet) {
            try {
                // Lưu dietary preferences vào Redux
                const dietaryPreferences = { DietType_id: selectedDiet };
                dispatch(setDietaryPreferences(dietaryPreferences));
                
                // Chuẩn bị dữ liệu để gửi API
                const dataToSave = {
                    type: onboardingData.type,
                    data: {}
                };
                
                if (onboardingData.type === 'family') {
                    dataToSave.data = {
                        familyInfo: onboardingData.familyInfo,
                        dietaryPreferences: dietaryPreferences
                    };
                } else {
                    dataToSave.data = {
                        personalInfo: onboardingData.personalInfo,
                        dietaryPreferences: dietaryPreferences
                    };
                }
                
                console.log('Saving onboarding data:', dataToSave);
                
                // Gọi API lưu dữ liệu
                const result = await dispatch(saveOnboardingData(dataToSave)).unwrap();
                
                if (result.data?.isOnboardingCompleted) {
                    // Onboarding hoàn thành, redirect về home
                    router.replace('/(tabs)');
                } else {
                    // Tiếp tục với Questions nếu chưa hoàn thành
                    dispatch(nextStep());
                    router.push('/onboarding/Questions');
                }
            } catch (error) {
                console.error('Error saving onboarding data:', error);
                // Hiển thị lỗi cho user
                alert('Có lỗi xảy ra khi lưu dữ liệu. Vui lòng thử lại.');
            }
        }
    };

    const handleBack = () => {
        dispatch(prevStep());
        router.back();
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <HeaderComponent />

            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <H2 style={styles.title}>Chế độ ăn</H2>
                    <Paragraph style={styles.subtitle}>
                        Chúng tôi đề xuất các chế độ ăn dưới đây, hãy chọn phù hợp nhất với sở thích của bạn
                    </Paragraph>
                </View>

                {/* Danh sách chế độ ăn */}
                <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    {dietTypes.map(diet => (
                        <TouchableOpacity
                            key={diet.id}
                            style={[
                                styles.dietCard,
                                selectedDiet === diet.id && styles.selectedDietCard
                            ]}
                            onPress={() => selectDiet(diet.id)}
                            activeOpacity={0.7}
                        >
                            {/* Thông tin chế độ ăn */}
                            <View style={styles.dietCardLeft}>
                                <Text style={[
                                    styles.dietTitle,
                                    selectedDiet === diet.id && styles.selectedDietTitle
                                ]}>
                                    {diet.name}
                                </Text>
                                <Text style={styles.dietDescription}>
                                    {diet.shortDescription}
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
                                <Image
                                    source={diet.image}
                                    style={styles.dietImage}
                                    resizeMode="cover"
                                />

                                {/* Hiển thị dấu tích nếu đã chọn */}
                                {selectedDiet === diet.id && (
                                    <View style={styles.checkmarkContainer}>
                                        <Ionicons name="checkmark-circle" size={28} color="#35A55E" />
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Button Component */}
                <View style={styles.bottomContainer}>
                    <ButtonComponent
                        enableBack={true}
                        onBack={handleBack}
                        onNext={handleNext}
                        disableNext={!selectedDiet || saveLoading}
                        nextColor="#35A55E"
                        nextText={saveLoading ? "Đang lưu..." : "Tiếp theo"}
                    />

                    <Paragraph textAlign="center" color="$gray8" fontSize="$3" marginTop="$2">
                        Bước 2/3 (Gia đình) hoặc Bước 6/6 (Cá nhân)
                    </Paragraph>
                </View>
            </View>

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
                            <Text style={styles.sheetTitle}>{currentDietDetail.name}</Text>
                            <TouchableOpacity
                                onPress={() => setIsDetailSheetOpen(false)}
                            >
                                <Ionicons name="close" size={24} color="#666666" />
                            </TouchableOpacity>
                        </View>

                        {/* Phần nội dung chi tiết */}
                        <ScrollView style={styles.sheetContent}>
                            {/* Hình ảnh minh họa */}
                            <Image
                                source={currentDietDetail.image}
                                style={styles.sheetImage}
                                resizeMode="cover"
                            />

                            {/* Phần mô tả */}
                            <View style={styles.sheetDescriptionContainer}>
                                <Text style={styles.sheetDescription}>
                                    {currentDietDetail.description}
                                </Text>
                            </View>

                            {/* Thông tin dinh dưỡng */}
                            <View style={styles.nutritionContainer}>
                                <Text style={styles.sectionTitle}>Thông tin dinh dưỡng</Text>
                                <View style={styles.macroCircleContainer}>
                                    {currentDietDetail.nutrition.macros.map((macro, index) => (
                                        <View key={index} style={styles.macroCircle}>
                                            <Text style={styles.macroPercentage}>{macro.percentage}%</Text>
                                            <Text style={styles.macroName}>{macro.name}</Text>
                                        </View>
                                    ))}
                                </View>
                                <Text style={styles.caloriesText}>
                                    {currentDietDetail.nutrition.calories} kcal/ngày
                                </Text>
                            </View>

                            {/* Thực phẩm được khuyến khích */}
                            <View style={styles.foodSection}>
                                <Text style={styles.sectionTitle}>Thực phẩm khuyến khích</Text>
                                <View style={styles.foodContainer}>
                                    {currentDietDetail.recommendedFoods.map((food, index) => (
                                        <View key={index} style={styles.foodItem}>
                                            <Ionicons name="checkmark-circle" size={16} color="#35A55E" />
                                            <Text style={styles.foodText}>{food}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            {/* Thực phẩm nên hạn chế */}
                            <View style={styles.foodSection}>
                                <Text style={styles.sectionTitle}>Thực phẩm hạn chế</Text>
                                <View style={styles.foodContainer}>
                                    {currentDietDetail.restrictedFoods.map((food, index) => (
                                        <View key={index} style={styles.foodItem}>
                                            <Ionicons name="close-circle" size={16} color="#FF6B6B" />
                                            <Text style={styles.foodText}>{food}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            {/* Lợi ích của chế độ ăn */}
                            <View style={styles.benefitsSection}>
                                <Text style={styles.sectionTitle}>Lợi ích</Text>
                                <View style={styles.benefitsContainer}>
                                    {currentDietDetail.benefits.map((benefit, index) => (
                                        <View key={index} style={styles.benefitItem}>
                                            <Ionicons name="star" size={16} color="#FFD700" />
                                            <Text style={styles.benefitText}>{benefit}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </ScrollView>

                        {/* Nút chọn chế độ ăn */}
                        <TouchableOpacity
                            style={[styles.selectButton, selectedDiet === currentDietDetail.id && styles.selectedButton]}
                            onPress={selectDietFromDetail}
                        >
                            <Text style={styles.selectButtonText}>
                                {selectedDiet === currentDietDetail.id
                                    ? "Đã chọn chế độ ăn này"
                                    : "Chọn chế độ ăn này"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </SheetComponent>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F1E5',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 80,
    },
    header: {
        paddingTop: 20,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2C3E50',
        textAlign: 'left',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'left',
        lineHeight: 22,
    },
    scrollContainer: {
        flex: 1,
        marginBottom: 20,
    },
    dietCard: {
        flexDirection: 'row',
        backgroundColor: '#F8F9FA',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedDietCard: {
        backgroundColor: '#F8F9FF',
        borderColor: '#35A55E',
    },
    dietCardLeft: {
        flex: 3,
        paddingRight: 12,
    },
    dietTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2C3E50',
        marginBottom: 8,
    },
    selectedDietTitle: {
        color: '#35A55E',
    },
    dietDescription: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 12,
        lineHeight: 20,
    },
    detailButton: {
        alignSelf: 'flex-start',
        paddingVertical: 6,
    },
    detailButtonText: {
        fontSize: 14,
        color: '#35A55E',
        fontWeight: '500',
    },
    dietCardRight: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    dietImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
    },
    checkmarkContainer: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    bottomContainer: {
        paddingBottom: 40,
    },
    detailSheet: {
        flex: 1,
    },
    sheetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    sheetTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333333',
    },
    sheetContent: {
        flex: 1,
    },
    sheetImage: {
        width: '100%',
        height: 180,
        borderRadius: 12,
        marginBottom: 16,
        backgroundColor: '#f5f5f5',
    },
    sheetDescriptionContainer: {
        marginBottom: 24,
    },
    sheetDescription: {
        fontSize: 15,
        lineHeight: 22,
        color: '#333333',
    },
    nutritionContainer: {
        marginBottom: 24,
    },
    macroCircleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
    },
    macroCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#F0F7F4',
        justifyContent: 'center',
        alignItems: 'center',
    },
    macroPercentage: {
        fontSize: 18,
        fontWeight: '700',
        color: '#35A55E',
    },
    macroName: {
        fontSize: 12,
        color: '#666666',
    },
    caloriesText: {
        fontSize: 14,
        color: '#666666',
        textAlign: 'center',
    },
    foodSection: {
        marginBottom: 24,
    },
    foodContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    foodItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '50%',
        marginBottom: 8,
    },
    foodText: {
        fontSize: 14,
        color: '#333333',
        marginLeft: 8,
    },
    benefitsSection: {
        marginBottom: 24,
    },
    benefitsContainer: {
        flexDirection: 'column',
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    benefitText: {
        fontSize: 14,
        color: '#333333',
        marginLeft: 8,
        flex: 1,
    },
    selectButton: {
        backgroundColor: '#35A55E',
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 40,
    },
    selectedButton: {
        backgroundColor: '#2D9150',
    },
    selectButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});