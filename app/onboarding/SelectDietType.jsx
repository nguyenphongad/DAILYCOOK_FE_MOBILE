import React, { useState, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    SafeAreaView,
    Linking
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { H2, Paragraph } from 'tamagui';
import { nextStep, prevStep, setDietaryPreferences } from '../../redux/slice/surveySlice';
import { saveOnboardingData } from '../../redux/thunk/surveyThunk';
import { getDietTypes } from '../../redux/thunk/mealThunk';
import SheetComponent from '../../components/sheet/SheetComponent';
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
    const { dietTypes, loading: dietTypesLoading, error: dietTypesError } = useSelector(state => state.meal);

    // Lấy danh sách chế độ ăn khi component mount
    useEffect(() => {
        if (dietTypes.length === 0) {
            dispatch(getDietTypes());
        }
    }, [dispatch, dietTypes.length]);

    // Hiển thị lỗi nếu có
    useEffect(() => {
        if (dietTypesError) {
            alert('Có lỗi xảy ra khi tải danh sách chế độ ăn: ' + dietTypesError);
        }
    }, [dietTypesError]);

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
            setSelectedDiet(currentDietDetail._id);
            setIsDetailSheetOpen(false);
        }
    };

    const handleNext = async () => {
        if (selectedDiet) {
            try {
                // Tìm diet object để lấy keyword
                const selectedDietObject = sortedDietTypes.find(diet => diet._id === selectedDiet);
                if (!selectedDietObject) {
                    alert('Không tìm thấy thông tin chế độ ăn đã chọn');
                    return;
                }

                // Lưu dietary preferences với keyword thay vì _id
                const dietaryPreferences = { DietType_id: selectedDietObject.keyword };
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
                console.log('Selected diet keyword:', selectedDietObject.keyword);
                
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

    // Tạo một mảng đã sắp xếp để hiển thị
    const sortedDietTypes = useMemo(() => {
        if (!Array.isArray(dietTypes)) return [];
        
        // Sắp xếp từ dưới lên trên (reverse)
        return [...dietTypes].reverse();
        
        // Hoặc sắp xếp theo tiêu chí khác
        // return [...dietTypes].sort((a, b) => {
        //     if (a.createdAt && b.createdAt) {
        //         return new Date(b.createdAt) - new Date(a.createdAt);
        //     }
        //     return b._id.localeCompare(a._id);
        // });
    }, [dietTypes]);

    // Hiển thị loading khi đang tải dữ liệu hoặc khi dietTypes không phải là array
    if (dietTypesLoading || !Array.isArray(dietTypes)) {
        return (
            <SafeAreaView style={styles.container}>
                <HeaderComponent />
                <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={styles.loadingText}>Đang tải danh sách chế độ ăn...</Text>
                </View>
            </SafeAreaView>
        );
    }

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
                        {onboardingData.type === 'family' ? 'Bước 2/3 (Gia đình)' : 'Bước 6/6 (Cá nhân)'}
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
                                    
                                    {/* Nguồn khuyến nghị */}
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
        position: 'relative',
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
        paddingBottom: 100, // Thêm padding để tránh nút đè lên content
    },
    sheetScrollContent: {
        paddingBottom: 20, // Padding cho scroll content
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
    macroCardContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    macroCard: {
        width: '48%',
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginBottom: 12,
    },
    macroIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    macroValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 4,
    },
    macroLabel: {
        fontSize: 12,
        color: '#666666',
        textAlign: 'center',
    },
    
    // Styles cho nguồn khuyến nghị
    sourceContainer: {
        backgroundColor: '#F0F7F4',
        borderRadius: 8,
        padding: 12,
        marginTop: 10,
    },
    sourceTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2C3E50',
        marginBottom: 6,
    },
    sourceLink: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sourceLinkText: {
        fontSize: 13,
        color: '#35A55E',
        textDecorationLine: 'underline',
        flex: 1,
    },
    
    loadingText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },

    // Container cho nút select - fixed position
    selectButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 50,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
    },
    selectButton: {
        backgroundColor: '#35A55E',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
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