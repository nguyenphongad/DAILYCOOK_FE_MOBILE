import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HeaderComponent from '../../../components/header/HeaderComponent';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function IngredientDetail() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const params = useLocalSearchParams();

    // Parse lại mảng công dụng
    const commonUses = params.commonUses ? JSON.parse(params.commonUses) : [];

    return (
        <View style={styles.container}>
            {/* Header */}
            <HeaderComponent>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={28} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{params.nameIngredient}</Text>
            </HeaderComponent>

            {/* Nội dung */}
            <ScrollView
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingTop: insets.top + 40 }
                ]}
            >
                {/* Ảnh */}
                <Image source={{ uri: params.ingredientImage }} style={styles.image} />

                <View style={styles.content}>
                    <Text style={styles.category}>Nhóm: {params.ingredientCategory}</Text>
                    <Text style={styles.description}>{params.description}</Text>

                    {/* Dinh dưỡng */}
                    <Text style={styles.sectionTitle}>
                        Giá trị dinh dưỡng (trong {params.defaultAmount}{params.defaultUnit})
                    </Text>

                    <View style={styles.nutritionContainer}>
                        {/* Calories */}
                        <View style={styles.nutritionItemCalories}>
                            <Text style={styles.nutritionValue}>{params.calories}</Text>
                            <Text style={styles.nutritionName}>Calories</Text>
                        </View>

                        {/* 3 nhóm còn lại */}
                        <View style={styles.nutritionItems}>
                            <View style={styles.nutritionItem}>
                                <Text style={styles.nutritionValue}>{params.protein}g</Text>
                                <Text style={styles.nutritionName}>Protein</Text>
                                <View style={[styles.nutritionBar, styles.proteinBar]} />
                            </View>

                            <View style={styles.nutritionItem}>
                                <Text style={styles.nutritionValue}>{params.carbs}g</Text>
                                <Text style={styles.nutritionName}>Carbs</Text>
                                <View style={[styles.nutritionBar, styles.carbsBar]} />
                            </View>

                            <View style={styles.nutritionItem}>
                                <Text style={styles.nutritionValue}>{params.fat}g</Text>
                                <Text style={styles.nutritionName}>Fat</Text>
                                <View style={[styles.nutritionBar, styles.fatBar]} />
                            </View>
                        </View>
                    </View>

                    {/* Công dụng */}
                    {commonUses.length > 0 && (
                        <>
                            <Text style={styles.sectionTitle}>Công dụng phổ biến</Text>
                            <View style={styles.usesContainer}>
                                {commonUses.map((use, index) => (
                                    <View key={index} style={styles.useChip}>
                                        <Text style={styles.useText}>{use}</Text>
                                    </View>
                                ))}
                            </View>
                        </>
                    )}

                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#D4E9E1'
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 30,
    },
    image: {
        width: '100%',
        height: 230,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 5,
        elevation: 5,
    },
    content: {
        padding: 16,
    },
    category: {
        textAlign: 'right',
        fontSize: 13,
        color: '#35A55E',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#35A55E',
        marginTop: 16,
        marginBottom: 8,
    },
    description: {
        textAlign: 'justify',
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
        marginBottom: 4,
    },
    nutritionContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    nutritionItemCalories: {
        alignItems: 'center',
        width: '100%',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: '#8e8e8eff',
    },
    nutritionItems: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '85%',
        marginTop: 15,
    },
    nutritionItem: {
        alignItems: 'center',
        width: '30%',
    },
    nutritionValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    nutritionName: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    nutritionBar: {
        width: '100%',
        height: 4,
        borderRadius: 2,
        marginTop: 5,
    },
    proteinBar: {
        backgroundColor: '#35A55E',
    },
    carbsBar: {
        backgroundColor: '#FF9500',
    },
    fatBar: {
        backgroundColor: '#FF6B6B',
    },
    usesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },

    useChip: {
        backgroundColor: 'rgba(53, 165, 94, 0.1)', 
        borderRadius: 16,
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginRight: 8,
        marginBottom: 8,
    },
    useText: {
        fontSize: 13,
        color: '#333',
    },

});
