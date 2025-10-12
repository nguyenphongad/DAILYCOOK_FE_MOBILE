// ShoppingScreen.tsx
import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HeaderComponent from '@/components/header/HeaderComponent';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ShoppingScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      {/* Header */}
      <HeaderComponent>
        <Text style={styles.headerText}>Danh sách mua sắm</Text>
      </HeaderComponent>
      {/* Danh sách nguyên liệu */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollContainer}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingTop: insets.top + 40 }
        ]}
      >
        {/* Summary */}
        <View style={styles.summary}>
          <View>
            <View style={styles.summaryDetail}>
              <Ionicons name="cart-outline" size={20} color="#2e7d32" style={{ marginRight: 5 }} />
              <Text style={styles.summaryText}>Tổng số món: 2</Text>
            </View>
            <View style={styles.summaryDetail}>
              <Ionicons name="checkbox" size={20} color="#2e7d32" marginRight={5} />
              <Text style={styles.summaryText}>Đang mua: 1</Text>
            </View>
          </View>
          <TouchableOpacity>
            <Text style={styles.markAll}>Đánh dấu tất cả</Text>
          </TouchableOpacity>
        </View>
        {/* Nhóm 1 */}
        <View style={styles.groupContainer}>
          <Text style={styles.groupTitle}>Thịt, cá, trứng & sữa</Text>

          <View style={[styles.item, styles.itemChecked]}>
            <Ionicons name="checkbox" size={20} color="#2e7d32" />
            <Text style={[styles.itemText, styles.itemTextChecked]}>Thịt lợn</Text>
          </View>

          <View style={styles.item}>
            <Ionicons name="square-outline" size={20} color="#aaa" />
            <Text style={styles.itemText}>Thịt bò</Text>
          </View>
        </View>
      </ScrollView>

      {/* Nút thêm */}
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add" size={26} color="#fff" />
      </TouchableOpacity>

      {/* Nút ẩn */}
      <TouchableOpacity style={styles.hideButton}>
        <Text style={styles.hideButtonText}>Ẩn nguyên liệu đã đánh dấu</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5EEDC',
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '500',
    color: 'white',
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  summaryText: {
    fontSize: 14,
  },
  summaryDetail: {
    flexDirection: 'row',
  },
  markAll: {
    fontSize: 14,
    color: '#2e7d32',
    fontWeight: '500',
  },
  scrollContainer: {
    flex: 1,
    marginTop: 10,
  },
    contentContainer: {
    paddingBottom: 60, 
    
  },
  groupContainer: {
    marginTop: 10,
  },
  groupTitle: {
    fontWeight: '500',
    fontSize: 14,
    marginBottom: 5,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 8,
    marginBottom: 6,
    backgroundColor: '#fff',
  },
  itemChecked: {
    backgroundColor: '#E8F5E9',
    borderColor: '#2e7d32',
  },
  itemText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  itemTextChecked: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  addButton: {
    position: 'absolute',
    bottom: 90,
    right: 25,
    backgroundColor: '#2e7d32',
    borderRadius: 50,
    padding: 16,
    elevation: 4,
  },
  hideButton: {
    position: 'absolute',
    bottom: 110,
    alignSelf: 'center',
  },
  hideButtonText: {
    color: '#2e7d32',
    fontSize: 14,
    fontWeight: '500',
  },
});
