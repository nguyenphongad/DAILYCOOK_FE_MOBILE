import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

/**
 * Component ButtonComponent với nút quay lại (icon) và nút tiếp theo
 * @param {boolean} enableBack - Hiển thị nút quay lại hay không
 * @param {function} onBack - Callback khi nhấn nút quay lại
 * @param {function} onNext - Callback khi nhấn nút tiếp theo
 * @param {string} nextText - Text cho nút tiếp theo (mặc định: "Tiếp theo")
 * @param {boolean} disableNext - Disable nút tiếp theo
 * @param {string} nextColor - Màu nút tiếp theo (mặc định: "$green10")
 */
const ButtonComponent = ({
  enableBack = true,
  onBack,
  onNext,
  nextText = "Tiếp theo",
  disableNext = false,
  nextColor = "#35A55E",
}) => {
  return (
    <View style={styles.buttonContainer}>
      {enableBack && (
        <Button
          size="$5"
          variant="outlined"
          onPress={onBack}
          style={styles.backButton}
          icon={<Ionicons name="chevron-back" size={20} color="#666" />}
        />
      )}
      
      <Button
        size="$5"
        backgroundColor={nextColor}
        color="white"
        fontWeight={"bold"}
        onPress={onNext}
        disabled={disableNext}
        opacity={disableNext ? 0.5 : 1}
        style={enableBack ? styles.nextButton : styles.nextButtonFull}
      >
        {nextText}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  backButton: {
    width: '20%',
    aspectRatio: 1, // Tạo button vuông
  },
  nextButton: {
    flex: 1,
  },
  nextButtonFull: {
    width: '100%',
  },
});

export default ButtonComponent;
