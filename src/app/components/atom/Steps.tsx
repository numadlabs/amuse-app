import Color from '@/app/constants/Color';
import React from 'react';
import { View, StyleSheet } from 'react-native';

function Steps({ activeStep }) {
  return (
    <View style={styles.container}>
      <View style={[styles.step, activeStep === 1 && styles.stepActive]} />
      <View style={[styles.step, activeStep === 2 && styles.stepActive]} />
      <View style={[styles.step, activeStep === 3 && styles.stepActive]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 2,
    gap: 8,
    height: 24,
    alignItems: 'center',
    backgroundColor: Color.Gray.gray600
  },
  step: {
    borderRadius: 10,
    backgroundColor: Color.Gray.gray400,
    width: 64,
    height: 8
  },
  stepActive: {
    backgroundColor: Color.Gray.gray50,
  }
})

export default Steps;
