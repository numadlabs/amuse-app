import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import React from "react";
import { BlurView } from "expo-blur";
import Color from "@/app/constants/Color";
import { height, scaleHeight } from "@/app/lib/utils";
import { Flash, TicketStar } from "iconsax-react-native";
import { LinearGradient } from "expo-linear-gradient";
import APassStripes from "../../icons/APassStripes";

// In the APassCard component
interface ApassProp {
  name: string;
  image: string;
  onPress: () => void;
  category: string;
  hasBonus: boolean;
  visitCount: number;
}
const APassCard: React.FC<ApassProp> = ({ name, category, image, onPress, hasBonus, visitCount }) => {
  return (
    <>
      <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
        <LinearGradient
          colors={[Color.Brand.card.start, Color.Brand.card.end]}
          style={[styles.aCardContainer]}
        >
          <BlurView intensity={24} style={styles.blurContainer}>
            <View style={{ position: 'absolute', top: 0, right: -20, width: '50%' }}>
              <APassStripes />
            </View>
            <View style={{ flexDirection: 'row', width: '100%', gap: 12, justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center', justifyContent: 'center', alignContent: 'center' }}>
                <Image
                  style={styles.logo}
                  source={{
                    uri: `https://numadlabs-amuse.s3.eu-central-1.amazonaws.com/${image}`,
                  }}
                />
                <View>
                  <Text style={styles.titleText}>{name}</Text>
                  <Text style={[styles.buttonText, { bottom: 5 }]}>{category}</Text>
                </View>
              </View>
              {hasBonus ? <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: Color.Gray.gray400,
                  padding: 8,
                  borderRadius: 12,
                }}
              >
                <TicketStar size={24} color={Color.base.White} />
              </View> : null}
            </View>


            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, rowGap: 12 }}>
              <Image style={{ minWidth: 164, minHeight: 164, borderRadius: 12 }} source={{ uri: `https://numadlabs-amuse.s3.eu-central-1.amazonaws.com/${image}` }} />
              <View style={{ borderWidth: 1, backgroundColor: Color.Gray.gray600, borderColor: Color.Gray.gray400, borderRadius: 12, overflow: 'hidden' }}>
                <LinearGradient
                  colors={[Color.Brand.main.start, Color.Brand.main.end]}
                  style={{ borderRadius: 0, padding: 1 }}>
                  <BlurView>
                    <LinearGradient
                      colors={[Color.Brand.card.start, Color.Brand.card.end]}
                      start={{ x: 1, y: 0 }}
                      end={{ x: 2, y: 1 }}
                      style={{ borderTopStartRadius: 12, borderTopEndRadius: 12, zIndex: 2 }}>
                      <View style={{ padding: 33, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 32, lineHeight: 40, fontWeight: '700', color: Color.base.White }}>
                          {visitCount < 10 ? `0${visitCount}` : visitCount}
                        </Text>
                        <Text style={{ fontSize: 12, lineHeight: 16, fontWeight: '600', color: Color.base.White }}>
                          Check-ins
                        </Text>
                      </View>
                    </LinearGradient>
                  </BlurView>
                </LinearGradient>
                <View style={{ justifyContent: 'center', flexDirection: 'row', gap: 6, alignContent: 'center', alignItems: 'center', marginTop: 8, marginBottom: 12 }}>
                  <Text style={{ fontWeight: '700', fontSize: 14, lineHeight: 18, color: Color.base.White }}>{10 - visitCount}</Text>
                  <Text style={{ fontWeight: '400', fontSize: 10, lineHeight: 12, color: Color.base.White }}>
                    Until next perk
                  </Text>
                </View>
              </View>
            </View>
          </BlurView>
        </LinearGradient>
      </TouchableOpacity>
    </>
  );
};

export default APassCard;

const styles = StyleSheet.create({

  container1: {
    backgroundColor: Color.Gray.gray50,
    height: 380,
    paddingHorizontal: 16,
    borderTopRightRadius: 32,
    borderTopLeftRadius: 32,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    width: "100%",
  },
  aCardContainer: {
    borderWidth: 1,
    backgroundColor: 'transparent',
    borderRadius: 32,
    alignItems: "center",
    marginBottom: "-80%",
    borderColor: Color.Gray.gray400,
    overflow: "hidden",
    height: 264,
  },
  aCardContainer1: {
    backgroundColor: Color.Gray.gray50,
    padding: 20,
    borderRadius: 32,
    alignItems: "center",
    elevation: 3,
    width: "100%",
    marginBottom: "-80%",
    borderWidth: 1,
    borderColor: Color.Gray.gray400,
  },
  blurContainer: {
    columnGap: 20,
    width: "100%",
    flex: 1,
    padding: 20,
  },
  titleText: {
    color: Color.base.White,
    fontSize: 16,
    marginBottom: 10,
    alignSelf: "flex-start",
    fontWeight: "bold",
    width: '100%'
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(33, 33, 33, 0.32)",
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Color.Gray.gray600,
    borderRadius: 48,
    marginTop: 24,
  },
  buttonText: {
    color: Color.Gray.gray50,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "bold",
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
});
