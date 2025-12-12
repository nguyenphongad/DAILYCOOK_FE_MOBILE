// ShoppingScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, RefreshControl, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HeaderComponent from '@/components/header/HeaderComponent';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import SheetComponent from '../../components/sheet/SheetComponent';
import { styles } from '../../styles/ShoppingPage';
import { saveShoppingItems, getShoppingItems } from '../../utils/storage';
import { useDispatch, useSelector } from 'react-redux';
import { getMealPlanFromDatabase } from '../../redux/thunk/mealPlanThunk';

export default function ShoppingScreen() {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  const [shoppingItems, setShoppingItems] = useState([]);
  const [menuIngredients, setMenuIngredients] = useState([]);
  const [isLoadingIngredients, setIsLoadingIngredients] = useState(true);

  // Redux selectors
  const { databaseMealPlan, getMealPlanFromDatabaseLoading } = useSelector(state => state.mealPlan);

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
      // Map để lưu ingredient với quantity và unit
      const ingredientsMap = new Map();

      // Category ID cần loại bỏ (Gia vị/Seasonings)
      const EXCLUDED_CATEGORY_ID = '69350f1aae7e4f2cefdfd0e5';

      databaseMealPlan.mealPlan.forEach(mealTime => {
        mealTime.meals.forEach(meal => {
          const mealDetail = meal.mealDetail;
          
          // Sử dụng ingredientDetails đã có sẵn từ API
          if (mealDetail.ingredientDetails && Array.isArray(mealDetail.ingredientDetails)) {
            mealDetail.ingredientDetails.forEach(ingredientItem => {
              const ingId = ingredientItem.ingredient_id;
              const detail = ingredientItem.detail;
              
              // Validate data
              if (!ingId || !detail) {
                console.warn('Missing ingredient data:', ingredientItem);
                return;
              }
              
              // Kiểm tra và loại bỏ nguyên liệu thuộc category bị exclude
              const categoryId = detail.ingredientCategory?._id || detail.ingredientCategory;
              if (categoryId === EXCLUDED_CATEGORY_ID) {
                console.log(`Excluding ingredient: ${detail.nameIngredient} (Category: ${categoryId})`);
                return; // Skip ingredient này
              }
              
              // Lưu hoặc cộng dồn quantity
              if (!ingredientsMap.has(ingId)) {
                ingredientsMap.set(ingId, {
                  nameIngredient: detail.nameIngredient,
                  quantity: ingredientItem.quantity || 0,
                  unit: ingredientItem.unit,
                  mealName: mealDetail.nameMeal,
                  ingredientImage: detail.ingredientImage,
                  nutrition: detail.nutrition,
                  defaultAmount: detail.defaultAmount,
                  defaultUnit: detail.defaultUnit,
                });
              } else {
                // Nếu đã có, cộng thêm quantity (nếu cùng unit)
                const existing = ingredientsMap.get(ingId);
                if (existing.unit === ingredientItem.unit) {
                  existing.quantity += ingredientItem.quantity || 0;
                }
              }
            });
          }
        });
      });

      console.log('Total unique ingredients (after filtering):', ingredientsMap.size);

      // Load saved shopping items from storage
      const { items } = await getShoppingItems();
      
      // Process menu ingredients
      const processedMenuIngredients = Array.from(ingredientsMap.entries()).map(([ingId, data]) => {
        // Check if this ingredient is completed in saved items
        const savedItem = items.find(item => item.ingredientId === ingId && item.fromMenu);
        
        return {
          id: ingId,
          ingredientId: ingId,
          text: data.nameIngredient,
          quantity: data.quantity,
          unit: data.unit,
          mealName: data.mealName,
          completed: savedItem?.completed || false,
          fromMenu: true,
          // Thêm thông tin bổ sung để hiển thị sau này nếu cần
          ingredientImage: data.ingredientImage,
          nutrition: data.nutrition,
        };
      });

      // Load user added items (not from menu)
      const userItems = items.filter(item => !item.fromMenu);

      setMenuIngredients(processedMenuIngredients);
      setShoppingItems(userItems);
      
      console.log('✅ Processed menu ingredients:', processedMenuIngredients.length);
      console.log('✅ User items:', userItems.length);
      
    } catch (error) {
      console.error('❌ Error processing ingredients:', error);
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

  const allItems = [...menuIngredients, ...shoppingItems];
  const pendingMenuItems = menuIngredients.filter(item => !item.completed);
  const pendingUserItems = shoppingItems.filter(item => !item.completed);
  const completedItems = allItems.filter(item => item.completed);

  const handleAddItem = () => {
    if (inputText.trim()) {
      const newItem = {
        id: Date.now().toString(),
        text: inputText.trim(),
        completed: false,
        fromMenu: false,
        addedDate: new Date().toISOString()
      };
      setShoppingItems([...shoppingItems, newItem]);
      setInputText('');
      setIsSheetOpen(false);
    }
  };

  const toggleItem = (id, fromMenu = false) => {
    if (fromMenu) {
      setMenuIngredients(menuIngredients.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      ));
    } else {
      setShoppingItems(shoppingItems.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      ));
    }
  };

  const markAllCompleted = () => {
    setMenuIngredients(menuIngredients.map(item => ({ ...item, completed: true })));
    setShoppingItems(shoppingItems.map(item => ({ ...item, completed: true })));
  };

  // Helper function để format unit display
  const formatUnit = (unit) => {
    const unitMap = {
      'GRAM': 'g',
      'KILOGRAM': 'kg',
      'MILLILITER': 'ml',
      'LITER': 'l',
      'UNIT': 'cái',
      'PIECE': 'miếng',
      'TABLESPOON': 'thìa',
      'TEASPOON': 'thìa cà phê',
      'CUP': 'chén'
    };
    
    return unitMap[unit] || unit.toLowerCase();
  };

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

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollContainer}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingTop: insets.top + 40 }
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#35A55E']}
            tintColor="#35A55E"
          />
        }
      >
        {/* Menu Ingredients Section */}
        {pendingMenuItems.length > 0 && (
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Từ thực đơn ({pendingMenuItems.length})</Text>
            <View style={styles.sectionContent}>
              {pendingMenuItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.listItem}
                  onPress={() => toggleItem(item.id, true)}
                >
                  <View style={styles.listItemLeft}>
                    <Ionicons name="square-outline" size={20} color="#aaa" />
                    <View style={styles.listItemTextContainer}>
                      <Text style={styles.listItemText}>
                        {item.text} - {item.quantity} {formatUnit(item.unit)}
                      </Text>
                      <View style={styles.menuItemBadge}>
                        <Text style={styles.menuItemBadgeText}>{item.mealName}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Empty state */}
        {pendingMenuItems.length === 0 && pendingUserItems.length === 0 && completedItems.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={64} color="#CCCCCC" />
            <Text style={styles.emptyText}>Chưa có nguyên liệu nào</Text>
            <Text style={styles.emptySubtext}>Thêm nguyên liệu hoặc tạo thực đơn mới</Text>
          </View>
        )}

        {/* Separator */}
        {pendingMenuItems.length > 0 && pendingUserItems.length > 0 && (
          <View style={styles.separator} />
        )}

        {/* User Added Items Section */}
        {pendingUserItems.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Đang mua ({pendingUserItems.length})</Text>
            <View style={styles.sectionContent}>
              {pendingUserItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.listItem}
                  onPress={() => toggleItem(item.id, false)}
                >
                  <View style={styles.listItemLeft}>
                    <Ionicons name="square-outline" size={20} color="#aaa" />
                    <Text style={styles.listItemText}>{item.text}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Completed Section */}
        {completedItems.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hoàn thành ({completedItems.length})</Text>
            <View style={styles.sectionContent}>
              {completedItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.listItem, styles.listItemCompleted]}
                  onPress={() => toggleItem(item.id, item.fromMenu)}
                >
                  <View style={styles.listItemLeft}>
                    <Ionicons name="checkbox" size={20} color="#35A55E" />
                    <View style={styles.listItemTextContainer}>
                      <Text style={[styles.listItemText, styles.listItemTextCompleted]}>
                        {item.text}
                        {item.quantity && ` - ${item.quantity} ${formatUnit(item.unit)}`}
                      </Text>
                      {item.fromMenu && (
                        <View style={styles.menuItemBadge}>
                          <Text style={styles.menuItemBadgeText}>{item.mealName}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
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
    </SafeAreaView>
  );
}
