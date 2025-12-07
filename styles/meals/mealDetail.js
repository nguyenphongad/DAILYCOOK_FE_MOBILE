import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
        position: 'absolute',
        bottom: 150,
        right: 20,
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
        justifyContent: 'flex-start',
        marginBottom: 15,
    },
    timeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
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
        marginLeft: 6,
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
    nameIngredient: {
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
