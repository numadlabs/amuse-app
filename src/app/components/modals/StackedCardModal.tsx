import React from 'react';
import { Dimensions, StyleSheet,Text, TouchableOpacity, View } from 'react-native';
import Color from '@/app/constants/Color';

const { width, height } = Dimensions.get('window');

const StackedCardModal = ({ isVisible, onClose, children }) => {
  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.modal}>
        {children}
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <View style={styles.closeButtonContent}>
            <Text style={styles.closeButtonText}>Close</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default StackedCardModal;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: Color.base.White,
    borderRadius: 8,
    width: width * 0.8,
    padding: 16,
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: Color.Gray.gray50,
    borderRadius: 32,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  closeButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeButtonText: {
    fontWeight: 'bold',
    color: Color.Gray.gray600,
    fontSize: 16,
  },
});