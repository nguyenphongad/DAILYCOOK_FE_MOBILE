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
                    <Text style={styles.title}>Cà chua</Text>
                    <Text style={styles.description}>Dưa hấu (tên khoa học là Citrullus lanatus) là một loài thực vật thuộc họ Cucurbitaceae</Text>
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
        paddingHorizontal: 5,
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
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 40,
        borderWidth: 1,
        borderColor: "#35A55E"
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
        textAlignVertical: 'center',
        height: 40,
    },
    sortButton: {
        marginLeft: 10,
        padding: 8,
        borderRadius: 10,
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 10,
    },
    logo: {
        width: 70,
        height: 70,
        marginRight: 10,
        borderRadius: 10
    },
    cardContent: {
        width: "80%",
        marginTop: 10,
    },
    title: {
        fontSize: 15
    },
    description: {
        fontSize: 13,
        color: '#777777',
        marginTop: 3
    },
});
