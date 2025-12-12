import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import IngredientsTab from '../(stacks)/about/IngredientsTab';
import MealTab from '../(stacks)/about/MealTab';
import HeaderComponent from '@/components/header/HeaderComponent';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('ingredients');

  return (
    <View style={styles.container}>
      {/* Header */}
      <HeaderComponent style={styles.header}>
        {/* {activeTab === 'ingredients' ? (
          <Text style={styles.headerText}>Danh sách thực phẩm</Text>
        ) : (
          <Text style={styles.headerText}>Danh sách công thức</Text>
        )} */}
      </HeaderComponent>
      {/* Tabs */}
      <View
        style={[
          styles.tabContainer,
          { marginTop: insets.top + 25 }
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
            Món ăn
          </Text>
        </TouchableOpacity>
      </View>
      {/* Nội dung */}
      {activeTab === 'ingredients' ? <IngredientsTab /> : <MealTab />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D4E9E1',
    paddingHorizontal: 15,
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
    borderRadius: 20,
    height: 40,
    width: "100%",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: '#35A55E'
  },
  tabText: {
    fontSize: 15,
    color: '#333',
  },
  activeText: {
    fontWeight: '500',
    color: '#35A55E',
  },
});
