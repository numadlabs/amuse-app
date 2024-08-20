import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight2, Cake, Camera, Location, Sms, User } from "iconsax-react-native";
import Color from "@/constants/Color";
import { BODY_1_REGULAR, BODY_2_BOLD, BODY_2_MEDIUM, BUTTON_48 } from "@/constants/typography";
import Header from '@/components/layout/Header';
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "@/lib/service/queryHelper";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import { userKeys } from "@/lib/service/keysHelper";
import { SERVER_SETTING } from "@/constants/serverSettings";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import Animated from 'react-native-reanimated';

interface User {
  nickname?: string;
  email?: string;
  location?: string;
  profilePicture?: string;
  dateOfBirth?: string;
}

const ProfileEdit: React.FC = () => {
  const { authState } = useAuth();
  const [showProfilePicture, setShowProfilePicture] = useState(false);
  const [profilePicture, setProfilePicture] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const { data: userResponse } = useQuery<{ user: User }>({
    queryKey: userKeys.info,
    queryFn: () => getUserById(authState.userId),
  });

  const user = userResponse?.user || {};

  const handleNavigation = (field: keyof User, screenName: string) => {
    router.push({
      pathname: "/profileSection/UpdateScreen",
      params: {
        field, 
        value: user[field] || '',
        screenName: screenName
      },
    });
  };


  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0]);
      setShowProfilePicture(true);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Account" />
      <View style={styles.scrollView}>
        <LinearGradient
          style={styles.gradientContainer}
          colors={[Color.Brand.card.start, Color.Brand.card.end]}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
         
            <Animated.View style={{ flexDirection: 'row', padding: 16, alignItems: 'center', gap: 24, alignContent: 'center' }}>
              {profilePicture ? (
                <Image
                  source={{ uri: profilePicture.uri }}
                  style={styles.profilePicture}
                />
              ) : (
                <View style={{ width: 72, aspectRatio: 1, justifyContent: 'center', backgroundColor: Color.Gray.gray400, alignItems: 'center', borderRadius: 48 }}>
                  <User size={30} color={Color.base.White} />
                </View>
              )}
              <TouchableOpacity style={styles.changeButton} onPress={pickImage}>
                <Text style={styles.changeButtonText}>Change</Text>
              </TouchableOpacity>
            </Animated.View>

          <FieldItem
            icon={<User color={Color.Gray.gray50} />}
            label="Nickname"
            value={user.nickname || "Not set"}
            onPress={() => handleNavigation('nickname', 'Nickname')}
          />

          <FieldItem
            icon={<Sms color={Color.Gray.gray50} />}
            label="Email"
            value={user.email || "Not set"}
            onPress={() => handleNavigation('email', 'Email')}
          />

          <FieldItem
            icon={<Location color={Color.Gray.gray50} />}
            label="Area"
            value={user.location || "Not set"}
            onPress={() => handleNavigation('location', 'Area')}
          />

          <FieldItem
            icon={<Cake color={Color.Gray.gray50} />}
            label="Birthday"
            value={formatDate(user.dateOfBirth)}
            onPress={() => handleNavigation('dateOfBirth', 'Birthday')}
          />
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
};

interface FieldItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onPress: () => void;
}

const FieldItem: React.FC<FieldItemProps> = ({ icon, label, value, onPress }) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TouchableOpacity style={styles.fieldValueContainer} onPress={onPress}>
      <View style={styles.fieldContent}>
        {icon}
        <Text style={styles.fieldValue}>{value}</Text>
      </View>
      <ArrowRight2 size={20} color={Color.Gray.gray50} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.Gray.gray600,
  },
  scrollView: {
    flex: 1,
  },
  gradientContainer: {
    padding: 16,
    borderWidth:1,
    borderColor: Color.Gray.gray400,
    borderRadius: 24,
    margin: 16,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profilePic: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Color.Gray.gray300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: Color.Gray.gray400,
    padding: 8,
    borderRadius: 20,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    ...BODY_2_MEDIUM,
    color: Color.base.White,
    marginBottom: 8,
  },
  fieldValueContainer: {
    backgroundColor: Color.Gray.gray500,
    borderWidth:1,
    borderColor: Color.Gray.gray400,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldValue: {
    ...BODY_1_REGULAR,
    color: Color.base.White,
    marginLeft: 12,
  },
  arrow: {
    color: Color.Gray.gray200,
    fontSize: 20,
  },
  content: {
    padding: 16,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderColor: Color.Gray.gray300,
  },
  label: {
    color: Color.base.White,
    ...BODY_1_REGULAR,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    backgroundColor: Color.Gray.gray400,
    padding: 16,
    borderRadius: 16
  },
  value: {
    color: Color.base.White,
    ...BODY_2_BOLD,
    marginRight: 8,
    fontSize: 16
  },
  changeButton: {
    backgroundColor: Color.Gray.gray300,
    padding: 8,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginVertical: 16,
  },
  changeButtonText: {
    color: Color.base.White,
    ...BODY_2_MEDIUM,
  },
  buttonContainer: {
    padding: 16,

  },
  profilePicture: {
    width: 72,
    height: 72,
    borderRadius: 50,
    alignSelf: 'center',
  },
});

export default ProfileEdit;