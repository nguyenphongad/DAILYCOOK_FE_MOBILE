import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';

export default function MealDetail1() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('ingredient');

    return (
        <View style={styles.container}>
            {/* Ảnh Header */}
            <View style={styles.imageContainer}>
                <Image source={{ uri: 'https://i.imgur.com/YYR7E5O.jpeg' }} style={styles.image} />
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={26} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Nội dung */}
            <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 100 }}>
                <Text style={styles.mealName}>THỊT KHO MẮM RUỐC</Text>

                {/* Thông tin dinh dưỡng */}
                <View style={styles.nutritionContainer}>
                    {/* Calories */}
                    <View style={styles.nutritionItem}>
                        <View style={[styles.nutritionBar, { backgroundColor: '#D4ED91' }]} />
                        <View style={styles.nutritionTextContainer}>
                            <Text style={styles.nutritionValue}>42 kcal</Text>
                            <Text style={styles.nutritionLabel}>Calories</Text>
                        </View>
                    </View>

                    {/* Protein */}
                    <View style={styles.nutritionItem}>
                        <View style={[styles.nutritionBar, { backgroundColor: '#35A55E' }]} />
                        <View style={styles.nutritionTextContainer}>
                            <Text style={styles.nutritionValue}>3.4g</Text>
                            <Text style={styles.nutritionLabel}>Protein</Text>
                        </View>
                    </View>

                    {/* Carbs */}
                    <View style={styles.nutritionItem}>
                        <View style={[styles.nutritionBar, { backgroundColor: '#FF9500' }]} />
                        <View style={styles.nutritionTextContainer}>
                            <Text style={styles.nutritionValue}>12g</Text>
                            <Text style={styles.nutritionLabel}>Carbs</Text>
                        </View>
                    </View>

                    {/* Fat */}
                    <View style={styles.nutritionItem}>
                        <View style={[styles.nutritionBar, { backgroundColor: '#FF6B6B' }]} />
                        <View style={styles.nutritionTextContainer}>
                            <Text style={styles.nutritionValue}>1g</Text>
                            <Text style={styles.nutritionLabel}>Fat</Text>
                        </View>
                    </View>
                </View>

                {/* Tab chuyển đổi */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === 'ingredient' && styles.activeTab]}
                        onPress={() => setActiveTab('ingredient')}
                    >
                        <Text style={[styles.tabText, activeTab === 'ingredient' && styles.activeText]}>
                            Nguyên liệu
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === 'guide' && styles.activeTab]}
                        onPress={() => setActiveTab('guide')}
                    >
                        <Text style={[styles.tabText, activeTab === 'guide' && styles.activeText]}>
                            Hướng dẫn
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Nội dung Tab */}
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
                    </View>
                )}
            </ScrollView>

            {/* Nút cố định */}
            <TouchableOpacity style={styles.addButtonFixed}>
                <Text style={styles.addButtonText}>Thêm vào thực đơn</Text>
            </TouchableOpacity>
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
    },
    mealName: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        marginBottom: 10,
    },

    /** Dinh dưỡng */
    nutritionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 10,
    },
    nutritionItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    nutritionBar: {
        width: 6,
        height: 45,
        borderRadius: 3,
        marginVertical: 3,
    },
    nutritionTextContainer: {
        marginLeft: 6,
        alignItems: 'center',
    },
    nutritionValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
    },
    nutritionLabel: {
        fontSize: 13,
        color: '#555',
    },
    
    /** Tab */
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'rgba(53, 165, 94, 0.1)',
        borderRadius: 20,
        marginHorizontal: 40,
        height: 40,
        marginBottom: 15,
        marginTop: 15,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 20,
        alignItems: 'center',
    },
    activeTab: {
        backgroundColor: '#35A55E'
    },
    tabText: {
        fontSize: 14,
        color: '#333'
    },
    activeText: {
        fontWeight: '500',
        color: '#fff'
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
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
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
    },
    stepText: {
        fontSize: 14,
        color: '#333',
        lineHeight: 22,
        marginBottom: 6
    },

    /** Nút cố định */
    addButtonFixed: {
        position: 'absolute',
        bottom: 60,
        left: 20,
        right: 20,
        backgroundColor: '#35A55E',
        paddingVertical: 12,
        borderRadius: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});
