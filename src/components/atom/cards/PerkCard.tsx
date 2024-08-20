// PerkCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Color from '@/constants/Color';
import { BUTTON_32, CAPTION_1_BOLD } from '@/constants/typography';
import PerkGradientSm from '@/components/icons/PerkGradientSm';

interface PerkCardProps {
  name: string;
  onPress: () => void;
}

const PerkCard: React.FC<PerkCardProps> = ({ name, onPress }) => {
  return (
    <LinearGradient
      colors={[Color.Brand.card.start, Color.Brand.card.end]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.content}
    >
      <TouchableOpacity
        style={styles.touchable}
        onPress={onPress}
      >
        <View style={styles.iconContainer}>
          <PerkGradientSm />
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.perkName}>{name}</Text>
        </View>
        <View style={styles.redeemButton}>
          <Text style={styles.perkPrice}>Redeem</Text>
        </View>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 24,
    padding: 12,
    borderWidth: 1,
    borderColor: Color.Gray.gray400,
  },
  touchable: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconContainer: {
    borderRadius: 8,
    backgroundColor: Color.Gray.gray400,
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  nameContainer: {
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  perkName: {
    ...CAPTION_1_BOLD,
    textAlign: "center",
    color: Color.Gray.gray50,
  },
  redeemButton: {
    backgroundColor: Color.Gray.gray400,
    borderRadius: 24,
    paddingVertical: 8,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  perkPrice: {
    color: Color.base.White,
    ...BUTTON_32,
  },
});

export default PerkCard;