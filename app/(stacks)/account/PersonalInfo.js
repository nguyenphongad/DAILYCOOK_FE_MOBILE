import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import SheetComponent from '../../../components/sheet/SheetComponent';
import EditInfoSheet from '../../../components/account/EditInfoSheet';
import HeaderLeft from '../../../components/header/HeaderLeft';
import HeaderComponent from '../../../components/header/HeaderComponent';
import { getDietaryPreferences } from '../../../redux/thunk/surveyThunk';
import { getDietTypes } from '../../../redux/thunk/mealThunk';

const PersonalInfo = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [isEdit, setIsEdit] = useState(false);
    const [sheetVisible, setSheetVisible] = useState(false);
    const [selectedField, setSelectedField] = useState(null);

    // Redux selectors
    const { user } = useSelector((state) => state.auth);
    const { currentDietaryPreferences, dietaryPreferencesLoading } = useSelector((state) => state.survey);
    const { dietTypes } = useSelector((state) => state.meal);

    // Personal info data structure with JSON
    const [personalInfo, setPersonalInfo] = useState({
        bmi: {
            value: 22.82,
            label: 'Chỉ số BMI',
            isEditable: false,
        },
        gender: {
            value: 'Nữ',
            label: 'Giới tính',
            options: ['Nam', 'Nữ'],
            isEditable: true,
        },
        age: {
            value: '25',
            label: 'Tuổi',
            isEditable: true,
        },
        height: {
            value: '165 cm',
            label: 'Chiều cao',
            isEditable: true,
        },
        weight: {
            value: '62 kg',
            label: 'Cân nặng',
            isEditable: true,
        },
        targetWeight: {
            value: '55 kg',
            label: 'Cân nặng mục tiêu',
            isEditable: true,
        },
        dietType: {
            value: 'Đang tải...',
            label: 'Chế độ ăn',
            isEditable: false, // Không cho edit trực tiếp, phải vào DietType page
            navigateTo: '/(stacks)/account/DietType',
        },
    });

    // Load dietary preferences và diet types khi mount
    useEffect(() => {
        if (user && user._id) {
            dispatch(getDietaryPreferences(user._id));
        }
        if (dietTypes.length === 0) {
            dispatch(getDietTypes());
        }
    }, [dispatch, user]);

    // Update diet type value khi có data
    useEffect(() => {
        if (currentDietaryPreferences && dietTypes.length > 0) {
            const dietTypeKeyword = currentDietaryPreferences.DietType_id;
            const matchingDiet = dietTypes.find(diet => diet.keyword === dietTypeKeyword);
            
            setPersonalInfo(prev => ({
                ...prev,
                dietType: {
                    ...prev.dietType,
                    value: matchingDiet ? matchingDiet.title : 'Chưa chọn chế độ ăn'
                }
            }));
        } else if (!dietaryPreferencesLoading) {
            setPersonalInfo(prev => ({
                ...prev,
                dietType: {
                    ...prev.dietType,
                    value: 'Chưa chọn chế độ ăn'
                }
            }));
        }
    }, [currentDietaryPreferences, dietTypes, dietaryPreferencesLoading]);

    // Handler functions
    const handleGoBack = () => {
        console.log('Quay lại');
        router.back();
    };

    const handleToggleEdit = () => {
        console.log('Chuyển đổi chế độ chỉnh sửa');
        setIsEdit(!isEdit);
    };

    const handleUpdateInfo = (key, value) => {
        console.log(`Đang cập nhật ${key} thành ${value}`);
        setPersonalInfo(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                value: value
            }
        }));
        setSheetVisible(false);
    };

    const handleOpenEditSheet = (key, item) => {
        // Nếu là diet type, navigate sang DietType page
        if (key === 'dietType' && item.navigateTo) {
            router.push(item.navigateTo);
            return;
        }
        
        if (item.isEditable) {
            setSelectedField({ key, item });
            setSheetVisible(true);
        }
    };

    const renderInfoItem = (key, item) => {
        const icon = getIconForInfoType(key);
        const isNavigable = item.navigateTo && !item.isEditable;

        return (
            <TouchableOpacity
                key={key}
                style={styles.infoItem}
                onPress={() => handleOpenEditSheet(key, item)}
                disabled={!item.isEditable && !isNavigable}
            >
                {icon}
                <Text style={styles.infoLabel}>{item.label}</Text>
                <View style={styles.infoValueContainer}>
                    <Text style={[
                        styles.infoValue,
                        item.value === 'Đang tải...' && { color: '#999' },
                        item.value === 'Chưa chọn chế độ ăn' && { color: '#E86F50' }
                    ]}>
                        {item.value}
                    </Text>
                    {(item.isEditable || isNavigable) && (
                        <Ionicons name="chevron-forward" size={24} color="#888" />
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    // Helper function for icons
    const getIconForInfoType = (type) => {
        switch (type) {
            case 'bmi':
                return <Ionicons name="body-outline" size={24} color="#38b94a" style={styles.icon} />;
            case 'gender':
                return <Ionicons name="male-female-outline" size={24} color="#38b94a" style={styles.icon} />;
            case 'age':
                return <Ionicons name="calendar-outline" size={24} color="#38b94a" style={styles.icon} />;
            case 'height':
                return <Ionicons name="resize-outline" size={24} color="#38b94a" style={styles.icon} />;
            case 'weight':
                return <Ionicons name="fitness-outline" size={24} color="#38b94a" style={styles.icon} />;
            case 'targetWeight':
                return <Ionicons name="trending-down-outline" size={24} color="#38b94a" style={styles.icon} />;
            case 'dietType':
                return <Ionicons name="restaurant-outline" size={24} color="#38b94a" style={styles.icon} />;
            case 'activityLevel':
                return <Ionicons name="walk-outline" size={24} color="#38b94a" style={styles.icon} />;
            default:
                return <Ionicons name="information-circle-outline" size={24} color="#38b94a" style={styles.icon} />;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />

            {/* Header */}
            <HeaderComponent>
                <HeaderLeft onGoBack={handleGoBack} title="Quay lại" />
                <TouchableOpacity style={styles.backButton} >
                    <Text style={styles.TextPage}>Thông tin cá nhân</Text>
                </TouchableOpacity>
            </HeaderComponent>

            <ScrollView style={styles.content}>
                {/* Info message */}
                <View style={styles.infoMessage}>
                    <Text style={styles.infoMessageText}>
                        Chúng tôi dựa vào các thông tin cơ bản dưới đây để tạo kế hoạch thực đơn hàng ngày cho bạn:
                    </Text>
                </View>

                {/* BMI Section */}
                <View style={styles.bmiContainer}>
                    <Text style={styles.bmiLabel}>{personalInfo.bmi.label}</Text>
                    <View style={styles.bmiValueContainer}>
                        <Text style={styles.bmiValue}>{personalInfo.bmi.value}</Text>
                    </View>
                </View>

                {/* Personal Info List */}
                <View style={styles.infoList}>
                    {Object.entries(personalInfo).map(([key, item]) => {
                        if (key !== 'bmi') {
                            return renderInfoItem(key, item);
                        }
                        return null;
                    })}
                </View>
            </ScrollView>

            {/* Sheet for editing info */}
            <SheetComponent
                isOpen={sheetVisible}
                onClose={() => setSheetVisible(false)}
                snapPoints={[60]}
            >
                {selectedField && (
                    <EditInfoSheet
                        field={selectedField.key}
                        fieldData={selectedField.item}
                        onSave={handleUpdateInfo}
                        onCancel={() => setSheetVisible(false)}
                    />
                )}
            </SheetComponent>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F1E5',
    },
    content: {
        flex: 1,
        padding: 16,
        marginTop: 70,
    },

    TextPage: {
        color: '#fff',
        fontWeight: '500',
        fontSize: 17,
    },
    infoMessage: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    infoMessageText: {
        fontSize: 14,
        color: '#333',
    },
    bmiContainer: {
        backgroundColor: '#b3e6f3',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        alignItems: 'center',
    },
    bmiLabel: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
    },
    bmiValueContainer: {
        backgroundColor: 'white',
        borderRadius: 4,
        paddingVertical: 8,
        paddingHorizontal: 12,
        width: '100%',
        alignItems: 'center',
    },
    bmiValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    infoList: {
        backgroundColor: '#fff',
        borderRadius: 8,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        marginBottom: 20,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    icon: {
        marginRight: 10,
    },
    infoLabel: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    infoValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoValue: {
        fontSize: 16,
        color: '#888',
        marginRight: 8,
    },
});

export default PersonalInfo;
