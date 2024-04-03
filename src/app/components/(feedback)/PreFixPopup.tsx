import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Animated, { useSharedValue, withSpring, useAnimatedStyle, ReduceMotion } from 'react-native-reanimated';

interface PopupProps {
  isVisible: boolean;
  cards: { prefix: string; name: string; }[];
  onClose: () => void;
  onSelect: (selectedPrefix: string) => void;
}

const Popup: React.FC<PopupProps> = ({ isVisible, cards, onClose, onSelect }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-400); // Initial position, off the screen

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  React.useEffect(() => {
    if (isVisible) {
      opacity.value = withSpring(1, {
        mass: 1,
        damping: 15,
        stiffness: 117,
        overshootClamping: false,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 10.86,
        reduceMotion: ReduceMotion.System,
      });
      translateY.value = withSpring(0, {
        mass: 1,
      damping: 15,
      stiffness: 117,
      overshootClamping: false,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 10.86,
      reduceMotion: ReduceMotion.System,
      });
    } else {
      opacity.value = withSpring(-200, {
        mass: 1,
      damping: 15,
      stiffness: 117,
      overshootClamping: false,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 10.86,
      reduceMotion: ReduceMotion.System,
      });
      translateY.value = withSpring(-400, {
        mass: 1,
        damping: 15,
        stiffness: 117,
        overshootClamping: false,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 10.86,
        reduceMotion: ReduceMotion.System,
      });
    }
  }, [isVisible]);

  return (
    <Animated.View style={[styles.modalContainer, animatedStyle]}>
      <View style={styles.popupContainer}>
        <FlatList
          data={cards}
          keyExtractor={(item, index) => index.toString()}
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

export default Popup;
