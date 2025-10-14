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

export default function IngredientsTab() {
    const [search, setSearch] = useState('');

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

            {/* Danh sách item */}
            <View style={styles.card}>
                <Image
                    source={{ uri: 'https://hips.hearstapps.com/hmg-prod/images/fresh-ripe-watermelon-slices-on-wooden-table-royalty-free-image-1684966820.jpg?crop=0.6673xw:1xh;center,top&resize=1800:*' }}
                    style={styles.logo}
                />
                <View style={styles.cardContent}>
                    <Text style={styles.title}>Dưa hấu</Text>
                    <Text style={styles.description}>
                        Dưa hấu (Citrullus lanatus) là loại trái cây giải khát giàu nước, giúp thanh nhiệt và cung cấp vitamin A, C.
                    </Text>
                </View>
            </View>
        </ScrollView>
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
});
