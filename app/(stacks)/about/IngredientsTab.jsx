import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getRandomIngredients } from '../../../redux/thunk/ingredientThunk';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function IngredientsTab() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Redux selectors
  const {
    randomIngredients,
    randomIngredientsLoading,
    randomIngredientsError,
    randomIngredientsPagination
  } = useSelector((state) => state.ingredient);

  // Load random ingredients khi mount
  useEffect(() => {
    loadIngredients(1);
  }, []);

  const loadIngredients = async (pageNum = 1) => {
    try {
      await dispatch(getRandomIngredients({ page: pageNum, limit: 20 })).unwrap();
      setPage(pageNum);
    } catch (error) {
      console.error('Error loading random ingredients:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadIngredients(1);
    setRefreshing(false);
  };

  // Tắt load more - comment out hoặc xóa hàm này
  // const handleLoadMore = () => {
  //   if (!randomIngredientsLoading && page < randomIngredientsPagination.totalPages) {
  //     loadIngredients(page + 1);
  //   }
  // };

  // Filter ingredients based on search query
  const filteredIngredients = randomIngredients.filter(item =>
    item.nameIngredient.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderIngredientItem = ({ item }) => (
    <TouchableOpacity
      style={styles.ingredientCard}
      activeOpacity={0.7}
      onPress={() => router.push(`/(stacks)/ingredients/IngredientDetail?id=${item._id}`)}
    >
      <Image
        source={
          item.ingredientImage
            ? { uri: item.ingredientImage }
            : require('../../../assets/images/logo.png')
        }
        style={styles.ingredientImage}
      />

      <View style={styles.ingredientInfo}>
        <Text style={styles.ingredientName} numberOfLines={1}>{item.nameIngredient}</Text>
        <Text style={styles.ingredientDescription} numberOfLines={1}>
          {item.description}
        </Text>

        {item.nutrition && (
          <View style={styles.nutritionRow}>
            <Text style={styles.nutritionText}>
              🔥 {Math.round(item.nutrition.calories)} kcal
            </Text>
            <Text style={styles.nutritionText}>
              🥩 {Math.round(item.nutrition.protein)}g
            </Text>
          </View>
        )}
      </View>

      <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
    </TouchableOpacity>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="leaf-outline" size={64} color="#CCCCCC" />
      <Text style={styles.emptyText}>
        {searchQuery ? 'Không tìm thấy nguyên liệu nào' : 'Chưa có nguyên liệu nào'}
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!randomIngredientsLoading) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#35A55E" />
      </View>
    );
  };

  if (randomIngredientsLoading && page === 1) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#35A55E" />
        <Text style={styles.loadingText}>Đang tải nguyên liệu...</Text>
      </View>
    );
  }

  if (randomIngredientsError) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
        <Text style={styles.errorText}>{randomIngredientsError}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => loadIngredients(1)}
        >
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Box */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm nguyên liệu..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

      </View>

      <FlatList
        data={filteredIngredients}
        renderItem={renderIngredientItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyComponent}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#35A55E']}
            tintColor="#35A55E"
          />
        }
      // Tắt load more - comment out onEndReached
      // onEndReached={handleLoadMore}
      // onEndReachedThreshold={0.5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D4E9E1',
  },
  // Search container styles
  searchContainer: {
    flexDirection: 'row',
    padding: 0,
    gap: 10,
    marginBottom: 15,
    marginTop: 15,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f2ed',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 0.2,
    borderRadius: 12,
    paddingHorizontal: 8,
    height: 40,
    borderWidth: 1,
    borderColor: '#35A55E',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#333',
  },

  listContent: {
    padding: 0,
    paddingTop: 0,
    paddingBottom: 80,
  },
  ingredientCard: {
    flexDirection: 'row',
    backgroundColor: '#e6f2ed',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 0.2,
    borderRadius: 12,
    padding: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  ingredientImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  ingredientInfo: {
    flex: 1,
    marginLeft: 12,
  },
  ingredientName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  ingredientDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  nutritionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  nutritionText: {
    fontSize: 12,
    color: '#999',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D4E9E1',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D4E9E1',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#35A55E',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#999',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
