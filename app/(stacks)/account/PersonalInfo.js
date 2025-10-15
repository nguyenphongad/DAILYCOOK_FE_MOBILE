import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import SheetComponent from '../../../components/sheet/SheetComponent';
import EditInfoSheet from '../../../components/account/EditInfoSheet';
import HeaderLeft from '../../../components/header/HeaderLeft';
import HeaderComponent from '../../../components/header/HeaderComponent';

const PersonalInfo = () => {
  const router = useRouter();
  const [isEdit, setIsEdit] = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  
  // Personal info data structure with JSON
  const [personalInfo, setPersonalInfo] = useState({
    bmi: {
      value: 22.82,
      label: 'Tính BMI trung bình',
      isEditable: false,
    },
    gender: {
      value: 'Nữ',
      label: 'Giới tính',
      options: ['Nam', 'Nữ'],
      isEditable: true,
    },
    age: {
      value: '25',
      label: 'Tuổi',
      isEditable: true,
    },
    height: {
      value: '165 cm',
      label: 'Chiều cao',
      isEditable: true,
    },
    weight: {
      value: '62 kg',
      label: 'Cân nặng',
      isEditable: true,
    },
    targetWeight: {
      value: '55 kg',
      label: 'Cân nặng mục tiêu',
      isEditable: true,
    },
    activityLevel: {
      value: 'Trung bình',
      label: 'Mức độ hoạt động',
      options: ['Nhẹ', 'Trung bình', 'Nặng', 'Rất nặng'],
      isEditable: true,
    },
  });

  // Handler functions
  const handleGoBack = () => {
    console.log('Going back');
    router.back();
  };

  const handleToggleEdit = () => {
    console.log('Toggle edit mode');
    setIsEdit(!isEdit);
  };

  const handleUpdateInfo = (key, value) => {
    console.log(`Updating ${key} to ${value}`);
    setPersonalInfo(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        value: value
      }
    }));
    setSheetVisible(false);
  };

  const handleOpenEditSheet = (key, item) => {
    if (item.isEditable) {
      setSelectedField({ key, item });
      setSheetVisible(true);
    }
  };

  const renderInfoItem = (key, item) => {
    const icon = getIconForInfoType(key);
    
    return (
      <TouchableOpacity 
        key={key}
        style={styles.infoItem} 
        onPress={() => handleOpenEditSheet(key, item)}
        disabled={!item.isEditable}
      >
        {icon}
        <Text style={styles.infoLabel}>{item.label}</Text>
        <View style={styles.infoValueContainer}>
          <Text style={styles.infoValue}>{item.value}</Text>
          {item.isEditable && (
            <Ionicons name="chevron-forward" size={24} color="#888" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Helper function for icons
  const getIconForInfoType = (type) => {
    switch(type) {
      case 'bmi':
        return <Ionicons name="body-outline" size={24} color="#38b94a" style={styles.icon} />;
      case 'gender':
        return <Ionicons name="male-female-outline" size={24} color="#38b94a" style={styles.icon} />;
      case 'age':
        return <Ionicons name="calendar-outline" size={24} color="#38b94a" style={styles.icon} />;
      case 'height':
        return <Ionicons name="resize-outline" size={24} color="#38b94a" style={styles.icon} />;
      case 'weight':
        return <Ionicons name="fitness-outline" size={24} color="#38b94a" style={styles.icon} />;
      case 'targetWeight':
        return <Ionicons name="trending-down-outline" size={24} color="#38b94a" style={styles.icon} />;
      case 'activityLevel':
        return <Ionicons name="walk-outline" size={24} color="#38b94a" style={styles.icon} />;
      default:
        return <Ionicons name="information-circle-outline" size={24} color="#38b94a" style={styles.icon} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <HeaderComponent>
        <HeaderLeft onGoBack={handleGoBack} title="Thông tin cá nhân" />
      </HeaderComponent>

      <ScrollView style={styles.content}>
        {/* Info message */}
        <View style={styles.infoMessage}>
          <Text style={styles.infoMessageText}>
            Chúng tôi dựa các thông tin cơ bản dưới để tạo kế hoạch các thực đơn hàng hàng ngày:
          </Text>
        </View>
        
        {/* BMI Section */}
        <View style={styles.bmiContainer}>
          <Text style={styles.bmiLabel}>{personalInfo.bmi.label}</Text>
          <View style={styles.bmiValueContainer}>
            <Text style={styles.bmiValue}>{personalInfo.bmi.value}</Text>
          </View>
        </View>

        {/* Personal Info List */}
        <View style={styles.infoList}>
          {Object.entries(personalInfo).map(([key, item]) => {
            if (key !== 'bmi') {
              return renderInfoItem(key, item);
            }
            return null;
          })}
        </View>
      </ScrollView>

      {/* Sheet for editing info */}
      <SheetComponent 
        isOpen={sheetVisible} 
        onClose={() => setSheetVisible(false)}
        snapPoints={[60]}
      >
        {selectedField && (
          <EditInfoSheet 
            field={selectedField.key} 
            fieldData={selectedField.item} 
            onSave={handleUpdateInfo}
            onCancel={() => setSheetVisible(false)}
          />
        )}
      </SheetComponent>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F1E5',
  },
  content: {
    flex: 1,
    padding: 16,
    marginTop: 70, // Thêm margin top để tránh bị che bởi HeaderComponent
  },
  infoMessage: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoMessageText: {
    fontSize: 14,
    color: '#333',
  },
  bmiContainer: {
    backgroundColor: '#b3e6f3',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  bmiLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  bmiValueContainer: {
    backgroundColor: 'white',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: '100%',
    alignItems: 'center',
  },
  bmiValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoList: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  icon: {
    marginRight: 10,
  },
  infoLabel: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  infoValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoValue: {
    fontSize: 16,
    color: '#888',
    marginRight: 8,
  },
});

export default PersonalInfo;
