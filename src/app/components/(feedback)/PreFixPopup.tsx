import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Animated, { useSharedValue, withSpring, useAnimatedStyle, ReduceMotion } from 'react-native-reanimated';

interface PopupProps {
  isVisible: boolean;
  cards: { prefix: string; name: string; }[];
  onClose: () => void;
  onSelect: (selectedPrefix: string) => void;
}

const PreFixPopup: React.FC<PopupProps> = ({ isVisible, cards, onClose, onSelect }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-400); // Initial position, off the screen

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <Animated.View style={[styles.modalContainer, animatedStyle]}>
      <View style={styles.popupContainer}>
        <FlatList
          data={cards}
          keyExtractor={(item) => item.prefix}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.itemContainer} onPress={() => onSelect(item.prefix)}>
              <Text>{item.prefix}</Text>
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  popupContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PreFixPopup;
