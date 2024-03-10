import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TouchableWithoutFeedback, ScrollView, Image } from 'react-native';
import Animated, { useSharedValue, withSpring, runOnJS, ReduceMotion } from 'react-native-reanimated';
import { TickCircle, Location, TicketExpired, User } from 'iconsax-react-native';
import Color from '@/app/constants/Color';
import Tick from '../icons/Tick';



interface BottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  benefits: string | string[],
  locations: string | string[],
  memberships: string | string[],
  about: string | string[],
  instruction: string | string[],
  artistInfo: string | string[]
}

const DetailsSheet: React.FC<BottomSheetProps> = ({ isVisible, onClose, benefits, locations, memberships, about, instruction, artistInfo }) => {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withSpring(isVisible ? 0 : 300, {
      mass: 1.5,
      damping: 40,
      stiffness: 398,
      overshootClamping: false,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 20,
      reduceMotion: ReduceMotion.System,
    });
  }, [translateY, isVisible]);

  const handleOutsidePress = () => {
    onClose()
  }

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={handleOutsidePress}>
        <View style={styles.container}>
          <Animated.View style={[styles.bottomSheet, { transform: [{ translateY }] }]}>
            <View style={styles.content}>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>Benefits</Text>
              <View style={{marginVertical:16}}>
                <View style={styles.attribute}>
                  <Tick />
                  <Text style={styles.attributeText}>
                    {benefits}
                  </Text>
                </View>
              </View>
              <View style={{ gap: 16 }}>
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                  Locatons
                </Text>
                <View>
                  <View style={styles.attribute}>
                    <Location color={Color.Gray.gray600} />
                    <Text
                      style={
                        (styles.attributeText,
                          { textDecorationLine: "underline" })
                      }
                    >
                      "{locations}"
                    </Text>
                  </View>
                </View>
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                  Memberships
                </Text>
                <View style={styles.membershipContainer}>
                  <View
                    style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
                  >
                    <TicketExpired color={Color.Gray.gray600} />
                    <Text>Expiry</Text>
                  </View>
                  <View>
                    <Text>{memberships} / free to renew</Text>
                  </View>
                </View>
                <View style={styles.membershipContainer}>
                  <View
                    style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
                  >
                    <User color={Color.Gray.gray600} />
                    <Text>Artist</Text>
                  </View>

                  <View>
                    <Text>{artistInfo}</Text>
                  </View>
                </View>
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                  How it works
                </Text>
                <Text>
                  {instruction}
                </Text>
                <View style={styles.imageContainer}>
                  <Image
                    source={require("@/public/images/qr.png")}
                    style={{ width: "100%", height: "100%", borderRadius: 32 }}
                  ></Image>
                </View>
              </View>
            </View>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  bottomSheet: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
  },
  content: {

  },
  textContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: Color.Gray.gray600,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 16,
    color: Color.Gray.gray400,
    fontWeight: 'normal',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  buttonText: {
    color: Color.System.systemSuccess,
    fontSize: 18,
    fontWeight: 'bold',
  },
  attribute: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  attributeText: {
    color: Color.Gray.gray600,
    fontSize: 16,
  },
  membershipContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  imageContainer: {
    width: "100%",
    height: 200,
   
  },
});

export default DetailsSheet;
