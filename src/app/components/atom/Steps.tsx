import React from 'react';
import { View } from 'react-native';

function Steps() {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', paddingVertical: 2, paddingHorizontal: 2, gap:8 }}>
      <View style={{ borderRadius: 10, backgroundColor: '#ccc', width: 64, height: 4 }} />
      <View style={{ borderRadius: 10, backgroundColor: '#eee', width: 64, height: 4 }} />
      <View style={{ borderRadius: 10, backgroundColor: '#eee', width: 64, height: 4 }} />
    </View>
  );
}

export default Steps;
