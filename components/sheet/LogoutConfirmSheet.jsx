import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import SheetComponent from './SheetComponent';

const LogoutConfirmSheet = ({ isOpen, onClose, onConfirm }) => {
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
            onPress={() => {
              onConfirm();
              onClose();
            }}
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
