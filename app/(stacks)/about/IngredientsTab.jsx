import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { router } from 'expo-router';

export default function IngredientsTab() {
    const [search, setSearch] = useState('');

    // 🧺 Dữ liệu mẫu (mock data)
    const ingredients = [
        {
            "_id": "1",
            "nameIngredient": "Thịt gà",
            "description": "Thịt gà là thực phẩm gia cầm phổ biến nhất trên thế giới.[3] Do có chi phí thấp và dễ chăn nuôi hơn so với các động vật khác như trâu bò hoặc lợn, nên gà đã trở thành loại thực phẩm không thể thiếu trong ẩm thực của nhiều nền văn hóa trên thế giới, đồng thời thịt của chúng đã được biến tấu để phù hợp với khẩu vị của từng khu vực. Thịt gà có thể được chế biến theo nhiều cách khác nhau tùy theo mục đích của chúng, bao gồm bỏ lò, nướng, quay, chiên hoặc luộc, cùng nhiều phương pháp khác. Kể từ nửa sau của thế kỷ 20, thịt gà chế biến sẵn đã trở thành một mặt hàng chủ yếu của dòng thực phẩm thức ăn nhanh. Loại thịt này đôi khi được coi là tốt cho sức khỏe hơn thịt đỏ, trong đó nồng độ cholesterol và chất béo bão hòa thấp hơn hẳn.",
            "ingredientCategory": "3",
            "ingredientImage": "https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2024/9/16/thit-ga-1726458605898981451967.jpg",
            "defaultAmount": 100,
            "defaultUnit": "g",
            "nutrition": {
                "calories": 239,
                "protein": 27,
                "carbs": 1,
                "fat": 14
            },
            "commonUses": [
                "Xào",
                "Luộc",
                "Nướng"
            ]
        },
        {
            "_id": "2",
            "nameIngredient": "Cà rốt",
            "description": "Rau củ giàu vitamin A",
            "ingredientCategory": "1",
            "ingredientImage": "https://cdn.tienphong.vn/images/7f5c70d3e738104229acfb7638bb6b02ac67c58eec83f4c6727d92353613fbb8196bf8171bdf00ee59e632379267a678db1b10efbc027cba1d42798aca4c668b/Carrots_Nantes1_RYXE.jpg",
            "defaultAmount": 1,
            "defaultUnit": "củ",
            "nutrition": {
                "calories": 41,
                "protein": 1,
                "carbs": 10,
                "fat": 0
            },
            "commonUses": [
                "Xào",
                "Canh",
                "Salad"
            ]
        },
        {
            "_id": "3",
            "nameIngredient": "Sữa tươi TH true MILK",
            "description": "Đồ uống giàu canxi",
            "ingredientCategory": "5",
            "ingredientImage": "https://suachobeyeu.vn/upload/images/sua-tuoi-th-true-milk-co-duong-hop-180ml-4-2.jpg",
            "defaultAmount": 100,
            "defaultUnit": "ml",
            "nutrition": {
                "calories": 42,
                "protein": 3.4,
                "carbs": 5,
                "fat": 1
            },
            "commonUses": [
                "Uống",
                "Pha chế",
                "Làm bánh"
            ]
        },
    ];

    // Hàm điều hướng sang chi tiết
    const handleViewIngredientDetail = (ingredient) => {
        router.push({
            pathname: '/(stacks)/ingredients/IngredientDetail',
            params: {
                _id: ingredient._id,
                nameIngredient: ingredient.nameIngredient,
                ingredientImage: ingredient.ingredientImage,
                description: ingredient.description,
                ingredientCategory: ingredient.ingredientCategory,
                defaultAmount: ingredient.defaultAmount,
                defaultUnit: ingredient.defaultUnit,
                calories: ingredient.nutrition.calories,
                protein: ingredient.nutrition.protein,
                carbs: ingredient.nutrition.carbs,
                fat: ingredient.nutrition.fat,
                commonUses: JSON.stringify(ingredient.commonUses),
            },
        });
    }
    // Lọc theo từ khóa tìm kiếm
    const filteredIngredients = ingredients.filter((item) =>
        item.nameIngredient.toLowerCase().includes(search.toLowerCase())
    );


    return (
        <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            {/* Thanh tìm kiếm + icon sắp xếp */}
            <View style={styles.searchBarContainer}>
                <View style={styles.searchInputContainer}>
                    <Ionicons name="search-outline" size={20} color="#35A55E" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Tìm thực phẩm..."
                        value={search}
                        onChangeText={setSearch}
                        placeholderTextColor="#999"
                    />
                </View>

                <TouchableOpacity style={styles.sortButton}>
                    <Ionicons name="filter-outline" size={22} color="#35A55E" />
                </TouchableOpacity>
            </View>

            {/* Danh sách nguyên liệu */}
            {filteredIngredients.map((ingredient) => (
                <TouchableOpacity
                    key={ingredient.id}
                    style={styles.card}
                    onPress={() => handleViewIngredientDetail(ingredient)}
                >
                    <Image source={{ uri: ingredient.ingredientImage }} style={styles.logo} />
                    <View style={styles.cardContent}>
                        <Text style={styles.title}>{ingredient.nameIngredient}</Text>
                        <Text style={styles.description} numberOfLines={2}>
                            {ingredient.description}
                        </Text>
                    </View>
                </TouchableOpacity>
            ))}

            {filteredIngredients.length === 0 && (
                <Text style={styles.noResult}>Không tìm thấy thực phẩm nào</Text>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        paddingVertical: 20,
    },

    // Thanh tìm kiếm
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    searchInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 42,
        borderWidth: 1,
        borderColor: '#35A55E',
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
        height: 40,
        color: '#333',
    },
    sortButton: {
        marginLeft: 10,
        padding: 8,
        borderRadius: 10,
        backgroundColor: 'rgba(53, 165, 94, 0.1)',
    },

    // Card item
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    logo: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 12,
    },
    cardContent: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#222',
        marginBottom: 4,
    },
    description: {
        fontSize: 13,
        color: '#333',
        lineHeight: 18,
    },
    noResult: {
        textAlign: 'center',
        color: '#666',
        marginTop: 20,
        fontSize: 14,
    },
});
