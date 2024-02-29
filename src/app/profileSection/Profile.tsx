import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import Header from '../components/layout/Header'
import Color from '../constants/Color'
import { ArrowRight2, Lock1, MessageQuestion, NoteText, Sms, User } from 'iconsax-react-native'
import { router } from 'expo-router'
import { useAuth } from '../context/AuthContext'

const Profile = () => {
  const { authState, onLogout } = useAuth();
  return (
    <>
      <Header title='Profile' />
      <View style={styles.body}>
        <View style={styles.container}>
          <View style={styles.profileContainer}>
            <View style={styles.profilePic}>
              <User size={48} color={Color.Gray.gray400} />
            </View>
            <Text style={styles.profileName}>Satorishu</Text>
          </View>
          <View style={styles.profileStatsContainer}>
            <View style={styles.profileStats}>
              <Text style={{ color: Color.Gray.gray400, fontSize: 16 }}>Taps</Text>
              <Text style={{ color: Color.Gray.gray600, fontSize: 24, fontWeight: 'bold' }}>00</Text>
            </View>
            <View style={{ width: 1, backgroundColor: Color.Gray.gray50 }} />
            <TouchableOpacity style={styles.profileStats}>
              <Text style={{ color: Color.Gray.gray400, fontSize: 16 }}>A-Cards</Text>
              <Text style={{ color: Color.Gray.gray600, fontSize: 24, fontWeight: 'bold' }}>00</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.profileConfig}>
          <TouchableOpacity style={styles.configContainer} onPress={() => router.push('profileSection/ProfileEdit')}>
            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
              <User size={24} color={Color.Gray.gray600} />
              <Text style={{ fontSize: 16 }}>Account</Text>
            </View>
            <ArrowRight2 color={Color.Gray.gray600} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.configContainer}>
            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
              <Sms size={24} color={Color.Gray.gray600} />
              <Text style={{ fontSize: 16 }}>Contact</Text>
            </View>
            <ArrowRight2 color={Color.Gray.gray600} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.configContainer}>
            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
              <MessageQuestion size={24} color={Color.Gray.gray600} />
              <Text style={{ fontSize: 16 }}>FAQ</Text>
            </View>
            <ArrowRight2 color={Color.Gray.gray600} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.configContainer}>
            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
              <NoteText size={24} color={Color.Gray.gray600} />
              <Text style={{ fontSize: 16 }}>Terms and Conditions</Text>
            </View>
            <ArrowRight2 color={Color.Gray.gray600} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.configContainer}>
            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
              <Lock1 size={24} color={Color.Gray.gray600} />
              <Text style={{ fontSize: 16 }}>Privacy Policy</Text>
            </View>
            <ArrowRight2 color={Color.Gray.gray600} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onLogout()}>
            <View>
              <Text>sign out</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
}

export default Profile

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: Color.base.White,
    paddingHorizontal: 16
  },
  container: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 24,
    gap: 24,
    borderRadius: 32,
    backgroundColor: Color.base.White,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  profilePic: {
    alignItems: 'center',
    width: 72,
    height: 72,
    padding: 10,
    borderRadius: 200,
    backgroundColor: Color.Gray.gray50
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16
  },
  profileContainer: {
    alignItems: 'center'
  },
  profileStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  profileStats: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 8
  },
  profileConfig: {
    gap: 16,
    marginTop: 24
  },
  configContainer: {
    backgroundColor: Color.base.White,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center'
  }
})