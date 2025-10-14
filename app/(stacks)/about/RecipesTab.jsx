import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';

export default function RecipesTab() {
    return (
        <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.card}>
                <Text>🍳 Trứng chiên rau củ</Text>
            </View>
            <View style={styles.card}>
                <Text>🍜 Mì xào hải sản</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    card: {
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
    },
});
