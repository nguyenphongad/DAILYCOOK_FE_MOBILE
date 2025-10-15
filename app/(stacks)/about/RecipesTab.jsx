import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function RecipesTab() {
    const router = useRouter(); 
    const [search, setSearch] = useState('');

    const recipes = [
        { id: 1, name: 'Cà chua', image: 'https://hips.hearstapps.com/hmg-prod/images/fresh-ripe-watermelon-slices-on-wooden-table-royalty-free-image-1684966820.jpg' },
        { id: 2, name: 'Dưa hấu', image: 'https://cdn.tgdd.vn/2021/09/CookRecipe/GalleryStep/thanh-pham-2295.jpg' },
        { id: 3, name: 'Bông cải', image: 'https://cdn.tgdd.vn/Files/2019/12/24/1227477/cach-lam-mon-salad-bo-xanh-uc-ga-kieu-my-202112240904170093.jpg' },
        { id: 4, name: 'Cà rốt', image: 'https://cdn.tgdd.vn/Files/2021/08/09/1374031/tac-dung-cua-ca-rot-va-cach-lua-chon-bao-quan-ca-rot-tuoi-lau-202108091109488690.jpg' },
        { id: 5, name: 'Ớt chuông', image: 'https://cdn.tgdd.vn/Files/2020/03/16/1240373/ot-chuong-co-tac-dung-gi-cach-bao-quan-ot-chuong-dung-cach-202003160857389765.jpg' },
        { id: 6, name: 'Dưa leo', image: 'https://cdn.tgdd.vn/Files/2021/03/29/1338064/dua-leo-an-song-co-tot-khong-va-nhung-loi-ich-khi-an-dua-leo-moi-ngay-202103291006554580.jpg' },
    ];


    // Hàm điều hướng sang chi tiết
    const handleViewMealDetail = (meals) => {
        router.push({
            pathname: '/(stacks)/meals/MealDetail1',
            params: {
                // mealId: meals.id,
                // mealName: meals.name,
                // mealImage: meals.image,
            },
        });
    }

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
                        placeholder="Tìm món ăn..."
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>

                <TouchableOpacity style={styles.sortButton}>
                    <Ionicons name="filter-outline" size={22} color="#35A55E" />
                </TouchableOpacity>
            </View>

            {/* Danh sách món ăn (3 món / hàng) */}
            <View style={styles.gridContainer}>
                {recipes.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.card}
                        onPress={() => handleViewMealDetail(item)}
                    >
                        <Image source={{ uri: item.image }} style={styles.logo} />
                        <Text style={styles.title}>{item.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView >
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        // paddingHorizontal: 10,
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

    // Lưới món ăn (3 cột)
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        gap: 10,
    },
    card: {
        width: '31%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 8,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    logo: {
        width: '100%',
        height: 80,
        borderRadius: 8,
        marginBottom: 8,
    },
    title: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        textAlign: 'center',
    },
});
