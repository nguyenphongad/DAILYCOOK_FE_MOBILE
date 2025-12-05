// ShoppingScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HeaderComponent from '@/components/header/HeaderComponent';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import SheetComponent from '../../components/sheet/SheetComponent';
import { styles } from '../../styles/ShoppingPage';
import { saveShoppingItems, getShoppingItems } from '../../utils/storage';
import menuData from '../../data/menuIngredients.json';

export default function ShoppingScreen() {
  const insets = useSafeAreaInsets();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  const [shoppingItems, setShoppingItems] = useState([]);
  const [menuIngredients, setMenuIngredients] = useState([]);

  // Load data khi component mount
  useEffect(() => {
    loadData();
  }, []);

  // Save data khi shoppingItems thay đổi
  useEffect(() => {
    if (shoppingItems.length > 0 || menuIngredients.length > 0) {
      const allItems = [...menuIngredients, ...shoppingItems];
      saveShoppingItems(allItems);
    }
  }, [shoppingItems, menuIngredients]);

  const loadData = async () => {
    try {
      const { items, isNewDay } = await getShoppingItems();
      
      if (isNewDay || items.length === 0) {
        // Load menu ingredients nếu là ngày mới hoặc chưa có data
        const menuItems = menuData.menuIngredients.map(item => ({
          ...item,
          completed: false,
          fromMenu: true
        }));
        setMenuIngredients(menuItems);
        setShoppingItems([]);
      } else {
        // Phân tách menu items và user items
        const menuItems = items.filter(item => item.fromMenu);
        const userItems = items.filter(item => !item.fromMenu);
        setMenuIngredients(menuItems);
        setShoppingItems(userItems);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      // Fallback to menu data
      const menuItems = menuData.menuIngredients.map(item => ({
        ...item,
        completed: false,
        fromMenu: true
      }));
      setMenuIngredients(menuItems);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
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
                    <Text style={styles.listItemText}>{item.text}</Text>
                    <View style={styles.menuItemBadge}>
                      <Text style={styles.menuItemBadgeText}>{item.menuName}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
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
                    <Text style={[styles.listItemText, styles.listItemTextCompleted]}>{item.text}</Text>
                    {item.fromMenu && (
                      <View style={styles.menuItemBadge}>
                        <Text style={styles.menuItemBadgeText}>{item.menuName}</Text>
                      </View>
                    )}
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
