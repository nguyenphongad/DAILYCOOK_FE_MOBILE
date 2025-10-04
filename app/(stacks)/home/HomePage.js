import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function HomePage() {
  // Mock data cho các công thức nấu ăn
  const recipes = [
    { 
      id: 1, 
      name: 'Phở Bò', 
      time: '60 phút', 
      difficulty: 'Trung bình', 
      image: { uri: 'https://cdn.tgdd.vn/Files/2019/03/07/1153472/chinese-new-year_600x800.jpg' } 
    },
    { 
      id: 2, 
      name: 'Gỏi cuốn', 
      time: '30 phút', 
      difficulty: 'Dễ', 
      image: { uri: 'https://cdn.tgdd.vn/Files/2019/03/07/1153472/chinese-new-year_600x800.jpg' } 
    },
    { 
      id: 3, 
      name: 'Bún chả', 
      time: '45 phút', 
      difficulty: 'Trung bình', 
      image: { uri: 'https://cdn.tgdd.vn/Files/2019/03/07/1153472/chinese-new-year_600x800.jpg' } 
    },
  ];
  
  return (
    <ScrollView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>Khám phá món ngon hôm nay</Text>
        <TouchableOpacity style={styles.bannerButton}>
          <Text style={styles.bannerButtonText}>Xem ngay</Text>
        </TouchableOpacity>
      </View>
      
      {/* Danh mục món ăn */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Danh mục</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          <TouchableOpacity style={styles.categoryItem}>
            <View style={styles.categoryIcon}>
              <Image 
                source={{ uri: 'https://cdn.tgdd.vn/Files/2019/03/07/1153472/chinese-new-year_600x800.jpg' }}
                style={{ width: 40, height: 40, borderRadius: 20 }}
              />
            </View>
            <Text style={styles.categoryText}>Món Việt</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.categoryItem}>
            <View style={styles.categoryIcon}>
              <Image 
                source={{ uri: 'https://cdn.tgdd.vn/Files/2019/03/07/1153472/chinese-new-year_600x800.jpg' }}
                style={{ width: 40, height: 40, borderRadius: 20 }}
              />
            </View>
            <Text style={styles.categoryText}>Món Nhật</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.categoryItem}>
            <View style={styles.categoryIcon}>
              <Image 
                source={{ uri: 'https://cdn.tgdd.vn/Files/2019/03/07/1153472/chinese-new-year_600x800.jpg' }}
                style={{ width: 40, height: 40, borderRadius: 20 }}
              />
            </View>
            <Text style={styles.categoryText}>Món Ý</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.categoryItem}>
            <View style={styles.categoryIcon}>
              <Image 
                source={{ uri: 'https://cdn.tgdd.vn/Files/2019/03/07/1153472/chinese-new-year_600x800.jpg' }}
                style={{ width: 40, height: 40, borderRadius: 20 }}
              />
            </View>
            <Text style={styles.categoryText}>Món chay</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      {/* Công thức nổi bật */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Công thức nổi bật</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>
        
        {recipes.map(recipe => (
          <TouchableOpacity key={recipe.id} style={styles.recipeCard}>
            <Image source={recipe.image} style={styles.recipeImage} />
            <View style={styles.recipeInfo}>
              <Text style={styles.recipeName}>{recipe.name}</Text>
              <View style={styles.recipeDetails}>
                <Text style={styles.recipeDetail}>⏱️ {recipe.time}</Text>
                <Text style={styles.recipeDetail}>📊 {recipe.difficulty}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  banner: {
    backgroundColor: '#35A55E',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 15,
    marginTop: 15,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  bannerButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    color: '#35A55E',
    fontWeight: 'bold',
  },
  section: {
    marginVertical: 15,
    paddingHorizontal: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  seeAll: {
    color: '#35A55E',
    fontWeight: '600',
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  emojiIcon: {
    fontSize: 30,
  },
  categoryText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  recipeCard: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  recipeImage: {
    width: 100,
    height: 100,
  },
  recipeInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  recipeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  recipeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recipeDetail: {
    fontSize: 14,
    color: '#7f8c8d',
  },
});
