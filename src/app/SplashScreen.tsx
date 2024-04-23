import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDecay,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { BlurView } from 'expo-blur';
import ALogo from './components/icons/ALogo';
import Color from './constants/Color';
import { LinearGradient } from 'expo-linear-gradient';

const SIZE = 120;

export default function App() {
  const offset = useSharedValue(0);
  const width = useSharedValue(0);

  const onLayout = (event) => {
    width.value = event.nativeEvent.layout.width;
  };

  const pan = Gesture.Pan()
    .onChange((event) => {
      offset.value += event.changeX;
    })
    .onFinalize((event) => {
      offset.value = withDecay({
        velocity: event.velocityX,
        rubberBandEffect: true,
        clamp: [-(width.value / 2) + SIZE / 2, width.value / 2 - SIZE / 2],
      });

    });

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  return (
    <GestureHandlerRootView style={styles.container}>
      <BlurView onLayout={onLayout} style={styles.wrapper}>
        <GestureDetector gesture={pan}>
          <Animated.View style={[styles.box, animatedStyles]} />
        </GestureDetector>
        <BlurView intensity={80} style={{ overflow: 'hidden', borderRadius: 32 }}>
          <LinearGradient
            colors={[Color.Brand.card.start, Color.Brand.card.end]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0 }}
            style={{ borderRadius: 32, paddingHorizontal: 32, paddingVertical: 48,}}>
            <ALogo />
          </LinearGradient>

        </BlurView>
      </BlurView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  wrapper: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    height: SIZE,
    width: SIZE,
    backgroundColor: '#b58df1',
    borderRadius: 60,
    position: 'absolute',
    alignItems: 'center',
    top: 200,
    justifyContent: 'center',
  },
});
