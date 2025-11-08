import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SheetComponent from './SheetComponent';

const MealAcceptedSheet = ({ isOpen, onClose, onGoShopping }) => {
  return (
    <SheetComponent
      isOpen={isOpen}
      onClose={onClose}
      snapPoints={[50, 50]}
      position={0}
    >
      <View style={styles.container}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark" size={32} color="#FFFFFF" />
          </View>
        </View>
        
        {/* Title */}
        <Text style={styles.title}>Đã ghi nhận thực đơn thành công</Text>
        
        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Tất cả các nguyên liệu đã thêm vào danh sách mua sắm
        </Text>
        
        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.closeButtonText}>Đóng</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.shoppingButton}
            onPress={onGoShopping}
            activeOpacity={0.7}
          >
            <Ionicons name="bag-outline" size={20} color="#FFFFFF" />
            <Text style={styles.shoppingButtonText}>Đi chợ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SheetComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  iconContainer: {
    marginBottom: 20,
  },
  successIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#35A55E',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  closeButton: {
    flex: 0.45,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666',
  },
  shoppingButton: {
    flex: 0.45,
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#35A55E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shoppingButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});

export default MealAcceptedSheet;
