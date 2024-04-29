import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import Color from '@/app/constants/Color'
import { LinearGradient } from 'expo-linear-gradient'
import PerkGradient from '../../icons/PerkGradient'
import { router } from 'expo-router'
import PowerUpCard from '../../atom/cards/PowerUpCard'
import { ActivityIndicator } from 'react-native'
import DetailsSheet from '../DetailsSheet'
import useLocationStore from '@/app/lib/store/userLocation'

interface ownedProps {
  cardId: string;
  perks:any,
  isLoading: boolean
}

const Owned: React.FC<ownedProps> = ({ perks,isLoading }) => {

  const [showPerks, setShowPerks] = useState(true)

  const backgroundColor = showPerks ? Color.Gray.gray300 : Color.Gray.gray400;
  
  const toggleView = (view) => {
    setShowPerks(view);
  };

  return (
    <>
      <View style={styles.attrContainer}>
        <View
          style={{
            backgroundColor: Color.Gray.gray400,
            justifyContent: "space-between",
            borderRadius: 48,
            height: 48,
            width: "100%",
            flexDirection: "row",
            padding: 4,
          }}
        >
          <TouchableOpacity
            onPress={() => toggleView(true)}
            style={{
              backgroundColor: backgroundColor,
              alignItems: "center",
              borderRadius: 48,
              justifyContent: "center",
              width: "50%",
            }}
          >
            <Text
              style={{
                fontSize: 15,
                color: Color.base.White,
                fontWeight: "bold",
              }}
            >
              Perks
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleView(false)}>
            <View
              style={{
                backgroundColor: showPerks
                  ? Color.Gray.gray400
                  : Color.Gray.gray300,
                flex: 1,
                flexGrow: 1,
                alignItems: "center",
                paddingHorizontal: 60,
                justifyContent: "center",
                borderRadius: 48,
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  color: Color.base.White,
                  fontWeight: "bold",
                }}
              >
                Details
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, flexGrow: 1, marginTop: 32 }}>
          {isLoading ? (
            <ActivityIndicator color={Color.Gray.gray600} />
          ) : showPerks ? (
            <View style={styles.powerUpGrid}>
              {perks && perks.length > 0 ? (
                perks.map((item, index) => (
                  <PowerUpCard
                    key={index}
                    title={item.name}
                    onPress={() =>
                      router.push({
                        pathname: `/PowerUp`,
                        params: {
                          name: item.name,
                          id: item.id,
                        },
                      })
                    }
                  />
                ))
              ) : (
                <LinearGradient
                  colors={[Color.Brand.card.start, Color.Brand.card.end]}
                  style={{ borderRadius: 16 }}>
                  <View
                    style={{
                      gap: 16,
                      padding: 24,
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: Color.Gray.gray400,
                      alignItems: 'center',
                      paddingVertical: 32,
                      paddingHorizontal: 24
                    }}
                  >
                    <View
                      style={{ padding: 12, backgroundColor: Color.Gray.gray400, justifyContent: "center", alignItems: "center", width: 52, borderRadius: 12 }}
                    >
                      <PerkGradient />
                    </View>

                    <Text
                      style={{
                        textAlign: "center",
                        lineHeight: 16,
                        fontSize: 12,
                        fontWeight: "400",
                        color: Color.Gray.gray50
                      }}
                    >
                      You haven’t got any perks yet.{"\n"} Every 10th check-in,
                      you will receive perks.
                    </Text>
                  </View>
                </LinearGradient>
              )}
            </View>
          ) : (
            <View
              style={{ flex: 1, flexGrow: 1, marginBottom: 150, padding: 8 }}
            >
              <DetailsSheet
                benefits={"benefits"}
                locations={"location"}
                memberships={"membership"}
                about={"about"}
                instruction={"instruction"}
                artistInfo={"artistInfo"}
              />
            </View>
          )}
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  attrContainer: {
    marginTop: 32,
    marginBottom: 40,
  },
  powerUpGrid: {
    gap: 15,
  },
})

export default Owned