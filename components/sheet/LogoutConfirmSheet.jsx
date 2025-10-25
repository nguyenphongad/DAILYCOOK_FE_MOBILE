import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ToastAndroid, Platform, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { router } from 'expo-router';
import SheetComponent from './SheetComponent';
import { logoutUser } from '../../redux/thunk/authThunk';

const LogoutConfirmSheet = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      onClose(); // Đóng sheet trước
      await dispatch(logoutUser()).unwrap();
      
      // Hiển thị toast đăng xuất thành công
      if (Platform.OS === 'android') {
        ToastAndroid.show('Đăng xuất thành công!', ToastAndroid.SHORT);
      }
      
      router.replace('/(auth)/Login'); // Chuyển về màn hình login
    } catch (error) {
      console.error('Logout error:', error);
      // Vẫn chuyển về login nếu có lỗi
      router.replace('/(auth)/Login');
    }
  };

  return (
    <SheetComponent 
      isOpen={isOpen} 
      onClose={onClose} 
      snapPoints={[35]} 
      position={0}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Quyết định đăng xuất</Text>
        <Text style={styles.message}>Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]} 
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Huỷ</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.logoutButton]} 
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SheetComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#EEEEEE',
  },
  logoutButton: {
    backgroundColor: '#E86F50',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  }
});

export default LogoutConfirmSheet;
