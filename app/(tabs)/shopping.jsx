// ShoppingScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, RefreshControl, ActivityIndicator, Modal, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HeaderComponent from '@/components/header/HeaderComponent';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import SheetComponent from '../../components/sheet/SheetComponent';
import { styles } from '../../styles/ShoppingPage';
import { saveShoppingItems, getShoppingItems } from '../../utils/storage';
import { useDispatch, useSelector } from 'react-redux';
import { getMealPlanFromDatabase } from '../../redux/thunk/mealPlanThunk';
import { getIngredientCategoryDetail } from '../../redux/thunk/ingredientThunk';

// Filter Modal Component - Filter trên UI
const FilterModal = ({ visible, onClose, categories, selectedCategories, onToggleCategory, onApply, onClearAll }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.filterModalOverlay}>
        <View style={styles.filterModalContainer}>
          <View style={styles.filterModalHeader}>
            <Text style={styles.filterModalTitle}>Lọc theo danh mục</Text>
            <TouchableOpacity onPress={onClose} style={styles.filterModalCloseButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filterCategoriesList} showsVerticalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.filterCategoryItem,
                  selectedCategories.includes(category.id) && styles.filterCategoryItemSelected
                ]}
                onPress={() => onToggleCategory(category.id)}
              >
                <View style={styles.filterCategoryLeft}>
                  <Text style={styles.filterCategoryName}>
                    {category.name}
                  </Text>
                  <Text style={styles.filterCategoryCount}>
                    ({category.count} món)
                  </Text>
                </View>
                {selectedCategories.includes(category.id) && (
                  <Ionicons name="checkmark-circle" size={24} color="#35A55E" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.filterModalFooter}>
            <TouchableOpacity
              style={styles.filterClearButton}
              onPress={onClearAll}
            >
              <Text style={styles.filterClearButtonText}>Xóa tất cả</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterApplyButton}
              onPress={onApply}
            >
              <Text style={styles.filterApplyButtonText}>
                Áp dụng ({selectedCategories.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Ingredient Card Component - Giảm kích thước
const IngredientCard = ({ item, category, onToggle }) => {
  return (
    <TouchableOpacity
      style={[styles.ingredientCard, item.completed && styles.ingredientCardCompleted]}
      onPress={() => onToggle(item.id)}
    >
      <Image source={{ uri: item.image }} style={styles.ingredientImage} />
      <View style={styles.ingredientInfo}>
        <Text style={[styles.ingredientName, item.completed && styles.ingredientNameCompleted]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.ingredientQuantity}>
          {item.quantity} {item.unit}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.ingredientCheckbox}
        onPress={() => onToggle(item.id)}
      >
        <Ionicons
          name={item.completed ? "checkbox" : "square-outline"}
          size={24}
          color={item.completed ? "#35A55E" : "#CCCCCC"}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default function ShoppingScreen() {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  
  const [shoppingItems, setShoppingItems] = useState([]);
  const [menuIngredients, setMenuIngredients] = useState([]);
  const [isLoadingIngredients, setIsLoadingIngredients] = useState(true);

  // Redux selectors
  const { databaseMealPlan, getMealPlanFromDatabaseLoading } = useSelector(state => state.mealPlan);
  const { ingredientCategoryDetails } = useSelector(state => state.ingredient);

  // Load data khi component mount
  useEffect(() => {
    loadMealPlanAndIngredients();
  }, []);

  // Process ingredients khi có meal plan
  useEffect(() => {
    if (databaseMealPlan && databaseMealPlan.mealPlan) {
      processIngredientsFromMealPlan();
    }
  }, [databaseMealPlan]);

  const loadMealPlanAndIngredients = async () => {
    try {
      setIsLoadingIngredients(true);
      
      // Load meal plan from database - đã có sẵn ingredientDetails
      const today = new Date();
      await dispatch(getMealPlanFromDatabase(today)).unwrap();
      
    } catch (error) {
      console.error('Error loading meal plan:', error);
    } finally {
      setIsLoadingIngredients(false);
    }
  };

  const processIngredientsFromMealPlan = async () => {
    if (!databaseMealPlan || !databaseMealPlan.mealPlan) {
      setIsLoadingIngredients(false);
      return;
    }

    try {
      const ingredientsMap = new Map();
      const categoryIdsToLoad = new Set();

      const EXCLUDED_CATEGORY_ID = '69350f1aae7e4f2cefdfd0e5';

      databaseMealPlan.mealPlan.forEach(mealTime => {
        mealTime.meals.forEach(meal => {
          const mealDetail = meal.mealDetail;
          
          if (mealDetail.ingredientDetails && Array.isArray(mealDetail.ingredientDetails)) {
            mealDetail.ingredientDetails.forEach(ingredientItem => {
              const ingId = ingredientItem.ingredient_id;
              const detail = ingredientItem.detail;
              
              if (!ingId || !detail) return;
              
              const categoryId = detail.ingredientCategory?._id || detail.ingredientCategory;
              
              if (categoryId === EXCLUDED_CATEGORY_ID) {
                console.log(`Excluding ingredient: ${detail.nameIngredient}`);
                return;
              }
              
              // Collect category IDs to load
              if (categoryId) {
                categoryIdsToLoad.add(categoryId);
              }
              
              // Lưu hoặc cộng dồn quantity
              if (!ingredientsMap.has(ingId)) {
                const ingredientData = {
                  id: ingId,
                  ingredientId: ingId,
                  name: detail.nameIngredient,
                  text: detail.nameIngredient,
                  quantity: ingredientItem.quantity || 0,
                  unit: ingredientItem.unit,
                  mealName: mealDetail.nameMeal,
                  image: detail.ingredientImage || 'https://via.placeholder.com/80',
                  completed: false,
                  fromMenu: true,
                  categoryId: categoryId,
                  nutrition: detail.nutrition,
                };
                
                ingredientsMap.set(ingId, ingredientData);
              } else {
                const existing = ingredientsMap.get(ingId);
                if (existing.unit === ingredientItem.unit) {
                  existing.quantity += ingredientItem.quantity || 0;
                }
              }
            });
          }
        });
      });

      // FIX: Load category details TRƯỚC khi set state
      console.log('Loading category details for:', Array.from(categoryIdsToLoad));
      if (categoryIdsToLoad.size > 0) {
        await Promise.all(
          Array.from(categoryIdsToLoad).map(categoryId => 
            dispatch(getIngredientCategoryDetail(categoryId))
          )
        );
      }

      console.log('Total unique ingredients:', ingredientsMap.size);
      console.log('Categories found:', categoryIdsToLoad.size);

      // Load saved shopping items
      const { items } = await getShoppingItems();
      
      // Process menu ingredients
      const processedMenuIngredients = Array.from(ingredientsMap.values()).map(ingredient => {
        const savedItem = items.find(item => item.ingredientId === ingredient.id && item.fromMenu);
        return {
          ...ingredient,
          completed: savedItem?.completed || false,
        };
      });

      const userItems = items.filter(item => !item.fromMenu);

      // FIX: Set state SAU khi đã load xong category details
      setMenuIngredients(processedMenuIngredients);
      setShoppingItems(userItems);
      
      console.log('✅ Processed menu ingredients:', processedMenuIngredients.length);
      console.log('✅ User items:', userItems.length);
      
    } catch (error) {
      console.error('❌ Error processing ingredients:', error);
    } finally {
      // FIX: Đảm bảo set loading = false sau khi xong
      setIsLoadingIngredients(false);
    }
  };

  // Save to storage khi có thay đổi
  useEffect(() => {
    if (menuIngredients.length > 0 || shoppingItems.length > 0) {
      const allItems = [...menuIngredients, ...shoppingItems];
      saveShoppingItems(allItems);
    }
  }, [shoppingItems, menuIngredients]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMealPlanAndIngredients();
    setRefreshing(false);
  };

  const handleAddItem = () => {
    if (inputText.trim()) {
      const newItem = {
        id: Date.now().toString(),
        ingredientId: Date.now().toString(),
        name: inputText.trim(),
        text: inputText.trim(),
        quantity: 1,
        unit: 'cái',
        image: 'https://via.placeholder.com/80',
        fromMenu: false,
        completed: false,
        categoryId: null,
      };
      
      // Thêm vào shoppingItems thay vì ingredients
      setShoppingItems(prevItems => [...prevItems, newItem]);
      setInputText('');
      setIsSheetOpen(false);
    }
  };

  // Toggle ingredient completion
  const toggleIngredient = (id) => {
    // Toggle trong menuIngredients
    setMenuIngredients(prevIngredients => 
      prevIngredients.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
    
    // Toggle trong shoppingItems
    setShoppingItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const toggleCategory = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const applyFilter = () => {
    setShowFilterModal(false);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
  };

  const markAllCompleted = () => {
    // Mark all menu ingredients as completed
    setMenuIngredients(prevIngredients =>
      prevIngredients.map(item => ({ ...item, completed: true }))
    );
    
    // Mark all shopping items as completed
    setShoppingItems(prevItems =>
      prevItems.map(item => ({ ...item, completed: true }))
    );
  };

  // Group by category với safety checks - FIX: lấy title từ Redux store
  const groupIngredientsByCategory = () => {
    const categoryMap = new Map();
    
    // Safety check: đảm bảo menuIngredients là array
    if (!Array.isArray(menuIngredients)) {
      console.warn('menuIngredients is not an array:', menuIngredients);
      return [];
    }
    
    menuIngredients.forEach(ingredient => {
      if (!ingredient || !ingredient.categoryId) return;
      
      if (!ingredient.completed) {
        if (!categoryMap.has(ingredient.categoryId)) {
          // FIX: Lấy category detail từ Redux store (đã load xong)
          const categoryDetail = ingredientCategoryDetails?.[ingredient.categoryId];
          
          categoryMap.set(ingredient.categoryId, {
            id: ingredient.categoryId,
            name: categoryDetail?.title || 'Đang tải...', // Fallback nếu chưa load xong
            ingredients: []
          });
        }
        categoryMap.get(ingredient.categoryId).ingredients.push(ingredient);
      }
    });
    
    // User added items - group vào category "Khác"
    const uncategorizedItems = Array.isArray(shoppingItems) 
      ? shoppingItems.filter(item => !item.completed)
      : [];
      
    if (uncategorizedItems.length > 0) {
      categoryMap.set('other', {
        id: 'other',
        name: 'Danh mục khác',
        ingredients: uncategorizedItems
      });
    }
    
    return Array.from(categoryMap.values());
  };

  // Thêm dependency ingredientCategoryDetails để re-render khi load xong
  const groupedIngredients = React.useMemo(
    () => groupIngredientsByCategory(),
    [menuIngredients, shoppingItems, ingredientCategoryDetails]
  );

  // Get completed items với safety checks
  const completedItems = [
    ...(Array.isArray(menuIngredients) ? menuIngredients : []),
    ...(Array.isArray(shoppingItems) ? shoppingItems : [])
  ].filter(item => item && item.completed);

  // Tạo danh sách categories cho filter modal với safety check
  const availableCategories = (groupedIngredients || []).map(group => ({
    id: group.id,
    name: group.name,
    count: group.ingredients?.length || 0
  }));

  // Filter ingredients theo search và selected categories với safety checks
  const getFilteredGroups = () => {
    let filtered = Array.isArray(groupedIngredients) ? [...groupedIngredients] : [];

    // Filter by search query
    if (searchQuery && searchQuery.trim()) {
      filtered = filtered.map(group => ({
        ...group,
        ingredients: (group.ingredients || []).filter(item =>
          item?.name?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(group => group.ingredients?.length > 0);
    }

    // Filter by selected categories
    if (selectedCategories && selectedCategories.length > 0) {
      filtered = filtered.filter(group => selectedCategories.includes(group.id));
    }

    return filtered;
  };

  const filteredGroups = getFilteredGroups();

  // Loading state
  if (isLoadingIngredients || getMealPlanFromDatabaseLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerText}>Danh sách mua sắm</Text>
          </View>
        </HeaderComponent>
        
        <View style={[styles.loadingContainer, { paddingTop: insets.top + 100 }]}>
          <ActivityIndicator size="large" color="#35A55E" />
          <Text style={styles.loadingText}>Đang tải danh sách nguyên liệu...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <HeaderComponent style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerText}>Danh sách mua sắm</Text>
        </View>
        <TouchableOpacity onPress={markAllCompleted} style={styles.markAllHeaderButton}>
          <Ionicons name="checkmark-done" size={24} color="white" />
        </TouchableOpacity>
      </HeaderComponent>

      {/* Search and Filter Bar */}
      <View style={[styles.searchFilterBar, { marginTop: insets.top + 60 }]}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm nguyên liệu..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[styles.filterButton, selectedCategories.length > 0 && styles.filterButtonActive]}
          onPress={() => setShowFilterModal(true)}
        >
          <Ionicons name="filter" size={20} color={selectedCategories.length > 0 ? "#FFFFFF" : "#35A55E"} />
          {selectedCategories.length > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{selectedCategories.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#35A55E']}
            tintColor="#35A55E"
          />
        }
      >
        {/* Category Sections - Hiển thị filtered groups */}
        {filteredGroups.map(({ id, name, ingredients }) => (
          <View key={id} style={styles.categorySection}>
            <View style={styles.categorySectionHeader}>
              <Ionicons name="list" size={20} color="#35A55E" style={{ marginRight: 8 }} />
              <Text style={styles.categorySectionTitle}>
                {name} ({ingredients.length})
              </Text>
            </View>
            <View style={styles.ingredientsGrid}>
              {ingredients.map((item) => (
                <IngredientCard
                  key={item.id}
                  item={item}
                  onToggle={toggleIngredient}
                />
              ))}
            </View>
          </View>
        ))}

        {/* Empty State */}
        {filteredGroups.length === 0 && completedItems.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={64} color="#CCCCCC" />
            <Text style={styles.emptyText}>
              {searchQuery || selectedCategories.length > 0 
                ? 'Không tìm thấy nguyên liệu nào' 
                : 'Chưa có nguyên liệu nào'}
            </Text>
            <Text style={styles.emptySubtext}>
              {searchQuery || selectedCategories.length > 0 
                ? 'Thử tìm kiếm hoặc bỏ lọc' 
                : 'Tạo thực đơn để thêm nguyên liệu'}
            </Text>
          </View>
        )}

        {/* Completed Section */}
        {completedItems.length > 0 && (
          <View style={styles.categorySection}>
            <View style={styles.categorySectionHeader}>
              <Ionicons name="checkmark-circle" size={24} color="#35A55E" />
              <Text style={styles.categorySectionTitle}>
                Hoàn thành ({completedItems.length})
              </Text>
            </View>
            <View style={styles.ingredientsGrid}>
              {completedItems.map((item) => (
                <IngredientCard
                  key={item.id}
                  item={item}
                  onToggle={toggleIngredient}
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setIsSheetOpen(true)}
      >
        <Ionicons name="add" size={26} color="#fff" />
      </TouchableOpacity>

      {/* Add Item Sheet */}
      <SheetComponent
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        snapPoints={[70]}
      >
        <KeyboardAvoidingView
          style={styles.sheetContent}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <View style={styles.sheetKeyboardView}>
            <Text style={styles.sheetTitle}>Thêm nguyên liệu mới</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Nhập tên nguyên liệu..."
                onSubmitEditing={handleAddItem}
                returnKeyType="done"
                blurOnSubmit={false}
              />
              <TouchableOpacity 
                style={styles.addInputButton}
                onPress={handleAddItem}
                activeOpacity={0.7}
              >
                <Ionicons name="add" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SheetComponent>

      {/* Filter Modal */}
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        categories={availableCategories}
        selectedCategories={selectedCategories}
        onToggleCategory={toggleCategory}
        onApply={applyFilter}
        onClearAll={clearAllFilters}
      />
    </SafeAreaView>
  );
}
