import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import RecipesTab from '../(stacks)/about/RecipesTab';
import IngredientsTab from '../(stacks)/about/IngredientsTab';
import HeaderComponent from '@/components/header/HeaderComponent';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('ingredients');

  return (
    <View style={styles.container}>
      {/* Header */}
      <HeaderComponent style={styles.header}>
        {activeTab === 'ingredients' ? (
          <Text style={styles.headerText}>Danh sách thực phẩm</Text>
        ) : (
          <Text style={styles.headerText}>Danh sách công thức</Text>
        )}
      </HeaderComponent>

      <View
        style={[
          styles.tabContainer,
          { marginTop: insets.top + 60 }
        ]}
      >
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'ingredients' && styles.activeTab]}
          onPress={() => setActiveTab('ingredients')}
        >
          <Text style={[styles.tabText, activeTab === 'ingredients' && styles.activeText]}>
            Thực phẩm
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'recipes' && styles.activeTab]}
          onPress={() => setActiveTab('recipes')}
        >
          <Text style={[styles.tabText, activeTab === 'recipes' && styles.activeText]}>
            Công thức
          </Text>
        </TouchableOpacity>
      </View>
      {/* Nội dung */}
      {activeTab === 'ingredients' ? <IngredientsTab /> : <RecipesTab />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2E1',
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '500',
    color: 'white',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#CBEAD0',
    borderRadius: 20,
    marginHorizontal: 40,
    height: 40,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#35A55E',
  },
  tabText: {
    fontSize: 14,
    color: '#333',
  },
  activeText: {
    fontWeight: '500',
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
  },
});
