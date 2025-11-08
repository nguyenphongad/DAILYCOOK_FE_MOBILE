import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Animated,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';

export default function MealDetail1() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('ingredient');

    // Animation cho tab indicator
    const indicatorAnim = React.useRef(new Animated.Value(0)).current;

    // Xử lý chuyển tab với animation
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        
        // Animation cho indicator
        Animated.spring(indicatorAnim, {
            toValue: tab === 'ingredient' ? 0 : 1,
            useNativeDriver: false,
            tension: 60,
            friction: 12,
        }).start();
    };

    return (
        <View style={styles.container}>
            {/* Ảnh Header */}
            <View style={styles.imageContainer}>
                <Image source={{ uri: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg' }} style={styles.image} />
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={26} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Nội dung */}
            <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 20 }}>

                <View style={styles.typeMealContainer}>
                    <Text style={styles.typeMealText}>Bữa chính</Text>
                </View>

                <Text style={styles.mealName}>THỊT KHO MẮM RUỐC</Text>

                {/* Thông tin thời gian */}
                <View style={styles.timeContainer}>
                    <View style={styles.timeItem}>
                        <Ionicons name="time-outline" size={16} color="#666" />
                        <Text style={styles.timeValue}>15 phút</Text>
                    </View>

                    <View style={styles.timeItem}>
                        <Ionicons name="flame-outline" size={16} color="#666" />
                        <Text style={styles.timeValue}>30 phút</Text>
                    </View>
                </View>

                {/* Thông tin dinh dưỡng */}
                <View style={styles.nutritionContainer}>
                    {[
                        { value: '42kcal', label: 'Calories', color: '#8ea846' },
                        { value: '3.4g', label: 'Protein', color: '#35A55E' },
                        { value: '12g', label: 'Carbs', color: '#FF9500' },
                        { value: '1g', label: 'Fat', color: '#FF6B6B' },
                    ].map((item, index) => (
                        <View key={index} style={[styles.nutritionItem, index === 0 && { borderLeftWidth: 0 }]}>
                            <Text style={[styles.nutritionValue, { color: item.color }]}>{item.value}</Text>
                            <Text style={styles.nutritionLabel}>{item.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Tab chuyển đổi tùy chỉnh với animation */}
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
                        
                        {/* Animated indicator */}
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

                {/* Nội dung Tab với animation fade */}
                <View style={styles.tabContentContainer}>
                    {activeTab === 'ingredient' ? (
                        <View style={styles.ingredientList}>
                            <View style={styles.ingredientItem}>
                                <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1046/1046769.png' }} style={styles.ingredientIcon} />
                                <Text style={styles.ingredientName}>Thịt lợn</Text>
                                <Text style={styles.ingredientAmount}>500g</Text>
                            </View>
                            <View style={styles.ingredientItem}>
                                <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/765/765500.png' }} style={styles.ingredientIcon} />
                                <Text style={styles.ingredientName}>Cải thìa</Text>
                                <Text style={styles.ingredientAmount}>200g</Text>
                            </View>
                            <View style={styles.ingredientItem}>
                                <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/766/766267.png' }} style={styles.ingredientIcon} />
                                <Text style={styles.ingredientName}>Nghệ tươi</Text>
                                <Text style={styles.ingredientAmount}>2 thìa cà phê</Text>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.guideContainer}>
                            <Text style={styles.stepText}>1. Rửa sạch thịt, cắt miếng vừa ăn.</Text>
                            <Text style={styles.stepText}>2. Phi thơm mắm ruốc với hành tỏi.</Text>
                            <Text style={styles.stepText}>3. Cho thịt vào xào cho săn rồi kho đến khi nước sệt lại.</Text>
                            <Text style={styles.stepText}>1. Rửa sạch thịt, cắt miếng vừa ăn.</Text>
                            <Text style={styles.stepText}>2. Phi thơm mắm ruốc với hành tỏi.</Text>
                            <Text style={styles.stepText}>3. Cho thịt vào xào cho săn rồi kho đến khi nước sệt lại.</Text>
                            <Text style={styles.stepText}>1. Rửa sạch thịt, cắt miếng vừa ăn.</Text>
                            <Text style={styles.stepText}>2. Phi thơm mắm ruốc với hành tỏi.</Text>
                            <Text style={styles.stepText}>3. Cho thịt vào xào cho săn rồi kho đến khi nước sệt lại.</Text>
                            <Text style={styles.stepText}>1. Rửa sạch thịt, cắt miếng vừa ăn.</Text>
                            <Text style={styles.stepText}>2. Phi thơm mắm ruốc với hành tỏi.</Text>
                            <Text style={styles.stepText}>3. Cho thịt vào xào cho săn rồi kho đến khi nước sệt lại.</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#D4E9E1',
    },
    imageContainer: {
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 260,
    },
    backButton: {
        position: 'absolute',
        top: 60,
        left: 20,
        backgroundColor: '#0008',
        borderRadius: 20,
        padding: 6,
    },
    content: {
        padding: 15,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: '#D4E9E1',
        marginTop: -20,
    },
    typeMealContainer: {
        alignSelf: 'flex-start',
        backgroundColor: '#f9eaf1',
        padding: 5,
        borderRadius: 5,
        marginBottom: 15,
    },
    typeMealText: {
        color: '#bf93bd',
        fontSize: 14,
        fontWeight: '500',
    },
    mealName: {
        textAlign: 'left',
        fontSize: 22,
        fontWeight: '700',
        color: '#333',
        marginBottom: 10,
    },

    /** Thời gian */
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start', // Thay đổi từ '' thành 'flex-start'
        marginBottom: 15,
        // paddingHorizontal: 20,
    },
    timeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20, // Thêm khoảng cách giữa 2 item
        // Xóa flex: 1 và justifyContent: 'center'
    },
    timeLabel: {
        fontSize: 14,
        color: '#666',
        marginLeft: 6,
        marginRight: 4,
    },
    timeValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginLeft: 6, // Thêm khoảng cách giữa icon và text
    },

    /** Dinh dưỡng */
    nutritionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 10,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 10
    },
    nutritionItem: {
        alignItems: 'center',
        flex: 1,
        borderLeftWidth: 2,
        borderLeftColor: '#eee',
    },
    nutritionValue: {
        fontSize: 17,
        fontWeight: '700',
        marginBottom: 4,
    },
    nutritionLabel: {
        fontSize: 13,
        color: '#555',
        textAlign: 'center',
    },

    /** Tab tùy chỉnh với animation */
    tabContainer: {
        marginHorizontal: 40,
        marginTop: 15,
        marginBottom: 15,
    },
    tabBackground: {
        backgroundColor: 'rgba(53, 165, 94, 0.1)',
        borderRadius: 20,
        height: 40,
        position: 'relative',
        flexDirection: 'row',
    },
    tabButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    tabIndicator: {
        position: 'absolute',
        width: '46%',
        height: '90%',
        backgroundColor: '#35A55E',
        borderRadius: 18,
        top: '5%',
        zIndex: 1,
    },
    tabText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    activeTabText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    tabContentContainer: {
        minHeight: 200,
    },

    /** Nguyên liệu */
    ingredientList: { borderRadius: 10 },
    ingredientItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowRadius: 3,
        elevation: 0.2,
    },
    ingredientIcon: {
        width: 30,
        height: 30,
        borderRadius: 6
    },
    ingredientName: {
        flex: 1,
        marginLeft: 10,
        fontSize: 14,
        color: '#333',
        fontWeight: '500'
    },
    ingredientAmount: {
        fontSize: 13,
        color: '#666'
    },

    /** Hướng dẫn */
    guideContainer: {
        borderRadius: 10,
        paddingBottom: 50
    },
    stepText: {
        fontSize: 14,
        color: '#333',
        lineHeight: 22,
        marginBottom: 6
    },

    
});
