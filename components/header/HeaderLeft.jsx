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
      style={[styles.headerLeftContainer, { marginLeft: 10 }]} 
      onPress={handleGoBack}
    >
      <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
      {title ? <Text style={styles.headerLeftTitle}>{title}</Text> : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  headerLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLeftTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 5,
    fontWeight: '500',
  }
});

export default HeaderLeft;
