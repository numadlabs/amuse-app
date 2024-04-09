import { View, Text, StyleSheet } from 'react-native'
import Color from '@/app/constants/Color'
import React from 'react'
import PowerUpCard from '../atom/cards/PowerUpCard'

const PerksSection = () => {
  return (
    <View style={styles.powerUpGrid}>
      <PowerUpCard
        key=""
        title="123"
        onPress={() => {}}
      />
    </View>
  )
}

export default PerksSection


const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    padding: 12,
    borderRadius: 100,
    backgroundColor: Color.Gray.gray50,
  },
  imageContainer: {
    width: "100%",
    height: 200,
  },
  closeButton: {
    marginTop: 12,
  },
  closeButtonContainer: {
    width: "100%",
    justifyContent: "flex-end",
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(33, 33, 33, 0.32)",
  },
  container: {
    marginTop: 16,
    paddingHorizontal: 16,
    flex: 1,
  },
  powerUpGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 15,
  },
  textImageContainer: {
    borderRadius: 32,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  textImageContainer1: {
    padding: 20,
    gap: 20,
    borderRadius: 32,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  textContainer: {
    justifyContent: "flex-start",
    flexDirection: "column",
    width: "100%",
    gap: 4,
  },
  bottomDetails: {
    flexDirection: "column",
    gap: 4,
    alignItems: "center",
  },
  bottomDetails1: {
    flexDirection: "column",
    gap: 4,
  },
  bottomDetailsContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 16,
    alignContent: "center",
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 16,
  },
  attrContainer: {
    marginTop: 32,
    marginBottom: 40,
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
  buttonContainer: {
    position: "absolute",
    zIndex: 20,
    bottom: 30,
    width: "100%",
    paddingHorizontal: 16,
  },
});
