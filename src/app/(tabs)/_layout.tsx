
import React from 'react'
import { Tabs, router } from 'expo-router'
import { View, Text, TouchableOpacity } from 'react-native'
import Footer from '../components/layout/Footer'
import { Notification, User } from 'iconsax-react-native'
import Logo from '../components/icons/Logo'
import Color from '../constants/Color'

const Layout = ({ navigation }) => {

  return (
    <Tabs tabBar={props => <Footer {...props} navigation={navigation} />}>
      <Tabs.Screen name='index' options={{
        headerStyle:{shadowOpacity:0},
        headerLeft: () => (
          <TouchableOpacity>
            <View style={{paddingHorizontal:20}}>
              <User color={Color.Gray.gray600} />
            </View>
          </TouchableOpacity>
        ), headerRight: () => (
          <TouchableOpacity>
            <View style={{ paddingHorizontal: 20 }}>
              <Notification color={Color.Gray.gray600} />
            </View>
          </TouchableOpacity>
        ), headerTitle: () => (
          <Logo />
        )
      }} />
      <Tabs.Screen name='Acards' options={{headerShown:false}}/>
    </Tabs>
  )
}

export default Layout