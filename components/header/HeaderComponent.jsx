import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Component Header đơn giản và linh hoạt, cố định khi scroll
 * @param {node} children - Các thành phần con muốn hiển thị trong header
 * @param {object} style - Style tùy chỉnh cho container
 */
const HeaderComponent = ({ children, style = {} }) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[
      styles.headerContainer, 
      { paddingTop: insets.top }
    ]}>
      <View style={[styles.header, style]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#35A55E',
    zIndex: 1000, // Đảm bảo hiển thị trên các thành phần khác
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 7,
  },
});

export default HeaderComponent;

