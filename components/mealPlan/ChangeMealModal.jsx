import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  StyleSheet,
  Platform,
  ToastAndroid,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { getSimilarMeals, replaceMeal } from '../../redux/thunk/mealPlanThunk';
import { clearSimilarMeals } from '../../redux/slice/mealPlanSlice';

const ChangeMealModal = ({ 
  visible, 
  onClose, 
  currentMeal, 
  servingTime, 
  onMealReplaced 
}) => {
  const dispatch = useDispatch();
  const { similarMeals, similarMealsLoading, replaceMealLoading } = useSelector(
    (state) => state.mealPlan
  );

  const [selectedNewMealId, setSelectedNewMealId] = useState(null);

  // Reset và fetch data khi modal mở
  useEffect(() => {
    if (visible && currentMeal?.id) {
      console.log('Modal opened - Fetching similar meals for:', currentMeal.id);
      setSelectedNewMealId(null);
      dispatch(getSimilarMeals(currentMeal.id));
    }
  }, [visible, currentMeal?.id, dispatch]); // Thêm currentMeal?.id vào dependency

  // Log để debug - QUAN TRỌNG: Log mỗi khi similarMeals thay đổi
  useEffect(() => {
    console.log('=== MODAL STATE UPDATE ===');
    console.log('visible:', visible);
    console.log('similarMealsLoading:', similarMealsLoading);
    console.log('similarMeals:', similarMeals);
    console.log('similarMeals length:', similarMeals?.length);
    console.log('=========================');
  }, [visible, similarMeals, similarMealsLoading]);

  const handleSelectMeal = (mealId) => {
    setSelectedNewMealId(mealId);
  };

  const handleConfirmReplace = async () => {
    if (!selectedNewMealId) {
      if (Platform.OS === 'android') {
        ToastAndroid.show('Vui lòng chọn món thay thế', ToastAndroid.SHORT);
      } else {
        Alert.alert('Thông báo', 'Vui lòng chọn món thay thế');
      }
      return;
    }

    try {
      const today = new Date();
      const dateString = today.toISOString().split('T')[0];

      await dispatch(
        replaceMeal({
          date: dateString,
          servingTime: servingTime,
          oldMealId: currentMeal.id,
          newMealId: selectedNewMealId,
          portionSize: {
            amount: 1,
            unit: 'portion',
          },
        })
      ).unwrap();

      // Get new meal data
      const newMeal = similarMeals.find((meal) => meal._id === selectedNewMealId);

      if (newMeal) {
        const transformedNewMeal = {
          id: newMeal._id,
          name: newMeal.nameMeal,
          description: newMeal.description,
          calories: newMeal.recipeDetail?.nutrition?.calories || 0,
          protein: newMeal.recipeDetail?.nutrition?.protein || 0,
          carbs: newMeal.recipeDetail?.nutrition?.carbs || 0,
          fat: newMeal.recipeDetail?.nutrition?.fat || 0,
          typeMeal: newMeal.mealCategory?.title || 'Món chính',
          imageUrl: newMeal.mealImage
            ? { uri: newMeal.mealImage }
            : require('../../assets/images/food1.png'),
        };

        // Callback to update UI
        if (onMealReplaced) {
          onMealReplaced(currentMeal.id, transformedNewMeal);
        }
      }

      // Show success message
      if (Platform.OS === 'android') {
        ToastAndroid.show('Đổi món thành công!', ToastAndroid.SHORT);
      } else {
        Alert.alert('Thành công', 'Đổi món thành công!');
      }

      onClose();
    } catch (error) {
      console.error('Error replacing meal:', error);
      if (Platform.OS === 'android') {
        ToastAndroid.show('Không thể đổi món: ' + error, ToastAndroid.LONG);
      } else {
        Alert.alert('Lỗi', 'Không thể đổi món: ' + error);
      }
    }
  };

  // FIX: Đảm bảo Modal luôn render content dựa trên state hiện tại
  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      style={{height:600}}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Chọn món thay thế</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Current Meal Info */}
          {currentMeal && (
            <View style={styles.currentMealSection}>
              <Text style={styles.currentMealLabel}>Món hiện tại:</Text>
              <Text style={styles.currentMealName}>{currentMeal.name}</Text>
            </View>
          )}

          {/* Similar Meals List - FIX: Thêm View wrapper với flex */}
          <View style={styles.contentWrapper}>
            {similarMealsLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#35A55E" />
                <Text style={styles.loadingText}>Đang tải món tương tự...</Text>
              </View>
            ) : similarMeals && similarMeals.length > 0 ? (
              <ScrollView 
                style={styles.mealsList} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.mealsListContent}
              >
                <Text style={styles.debugText}>
                  Tìm thấy {similarMeals.length} món tương tự
                </Text>
                {similarMeals.map((meal) => (
                  <TouchableOpacity
                    key={meal._id}
                    style={[
                      styles.mealItem,
                      selectedNewMealId === meal._id && styles.selectedMealItem,
                    ]}
                    onPress={() => handleSelectMeal(meal._id)}
                    activeOpacity={0.7}
                  >
                    <Image
                      source={
                        meal.mealImage
                          ? { uri: meal.mealImage }
                          : require('../../assets/images/food1.png')
                      }
                      style={styles.mealImage}
                    />

                    <View style={styles.mealInfo}>
                      <Text style={styles.mealName}>{meal.nameMeal}</Text>
                      <Text style={styles.mealDescription} numberOfLines={2}>
                        {meal.description}
                      </Text>
                      <View style={styles.nutritionRow}>
                        <Text style={styles.nutritionText}>
                          🔥 {meal.recipeDetail?.nutrition?.calories || 0} kcal
                        </Text>
                        <Text style={styles.nutritionText}>
                          🥩 {meal.recipeDetail?.nutrition?.protein || 0}g
                        </Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.radioButton,
                        selectedNewMealId === meal._id && styles.radioButtonSelected,
                      ]}
                    >
                      {selectedNewMealId === meal._id && (
                        <View style={styles.radioButtonInner} />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={48} color="#CCCCCC" />
                <Text style={styles.emptyText}>Không có món tương tự</Text>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={replaceMealLoading}
            >
              <Text style={styles.cancelButtonText}>Huỷ</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.confirmButton,
                (!selectedNewMealId || replaceMealLoading) &&
                  styles.confirmButtonDisabled,
              ]}
              onPress={handleConfirmReplace}
              disabled={!selectedNewMealId || replaceMealLoading}
            >
              {replaceMealLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.confirmButtonText}>Lưu</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    maxWidth: 500,
    height: 600,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  closeButton: {
    padding: 4,
  },
  currentMealSection: {
    backgroundColor: '#F0F8F0',
    padding: 16,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
  },
  currentMealLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  currentMealName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#35A55E',
  },
  contentWrapper: {
    flex: 1,
    minHeight: 300, // QUAN TRỌNG: Set minHeight
  },
  mealsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  mealsListContent: {
    paddingTop: 16,
    paddingBottom: 16,
    flexGrow: 1, // Thêm flexGrow
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#666666',
  },
  mealItem: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedMealItem: {
    backgroundColor: '#F0F8FF',
    borderColor: '#35A55E',
  },
  mealImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },
  mealInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  mealName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  mealDescription: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 6,
  },
  nutritionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  nutritionText: {
    fontSize: 12,
    color: '#666666',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  radioButtonSelected: {
    borderColor: '#35A55E',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#35A55E',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: '#999999',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#35A55E',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  debugText: {
    fontSize: 14,
    color: '#35A55E',
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default ChangeMealModal;
