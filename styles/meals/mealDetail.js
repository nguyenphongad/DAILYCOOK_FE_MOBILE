import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#D4E9E1',
        paddingBottom:50
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
        marginBottom: 12
    },

    /** Đánh giá */
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    starsContainer: {
        flexDirection: 'row',
        marginRight: 8,
    },
    ratingText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '600',
    },

    /** Tiêu đề phần */
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#35A55E',
        marginTop: 20,
        marginBottom: 12,
    },

    /** Lưới dinh dưỡng */
    nutritionGridContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 10,
    },
    nutritionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        gap: 8,
    },
    nutritionGridItem: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        padding: 12,
        borderRadius: 12,
        minHeight: 70,
        justifyContent: 'center',
    },
    nutritionGridValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#35A55E',
        marginBottom: 4,
    },
    nutritionGridName: {
        fontSize: 11,
        color: '#666',
        textAlign: 'center',
    },

    stepContainer: {
        marginBottom: 20,
    },
    stepTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    stepDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 22,
        textAlign: 'justify',
    },

    /** Webview */
    webviewSection: {
        marginTop: 20,
    },
    webviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    expandButton: {
        padding: 8,
        backgroundColor: 'rgba(53, 165, 94, 0.1)',
        borderRadius: 8,
    },
    webviewContainer: {
        height: 1200,
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 20,
    },
    webview: {
        flex: 1,
    },
    webviewLoader: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -20,
        marginTop: -20,
    },

    /** Modal styles */
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingTop: 50,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    modalCloseButton: {
        padding: 4,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    modalWebview: {
        flex: 1,
    },
    modalLoadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    modalLoadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#666',
    },
});
