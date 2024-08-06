import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import Color from '@/constants/Color'
import { Bitcoin } from 'iconsax-react-native'


interface NotificationProps {
  title: string;
  description: string;
  time: string;
}
const NotificationCard: React.FC<NotificationProps> = ({title, description, time}) => {
  return (
    <View>
      <View style={styles.body}>
        <LinearGradient
          colors={[Color.Brand.card.start, Color.Brand.card.end]}
          style={{ borderRadius: 16 }}>
          <View style={styles.container}>
            <View
              style={{
                marginHorizontal: 12,
                marginVertical: 16,
                flexDirection: "row",
                gap: 12,
              }}
            >
              <View
                style={{
                  backgroundColor: Color.Gray.gray400,
                  width: 40,
                  height: 40,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 100,
                }}
              >
                <Bitcoin size={20} color="#fff" />
              </View>
              <View style={{ flexDirection: "column", gap: 4, flex: 1 }}>
                <Text
                  style={{
                    color: Color.base.White,
                    fontSize: 14,
                    lineHeight: 18,
                    fontWeight: '600',
                  }}
                >
                  {title}
                </Text>
                <Text
                  style={{
                    color: Color.Gray.gray50,
                    fontSize: 12,
                    fontWeight: '400'
                  }}
                >
                  {description}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ position: 'absolute', top: 12, right: 12 }}>
            <Text style={{ fontSize: 10, lineHeight: 12, color: Color.base.White }}>{time}</Text>
          </View>
        </LinearGradient>
      </View>
    </View>
  )
}

export default NotificationCard


const styles = StyleSheet.create({
  body: {
    backgroundColor: Color.Gray.gray600,
    paddingHorizontal: 16,
  },
  container: {
    borderWidth: 1,
    borderColor: Color.Gray.gray400,
    borderRadius: 16,
  },
});
