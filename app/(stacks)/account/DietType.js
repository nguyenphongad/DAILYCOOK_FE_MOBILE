import React, { useState, useEffect } from 'react';
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
import { router } from 'expo-router';
import SheetComponent from '../../../components/sheet/SheetComponent';
import dietTypes from '../../../data/dietTypes';
import HeaderComponent from '../../../components/header/HeaderComponent';
import HeaderLeft from '../../../components/header/HeaderLeft';

export default function DietType() {
    const [selectedDiet, setSelectedDiet] = useState(null);
    const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
    const [currentDietDetail, setCurrentDietDetail] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);

    // Giả định chúng ta lấy chế độ ăn đã chọn từ trước (ví dụ từ API)
    useEffect(() => {
        // Mô phỏng việc lấy chế độ ăn từ API hoặc storage
        const fetchInitialDiet = () => {
            // Giả sử không có chế độ ăn nào được chọn trước đó
            setSelectedDiet(null);
        };

        fetchInitialDiet();
    }, []);

    // Mở sheet chi tiết cho chế độ ăn được chọn
    const openDietDetail = (diet) => {
        setCurrentDietDetail(diet);
        setIsDetailSheetOpen(true);
    };

    // Chọn chế độ ăn từ danh sách
    const selectDiet = (dietId) => {
        if (selectedDiet === dietId) {
            // Nếu đã chọn rồi thì bỏ chọn
            setSelectedDiet(null);
        } else {
            setSelectedDiet(dietId);
        }
        setHasChanges(true);
    };

    // Chọn chế độ ăn từ sheet chi tiết
    const selectDietFromDetail = () => {
        if (currentDietDetail) {
            setSelectedDiet(currentDietDetail.id);
            setIsDetailSheetOpen(false);
            setHasChanges(true);
        }
    };

    // Lưu chế độ ăn đã chọn
    const saveDietSelection = () => {
        // Mô phỏng việc lưu chế độ ăn vào API hoặc storage
        console.log('Đã lưu chế độ ăn:', selectedDiet);

        // Hiển thị thông báo thành công và quay lại màn hình trước đó
        alert('Đã lưu chế độ ăn thành công!');
        router.back();
    };

     // Handler functions
    const handleGoBack = () => {
        console.log('Quay lại');
        router.back();
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            {/* Header */}
            <HeaderComponent>
                <HeaderLeft onGoBack={handleGoBack} title="Quay lại" />
                <TouchableOpacity style={styles.backButton} >
                    <Text style={styles.TextPage}>Chế độ ăn</Text>
                </TouchableOpacity>
            </HeaderComponent>


            {/* Phần giới thiệu */}
            <View style={styles.introContainer}>
                <Text style={styles.introText}>
                    Chúng tôi đề xuất các chế độ ăn dưới đây, hãy chọn phù hợp nhất với sở thích của bạn?
                </Text>
            </View>

            {/* Danh sách chế độ ăn */}
            <ScrollView style={styles.scrollContainer}>
                {dietTypes.map(diet => (
                    <TouchableOpacity
                        key={diet.id}
                        style={styles.dietCard}
                        onPress={() => selectDiet(diet.id)}
                        activeOpacity={0.7}
                    >
                        {/* Thông tin chế độ ăn */}
                        <View style={styles.dietCardLeft}>
                            <Text style={styles.dietTitle}>{diet.name}</Text>
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

                        {/* Hình ảnh chế độ ăn - Cập nhật để hiển thị hình ảnh từ URI */}
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

            {/* Nút lưu chế độ ăn */}
            {hasChanges && (
                <View style={styles.saveButtonContainer}>
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={saveDietSelection}
                    >
                        <Text style={styles.saveButtonText}>Lưu</Text>
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
                            <Text style={styles.sheetTitle}>{currentDietDetail.name}</Text>
                            <TouchableOpacity
                                onPress={() => setIsDetailSheetOpen(false)}
                            >
                                <Ionicons name="close" size={24} color="#666666" />
                            </TouchableOpacity>
                        </View>

                        {/* Phần nội dung chi tiết */}
                        <ScrollView style={styles.sheetContent}>
                            {/* Hình ảnh minh họa - Cập nhật cách hiển thị hình ảnh */}
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
                            style={[
                                styles.selectButton,
                                selectedDiet === currentDietDetail.id && styles.selectedButton
                            ]}
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
        backgroundColor: '#FFFFFF',
        paddingBottom:40
    },
  
    backButton: {
        padding: 8,
    },
    TextPage: {
        color: '#fff',
        fontWeight: '500',
        fontSize: 17,
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333333',
    },
    spacer: {
        width: 40,
    },
    introContainer: {
        padding: 16,
        backgroundColor: '#F7F9FA',
    },
    introText: {
        fontSize: 14,
        lineHeight: 20,
        color: '#666666',
    },
    scrollContainer: {
        flex: 1,
        padding: 16,
        paddingTop:30,
        paddingBottom:60,
    },
    dietCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#EEEEEE',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    dietCardLeft: {
        flex: 3,
        paddingRight: 12,
    },
    dietTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 8,
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
        backgroundColor: '#f5f5f5', // Thêm màu nền mặc định trong khi tải ảnh
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
    saveButtonContainer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
    },
    saveButton: {
        backgroundColor: '#35A55E',
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
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
        backgroundColor: '#f5f5f5', // Thêm màu nền mặc định trong khi tải ảnh
    },
    sheetDescriptionContainer: {
        marginBottom: 24,
    },
    sheetDescription: {
        fontSize: 15,
        lineHeight: 22,
        color: '#333333',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 12,
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
    }
});
