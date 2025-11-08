import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SheetComponent from '../sheet/SheetComponent';

const ChangeMealSheet = ({ isOpen, onClose, currentMeal, alternativeMeals, onMealChange }) => {
  const [selectedMealId, setSelectedMealId] = useState(currentMeal?.id || null);

  const handleMealSelect = (mealId) => {
    setSelectedMealId(mealId);
  };

  const handleConfirmChange = () => {
    const selectedMeal = alternativeMeals.find(meal => meal.id === selectedMealId);
    if (selectedMeal && onMealChange) {
      onMealChange(selectedMeal);
    }
    onClose();
  };

  const renderMealOption = (meal) => (
    <TouchableOpacity
      key={meal.id}
      style={styles.mealOption}
      onPress={() => handleMealSelect(meal.id)}
      activeOpacity={0.8}
    >
      <View style={styles.mealContent}>
        <Image source={meal.imageUrl} style={styles.mealImage} />
        
        {/* Radio button ở góc trên phải */}
        <View style={styles.radioContainer}>
          <View style={[
            styles.radioButton,
            selectedMealId === meal.id && styles.radioButtonSelected
          ]}>
            {selectedMealId === meal.id && (
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            )}
          </View>
        </View>
        
        <View style={styles.mealInfo}>
          <Text style={styles.mealName}>{meal.name}</Text>
          <Text style={styles.mealDescription}>{meal.description}</Text>
          
          <View style={styles.mealMacros}>
            <Text style={styles.mealMacro}>🔥 {meal.calories} kcal</Text>
            <Text style={styles.mealMacro}>🥩 {meal.protein}g</Text>
            <Text style={styles.mealMacro}>🍚 {meal.carbs}g</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SheetComponent
      isOpen={isOpen}
      onClose={onClose}
      snapPoints={[80, 80]}
      position={0}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Đổi món ăn</Text>
        <Text style={styles.subtitle}>Chọn món ăn thay thế phù hợp</Text>
        
        <View style={styles.mealsContainer}>
          {alternativeMeals.map(renderMealOption)}
        </View>
        
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmChange}
          activeOpacity={0.8}
        >
          <Text style={styles.confirmButtonText}>Đổi món</Text>
          <Ionicons name="swap-horizontal" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SheetComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  mealsContainer: {
    flex: 1,
    marginBottom: 20,
  },
  mealOption: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  mealContent: {
    flexDirection: 'row',
    padding: 12,
    position: 'relative',
  },
  mealImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  radioContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 2,
    borderColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    backgroundColor: '#35A55E',
    borderColor: '#35A55E',
  },
  mealInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  mealDescription: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 8,
    lineHeight: 18,
  },
  mealMacros: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mealMacro: {
    fontSize: 12,
    color: '#666666',
  },
  confirmButton: {
    flexDirection: 'row',
    backgroundColor: '#35A55E',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    bottom: 50,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    marginRight: 8,
  },
});

export default ChangeMealSheet;
