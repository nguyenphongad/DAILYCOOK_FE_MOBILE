import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function SetupScreen() {
  const router = useRouter();
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thiết lập tài khoản</Text>
        
        <TouchableOpacity style={styles.optionItem} onPress={() => router.push('/(auth)/Login')}>
          <Text style={styles.optionText}>Đăng nhập</Text>
          <FontAwesome name="chevron-right" size={16} color="#7f8c8d" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.optionItem}>
          <Text style={styles.optionText}>Thông tin cá nhân</Text>
          <FontAwesome name="chevron-right" size={16} color="#7f8c8d" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cài đặt ứng dụng</Text>
        
        <TouchableOpacity style={styles.optionItem}>
          <Text style={styles.optionText}>Ngôn ngữ</Text>
          <FontAwesome name="chevron-right" size={16} color="#7f8c8d" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.optionItem}>
          <Text style={styles.optionText}>Thông báo</Text>
          <FontAwesome name="chevron-right" size={16} color="#7f8c8d" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Về ứng dụng</Text>
        
        <TouchableOpacity style={styles.optionItem}>
          <Text style={styles.optionText}>Phiên bản 1.0.0</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.optionItem}>
          <Text style={styles.optionText}>Điều khoản sử dụng</Text>
          <FontAwesome name="chevron-right" size={16} color="#7f8c8d" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginVertical: 10,
    paddingVertical: 10,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  optionText: {
    fontSize: 16,
    color: '#34495e',
  }
});
