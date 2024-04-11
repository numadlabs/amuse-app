import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Image, ViewStyle, StyleProp } from 'react-native'
import React from 'react'
import { BlurView } from 'expo-blur'
import Color from '@/app/constants/Color'
import { height, scaleHeight } from '@/app/lib/utils';


// In the APassCard component
interface ApassProp {
  name: string;
  image: string;
  onPress: () => void;
  category: string;
}
const APassCard: React.FC<ApassProp> = ({ name, category, image, onPress }) => {
  return (
    <>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
      >

        <ImageBackground resizeMode='cover' source={{ uri: `https://numadlabs-amuse.s3.eu-central-1.amazonaws.com/${image}` }}
          style={[
            styles.aCardContainer
          ]}>
          <View style={styles.overlay} />
          <BlurView intensity={20} style={styles.blurContainer}>
            <Text style={styles.titleText}>{name}</Text>
            <Text style={[styles.buttonText, { bottom: 5 }]}>{category}</Text>
            <View style={{ alignItems: 'center' }}>
              <Image style={styles.image} source={{ uri: `https://numadlabs-amuse.s3.eu-central-1.amazonaws.com/${image}` }} />
            </View>
          </BlurView>
        </ImageBackground>
      </TouchableOpacity>
    </>
  )
}

export default APassCard

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.Gray.gray50,
    borderTopRightRadius: 32,
    borderTopLeftRadius: 32,
    minHeight: 380,
    maxHeight: 600,
  },
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
    backgroundColor: Color.Gray.gray50,
    borderRadius: 32,
    alignItems: "center",
    marginBottom: "-80%",
    borderColor: Color.Gray.gray400,
    overflow: 'hidden',
    height: scaleHeight(height/1.55)
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
    width: '100%',
    flex: 1,
    padding: 20
  },
  titleText: {
    color: Color.base.White,
    fontSize: 16,
    marginBottom: 10,
    alignSelf: "flex-start",
    fontWeight: "bold",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(33, 33, 33, 0.32)',
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
  image: {
    width: 300,
    height: 300,
    borderRadius: 32,
  },
})