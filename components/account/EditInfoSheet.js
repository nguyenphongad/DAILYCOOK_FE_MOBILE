import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const EditInfoSheet = ({ field, fieldData, onSave, onCancel }) => {
  const [value, setValue] = useState(fieldData.value || '');

  const handleSave = () => {
    onSave(field, value);
  };

  const renderEditor = () => {
    if (fieldData.options) {
      // Nếu có options, hiển thị danh sách lựa chọn
      return (
        <View style={styles.optionsContainer}>
          {fieldData.options.map((option) => (
            <TouchableOpacity 
              key={option}
              style={[
                styles.optionButton,
                value === option && styles.selectedOption
              ]}
              onPress={() => setValue(option)}
            >
              <Text style={[
                styles.optionText,
                value === option && styles.selectedOptionText
              ]}>
                {option}
              </Text>
              {value === option && (
                <Ionicons name="checkmark" size={20} color="#38b94a" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      );
    } else {
      // Nếu không có options, hiển thị input text
      return (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={setValue}
          placeholder={`Nhập ${fieldData.label.toLowerCase()}`}
          autoFocus
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cập nhật {fieldData.label}</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={onCancel} style={styles.actionButton}>
            <Text style={styles.cancelText}>Hủy</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSave} style={styles.actionButton}>
            <Text style={styles.saveText}>Lưu</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.content}>
        {renderEditor()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cancelText: {
    fontSize: 16,
    color: '#666',
  },
  saveText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#38b94a',
  },
  content: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginTop: 8,
  },
  optionsContainer: {
    marginTop: 8,
  },
  optionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedOption: {
    backgroundColor: '#f0fff0',
  },
  optionText: {
    fontSize: 16,
  },
  selectedOptionText: {
    color: '#38b94a',
    fontWeight: 'bold',
  },
});

export default EditInfoSheet;
