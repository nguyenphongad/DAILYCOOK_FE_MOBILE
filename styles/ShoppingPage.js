import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F1E5',
    paddingTop: -40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerLeft: {
    flex: 1,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  markAllHeaderButton: {
    padding: 8,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100,
    paddingHorizontal: 0,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 10,
  },
  summaryLeft: {
    flex: 1,
  },
  summaryDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 11,
    color: '#333',
  },
  markAllButton: {
    padding: 8,
  },
  section: {
    marginTop: 35,
    borderRadius: 8,
    paddingLeft: 10,
    paddingRight: 10,
    marginHorizontal: 10,
  },
  menuSection: {
    marginTop: 20,
    borderRadius: 8,
    paddingLeft: 10,
    paddingRight: 10,
    marginHorizontal: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 20,
    marginHorizontal: 20,
  },
  menuItemBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  menuItemBadgeText: {
    fontSize: 7,
    color: '#35A55E',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  sectionContent: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#ffffff',
    elevation: 0.2,
    borderRadius: 12,
    marginBottom: 10,
  },
  listItemCompleted: {
    backgroundColor: '#E8F5E9',
    borderColor: '#35A55E',
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  listItemText: {
    fontSize: 13,
    color: '#333',
    marginLeft: 12,
  },
  listItemTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  addButton: {
    position: 'absolute',
    bottom: 90,
    right: 25,
    backgroundColor: '#35A55E',
    borderRadius: 50,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  sheetContent: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    paddingBottom: 60,
    minHeight: 300,
  },
  sheetKeyboardView: {
    flex: 1,
    justifyContent: 'flex-start',
    minHeight: 250,
  },
  sheetTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 40,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 40,
    paddingBottom: 30,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 13,
    backgroundColor: '#fff',
    minHeight: 50,
  },
  addInputButton: {
    backgroundColor: '#35A55E',
    borderRadius: 8,
    padding: 14,
    minWidth: 50,
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D4E9E1',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    textAlign: 'center',
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
  },
  listItemTextContainer: {
    flex: 1,
    marginLeft: 12,
  },

  // Search and Filter
  searchFilterBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F7F1E5',
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#35A55E',
  },
  filterButtonActive: {
    backgroundColor: '#35A55E',
    borderColor: '#35A55E',
  },
  filterBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  filterBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },

  // Category Section
  categorySection: {
    marginBottom: 24,
  },
  categorySectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  categorySectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
  },
  ingredientsGrid: {
    gap: 12,
  },

  // Ingredient Card
  ingredientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f2ed',
    borderRadius: 10,
    padding: 8, // Giảm từ 12 xuống 8
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  ingredientCardCompleted: {
    opacity: 0.6,
    backgroundColor: '#f5f5f5',
  },
  ingredientImage: {
    width: 50, // Giảm từ 80 xuống 50
    height: 50,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    marginRight: 10,
  },
  ingredientInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  ingredientName: {
    fontSize: 14, // Giảm từ 16 xuống 14
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  ingredientNameCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  ingredientQuantity: {
    fontSize: 12, // Giảm từ 13 xuống 12
    color: '#666',
    fontWeight: '500',
  },
  mealBadge: {
    marginTop: 4,
    backgroundColor: 'rgba(53, 165, 94, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  mealBadgeText: {
    fontSize: 10, // Giảm từ 11 xuống 10
    color: '#35A55E',
    fontWeight: '500',
  },
  ingredientCheckbox: {
    padding: 4,
  },

  // Filter Modal
  filterModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  filterModalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
  },
  filterModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  filterModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
  },
  filterModalCloseButton: {
    padding: 4,
  },
  filterCategoriesList: {
    maxHeight: 400,
    padding: 16,
  },
  filterCategoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  filterCategoryItemSelected: {
    backgroundColor: '#E8F5E8',
    borderColor: '#35A55E',
  },
  filterCategoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterCategoryIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  filterCategoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  filterCategoryCount: {
    fontSize: 13,
    color: '#999',
  },
  filterCategoryNameSelected: {
    color: '#35A55E',
    fontWeight: '600',
  },
  filterModalFooter: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  filterClearButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  filterClearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  filterApplyButton: {
    flex: 2,
    backgroundColor: '#35A55E',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  filterApplyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
});
