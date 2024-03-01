import Color from '@/app/constants/Color';
import { TickCircle } from 'iconsax-react-native';
import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Animated } from 'react-native';
import Button from '../ui/Button';

interface PopupProps {
  isVisible: boolean;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ isVisible, onClose }) => {
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(
      fadeAnimation,
      {
        toValue: isVisible ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }
    ).start();
  }, [fadeAnimation, isVisible]);

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
        <Animated.View style={{
          opacity: fadeAnimation,
        }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, alignItems: 'center', width: 300, gap: 16 }}>
            <TickCircle size={72} color={Color.System.systemSuccess} />
            <View style={{alignItems: 'center',gap:8, marginBottom:32}}>
              <Text style={{ fontSize: 24, color: Color.Gray.gray600, fontWeight: 'bold' }}>Success</Text>
              <Text style={{ fontSize: 16, color: Color.Gray.gray400, fontWeight: 'normal' }}>Successfully added A-card.</Text>
            </View>
            <Button
              variant='primary'
              textStyle='primary'
              size='default'
              onPress={onClose}
            >Done
            </Button>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default Popup;
