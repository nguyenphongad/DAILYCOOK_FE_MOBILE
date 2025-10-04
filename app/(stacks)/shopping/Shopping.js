import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function Shopping() {
  const [items, setItems] = useState([
    { id: '1', name: 'Thịt bò', amount: '500g', checked: false },
    { id: '2', name: 'Rau cải', amount: '2 bó', checked: true },
    { id: '3', name: 'Trứng', amount: '10 quả', checked: false },
    { id: '4', name: 'Sữa tươi', amount: '1 lít', checked: false },
  ]);
  
  const [newItem, setNewItem] = useState('');
  
  const toggleItem = (id) => {
    const newItems = items.map(item => 
      item.id === id ? {...item, checked: !item.checked} : item
    );
    setItems(newItems);
  };
  
  const addItem = () => {
    if (newItem.trim()) {
      setItems([...items, { 
        id: Date.now().toString(), 
        name: newItem, 
        amount: '', 
        checked: false 
      }]);
      setNewItem('');
    }
  };
  
  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input}
          placeholder="Thêm nguyên liệu mới"
          value={newItem}
          onChangeText={setNewItem}
        />
        <TouchableOpacity style={styles.addButton} onPress={addItem}>
          <FontAwesome name="plus" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.listHeader}>
        <Text style={styles.headerTitle}>Danh sách mua sắm</Text>
        <Text style={styles.headerCount}>{items.filter(item => !item.checked).length} mục cần mua</Text>
      </View>
      
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <TouchableOpacity
              style={[styles.checkbox, item.checked && styles.checkboxChecked]}
              onPress={() => toggleItem(item.id)}
            >
              {item.checked && <FontAwesome name="check" size={14} color="#FFFFFF" />}
            </TouchableOpacity>
            
            <View style={styles.itemInfo}>
              <Text style={[styles.itemName, item.checked && styles.itemChecked]}>
                {item.name}
              </Text>
              {item.amount ? (
                <Text style={styles.itemAmount}>{item.amount}</Text>
              ) : null}
            </View>
            
            <TouchableOpacity onPress={() => deleteItem(item.id)}>
              <FontAwesome name="trash-o" size={20} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  addButton: {
    backgroundColor: '#35A55E',
    width: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  headerCount: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#35A55E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#35A55E',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    color: '#2c3e50',
  },
  itemChecked: {
    textDecorationLine: 'line-through',
    color: '#7f8c8d',
  },
  itemAmount: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
});
