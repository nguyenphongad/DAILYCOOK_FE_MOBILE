import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Component HeaderLeft dùng để hiển thị nút quay lại trong header
 * @param {string} goBack - Đường dẫn để quay lại (mặc định là '/')
 * @param {string} title - Tiêu đề hiển thị bên cạnh icon quay lại (nếu có)
 * @param {function} onGoBack - Callback function khi nhấn nút quay lại (nếu có)
 */
const HeaderLeft = ({ goBack, title, onGoBack }) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const handleGoBack = () => {
    if (typeof onGoBack === 'function') {
      onGoBack();
    } else {
      router.push(goBack || '/');
    }
  };
  
  return (
    <TouchableOpacity 
      style={[styles.headerLeftContainer]} 
      onPress={handleGoBack}
    >
      <Ionicons name="chevron-back" size={23} color="#FFFFFF" />
      {title ? <Text style={styles.headerLeftTitle}>{title}</Text> : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  headerLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  headerLeftTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    marginLeft: 5,
    fontWeight: '500',
  }
});

export default HeaderLeft;
