import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import SheetComponent from './SheetComponent';

const AppInfoSheet = ({ isOpen, onClose }) => {
  return (
    <SheetComponent 
      isOpen={isOpen} 
      onClose={onClose} 
      snapPoints={[92]} 
      position={0}
    >
      <ScrollView style={styles.container}>
        <Text style={styles.title}>KHÓA LUẬN TỐT NGHIỆP - ĐỀ TÀI DAILYCOOK</Text>
        
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Thông tin đề tài</Text>
          <Text style={styles.text}>Đề tài: <Text style={styles.bold}>DailyCook - Thực đơn nhà mình</Text></Text>
          <Text style={styles.text}>Ứng dụng hỗ trợ người dùng lập kế hoạch bữa ăn, gợi ý công thức nấu ăn dựa trên nguyên liệu có sẵn và hỗ trợ quản lý thực phẩm trong gia đình.</Text>
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Sinh viên thực hiện</Text>
          <Text style={styles.text}>• Nguyễn Văn Phong</Text>
          <Text style={styles.text}>• Trần Thị Huyền Trân</Text>
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Giảng viên hướng dẫn</Text>
          <Text style={styles.text}>• ThS. Nguyễn Trọng Tiến</Text>
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Công nghệ sử dụng</Text>
          <Text style={styles.text}>• Front-end: React Native</Text>
          <Text style={styles.text}>• Back-end: Node.js</Text>
          <Text style={styles.text}>• Database: MongoDB</Text>
          <Text style={styles.text}>• AI Integration: OpenAI API</Text>
        </View>

        <TouchableOpacity 
          style={styles.closeButton}
          onPress={onClose}
        >
          <Text style={styles.closeButtonText}>Đóng</Text>
        </TouchableOpacity>
      </ScrollView>
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
    marginBottom: 20,
    textAlign: 'center',
    color: '#35A55E',
  },
  infoSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  text: {
    fontSize: 14,
    marginBottom: 6,
    color: '#555',
    lineHeight: 20,
  },
  bold: {
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#35A55E',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  }
});

export default AppInfoSheet;
