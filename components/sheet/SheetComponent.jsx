import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Sheet } from '@tamagui/sheet';

const SheetComponent = ({ 
  isOpen, 
  onClose, 
  children, 
  snapPoints = [25, 40, 90], 
  position = 0 
}) => {
  return (
    <Sheet
      forceRemoveScrollEnabled={isOpen}
      modal={true}
      open={isOpen}
      onOpenChange={onClose}
      snapPoints={snapPoints}
      position={position}
      dismissOnSnapToBottom
      zIndex={100000}
    >
      <Sheet.Overlay 
        animation="lazy" 
        enterStyle={{ opacity: 0 }} 
        exitStyle={{ opacity: 0 }}
        style={styles.overlay}
      />
      <Sheet.Handle style={styles.handle} />
      <Sheet.Frame animation="lazy" style={styles.frame}>
        {children}
      </Sheet.Frame>
    </Sheet>
  );
};

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  handle: {
    height: 4,
    width: 40,
    backgroundColor: '#CCCCCC',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10
  },
  frame: {
    padding: 16,
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  }
});

export default SheetComponent;
