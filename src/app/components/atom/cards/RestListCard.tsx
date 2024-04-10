import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { RestaurantType } from '@/app/lib/types'
import { useLocalSearchParams } from 'expo-router'
import Color from '@/app/constants/Color'
import { Reserve, Wallet } from 'iconsax-react-native'


interface ResListCardProp {
  marker: RestaurantType,
  onPress: () => void,
  isClaimLoading: boolean;
}
const ResListCard: React.FC<ResListCardProp> = ({ marker, onPress, isClaimLoading }) => {
  const opensAt = new Date(marker.opensAt);
  const closesAt = new Date(marker.closesAt);
  const currentTime = new Date();

  const isOpen =
    currentTime.getTime() >= opensAt.getTime() &&
    currentTime.getTime() <= closesAt.getTime();
  return (
    <View style={{ paddingHorizontal: 16 }}>
      <View style={styles.container}>
        <Image source={{ uri: `https://numadlabs-amuse.s3.eu-central-1.amazonaws.com/${marker.logo}` as string }} style={styles.image} />
        <View style={{ gap: 28 }}>
          <View style={{ gap: 4 }}>
            <View style={{ width: '80%' }}>
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>{marker.name}</Text>
            </View>
            <Text style={styles.category}>{marker.category}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 25, }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: isOpen ? `${Color.System.systemError}` : `${Color.System.systemSuccess}` },
                ]}
              />
              <Text style={{ color: isOpen ? `${Color.System.systemError}` : `${Color.System.systemSuccess}` }}>
                {isOpen ? "Closed" : "Open"}
              </Text>
            </View>

            <View style={{ width: 1, height: 14, backgroundColor: Color.Gray.gray50 }} />
            {marker.isOwned ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Reserve color={Color.Gray.gray600} size={16} />
                <Text>{marker.visitCount} Check-ins</Text>
              </View>
            ) : (
              <TouchableOpacity onPress={onPress}>
                <View style={{ flexDirection: 'row', position: 'relative', backgroundColor: Color.Gray.gray600, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 48, marginLeft: 49, alignContent: 'center', alignItems: 'center' }}>
                  <Wallet size={16} color={Color.Gray.gray50} />
                  <Text style={{ color: Color.Gray.gray50, fontWeight: 'bold', fontSize: 11, lineHeight: 16 }}>
                    {isClaimLoading
                      ? "Loading"
                      : marker.isOwned
                        ? "Owned"
                        : " Add"}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

    </View>
  )
}

export default ResListCard

const styles = StyleSheet.create({
  container: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
    flexDirection: 'row',
    padding: 12,
    backgroundColor: Color.base.White,
    borderRadius: 16,
    gap: 16,
    marginBottom: 12
  },
  image: {
    borderRadius: 8,
    width: 92,
    height: 92
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Color.Gray.gray600
  },
  category: {
    fontSize: 12,
    color: Color.Gray.gray400
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
})