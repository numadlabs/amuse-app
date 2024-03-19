import Color from '@/app/constants/Color';
import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

interface PrefixProps {
  isVisible: boolean;
  onClose: () => void;
  countries: { name: string; prefix: string }[];
}

const PrefixPopup: React.FC<PrefixProps> = ({ isVisible, onClose, countries }) => {
  return (
    <Modal transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View style={styles.container}>
        <ScrollView>
          {countries.map((country, index) => (
            <TouchableOpacity key={index} style={styles.content}>
              <View style={styles.textContainer}>
                <Text>{country.name}</Text>
                <Text>{`+${country.prefix}`}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
};

export default PrefixPopup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  content: {
    borderWidth: 1,
    borderColor: Color.Gray.gray50,
    justifyContent: 'space-between',
    gap: 16,
    padding: 20,
  },
  textContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
