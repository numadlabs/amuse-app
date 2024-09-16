import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import Color from "@/constants/Color";
import { width } from "@/lib/utils";
import { TicketStar } from "iconsax-react-native";
import { LinearGradient } from "expo-linear-gradient";
import APassStripes from "../../icons/APassStripes";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { SERVER_SETTING } from "@/constants/serverSettings";
import { BODY_1_BOLD, BODY_2_BOLD, CAPTION_1_MEDIUM, CAPTION_1_REGULAR, H3, STYLIZED_UPPERCASE_REGULAR } from "@/constants/typography";

const AnimatedText = Animated.createAnimatedComponent(Text);

interface ApassProp {
  name: string;
  image: string;
  nftImage: string;
  onPress: () => void;
  category: string;
  hasBonus: boolean;
  visitCount: number | undefined;
  target?: number | undefined;
  isLoading: boolean;
}
const SkeletonLoader: React.FC = () => {
  const translateX = useSharedValue(-width);

  React.useEffect(() => {
    translateX.value = withRepeat(
      withTiming(width, { duration: 1000 }),
      -1,
      false
    );
  }, []);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={styles.skeletonContainer}>
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyles]}>
        <LinearGradient
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={['transparent', 'rgba(255, 255, 255, 0.3)', 'transparent']}
        />
      </Animated.View>
      <Animated.View style={styles.skeletonHeader}>
        <Animated.View style={styles.skeletonLogo} />
        <Animated.View>
          <Animated.View style={styles.skeletonTitle} />
          <Animated.View style={styles.skeletonSubtitle} />
        </Animated.View>
      </Animated.View>
      <Animated.View style={styles.skeletonContent}>
        <Animated.View style={styles.skeletonImage} />
        <Animated.View style={styles.skeletonStats}/>
      </Animated.View>
    </Animated.View>
  );
};
const APassCard: React.FC<ApassProp> = ({
  name,
  category,
  image,
  onPress,
  hasBonus,
  visitCount,
  nftImage,
  target,
  isLoading = false,
}) => {
  const pressed = useSharedValue(false);

  const tap = Gesture.Tap()
    .onBegin(() => {
      pressed.value = true;
    })
    .onFinalize(() => {
      pressed.value = false;
    });

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { scale: withTiming(pressed.value ? 0.95 : 1, { duration: 100 }) },
    ],
  }));

  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={tap}>
        <TouchableOpacity activeOpacity={1} onPress={onPress}>
          <Animated.View style={[animatedStyles]}>
            <LinearGradient
              colors={[Color.Brand.card.start, Color.Brand.card.end]}
              style={[styles.aCardContainer]}
            >
              <View style={styles.blurContainer}>
                <View style={styles.stripeContainer}>
                  <APassStripes />
                </View>

                <View style={styles.headerContainer}>
                  <View style={styles.headerContent}>
                    <Image
                      style={styles.logo}
                      source={{
                        uri: `${SERVER_SETTING.CDN_LINK}${image}`,
                      }}
                    />
                    <View>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={styles.titleText}
                      >
                        {name}
                      </Text>
                      <Text style={[styles.buttonText, { bottom: 5 }]}>
                        {category?.replace(/_/g, " ")}
                      </Text>
                    </View>
                  </View>
                  {hasBonus && (
                    <View style={styles.bonusContainer}>
                      <TicketStar size={24} color={Color.base.White} />
                    </View>
                  )}
                </View>
                
                <View style={styles.contentContainer}>
                  <Image
                    style={styles.nftImage}
                    source={{
                      uri: `${SERVER_SETTING.CDN_LINK}${nftImage}`,
                    }}
                  />
                  <View style={styles.gradientBoxContainer}>
                    <LinearGradient
                      colors={[Color.Brand.card.start, Color.Brand.card.start]}
                      start={{ x: 1, y: 0 }}
                      end={{ x: 2, y: 1 }}
                      style={styles.gradientBox}
                    >
                      <View style={styles.checkInsContainer}>
                        <AnimatedText
                          entering={FadeIn}
                          exiting={FadeOut}
                          style={styles.checkInsNumber}
                        >
                          {visitCount < 10 ? `0${visitCount}` : visitCount}
                        </AnimatedText>
                        <Text style={styles.checkInsText}>
                          Check-ins
                        </Text>
                      </View>
                      
                      {hasBonus && (
                        <View style={styles.bonusInfoContainer}>
                          <AnimatedText
                            entering={FadeIn}
                            exiting={FadeOut}
                            style={[styles.bonusNumber, animatedStyles]}
                          >
                            {target}
                          </AnimatedText>
                          <Text style={styles.bonusText}>
                            Until next perk
                          </Text>
                        </View>
                      )}
                    </LinearGradient>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  aCardContainer: {
    borderWidth: 1,
    backgroundColor: Color.Gray.gray500,
    borderRadius: 24,
    alignItems: "center",
    borderColor: Color.Gray.gray400,
    height: "auto",
  },
  blurContainer: {
    backgroundColor: Color.Gray.gray500,
    width: "100%",
    flex: 1,
    padding: 20,
    borderRadius: 28,
    overflow: "hidden",
    height: "auto",
  },
  stripeContainer: {
    position: "absolute",
    top: 25,
    right: -120,
    transform: [{ rotate: "270deg" }],
  },
  headerContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 16,
  },
  headerContent: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  titleText: {
    color: Color.base.White,
    marginBottom: 10,
    ...BODY_1_BOLD,
    width: 210,
  },
  buttonText: {
    color: Color.Gray.gray50,
    ...STYLIZED_UPPERCASE_REGULAR,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  bonusContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Color.Gray.gray400,
    padding: 8,
    borderRadius: 12,
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    gap: 16,
  },
  nftImage: {
    width: width / 2.1,
    aspectRatio: 1,
    borderRadius: 12,
  },
  gradientBoxContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: Color.Gray.gray400,
    borderRadius: 12,
    overflow: "hidden",
  },
  gradientBox: {
    flex: 1,
    justifyContent: "space-between",
  },
  checkInsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  checkInsNumber: {
    ...H3,
    color: Color.base.White,
  },
  checkInsText: {
    ...CAPTION_1_MEDIUM,
    color: Color.base.White,
  },
  bonusInfoContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    borderTopWidth: 1,
    borderColor: Color.Gray.gray400,
    paddingVertical: 10,
  },
  bonusNumber: {
    ...BODY_2_BOLD,
    color: Color.base.White,
  },
  bonusText: {
    ...CAPTION_1_REGULAR,
    color: Color.base.White,
  },
  skeletonContainer: {
    backgroundColor: Color.Gray.gray500,
    borderRadius: 24,
    padding: 20,
    height: 'auto',
    overflow: 'hidden',
  },
  skeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  skeletonLogo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Color.Gray.gray400,
    marginRight: 12,
  },
  skeletonTitle: {
    width: 150,
    height: 20,
    backgroundColor: Color.Gray.gray400,
    marginBottom: 5,
  },
  skeletonSubtitle: {
    width: 100,
    height: 16,
    backgroundColor: Color.Gray.gray400,
  },
  skeletonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skeletonImage: {
    width: width / 2.1,
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: Color.Gray.gray400,
  },
  skeletonStats: {
    width: "38%",
    borderRadius: 12,
    backgroundColor: Color.Gray.gray400,
  },
});

export default APassCard;