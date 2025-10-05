import React from 'react';
import { Modal, View, StyleSheet, Pressable } from 'react-native';

type EmojiPickerProps = {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function EmojiPicker({ isVisible, onClose, children }: EmojiPickerProps) {
  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View style={styles.overlay}>
        <View style={styles.container}>{children}</View>
        <Pressable style={styles.backdrop} onPress={onClose} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#87640bff', 
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '50%',
    zIndex: 2,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(174, 106, 23, 0.3)',
  },
});
