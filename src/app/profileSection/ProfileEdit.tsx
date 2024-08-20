import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight2, Cake, Camera, Location, Sms, User } from "iconsax-react-native";
import Color from "@/constants/Color";
import { BODY_1_REGULAR, BODY_2_BOLD, BODY_2_MEDIUM, BUTTON_48 } from "@/constants/typography";
import Header from '@/components/layout/Header';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserById } from "@/lib/service/queryHelper";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import { userKeys } from "@/lib/service/keysHelper";
import { SERVER_SETTING } from "@/constants/serverSettings";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import Animated, { FadeIn } from 'react-native-reanimated';
import { updateUserInfo } from '@/lib/service/mutationHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  nickname?: string;
  email?: string;
  location?: string;
  profilePicture?: string;
  dateOfBirth?: string;
}

interface ProfilePictureData {
  uri: string;
  type: string;
  name: string;
}

const ProfileEdit: React.FC = () => {
  const { authState } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showProfilePicture, setShowProfilePicture] = useState(false);
  const [showArea, setShowArea] = useState(true);
  const [showDateOfBirth, setShowDateOfBirth] = useState(true);
  const [error, setError] = useState("");
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

  const updateUserData = async (field: string, value: string | ProfilePictureData) => {
    setLoading(true)
    const dataToUpdate = { [field]: value };
    try {
      await updateUserInfo({
        userId: authState.userId,
        data: dataToUpdate
      });
      queryClient.invalidateQueries({ queryKey: userKeys.info });

    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      setError(`File is too large`);
    } finally {
      setLoading(false);
    }
  };



  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const profilePictureData: ProfilePictureData = {
        uri: result.assets[0].uri,
        type: "image/jpeg",
        name: "profile_picture.jpg",
      };
      await updateUserData('profilePicture', profilePictureData);
    }
  };
  const queryClient = useQueryClient()
  const removeProfilePicture = () => updateUserData('profilePicture', '');

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  console.log(user.profilePicture);

  const saveProfilePictureSetting = async () => {
    try {
      const data = await AsyncStorage.getItem('showProfilePicture');
      // setShowProfilePicture(data);
    } catch (error) {
      console.error('Error saving profile picture setting:', error);
    }
  };

  const saveDateOfBirthSetting = async () => {
    try {
      const data = await AsyncStorage.getItem('showDateOfBirth');
      console.log(data)
      setShowDateOfBirth(data === 'true');
    } catch (error) {
      console.error('Error saving date of birth setting:', error);
    }
  };

  const saveAreaSetting = async () => {
    try {
      const data = await AsyncStorage.getItem('showArea');
      setShowArea(data === 'true');
    } catch (error) {
      console.error('Error saving area setting:', error);
    }
  };



  useEffect(() => {
    saveDateOfBirthSetting();
    saveAreaSetting();
  }, []);


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
            {loading ? (
              <View style={{ justifyContent: 'center', width: 72, height: 72, alignItems: 'center', backgroundColor: Color.Gray.gray400, borderRadius: 100 }}>
                <ActivityIndicator size="small" color={Color.base.White} />
              </View>
            ) : user.profilePicture ? (
              <Image
                source={{ uri: `${SERVER_SETTING.PROFILE_PIC_LINK}${user.profilePicture}` }}
                style={styles.profilePicture}
              />
            ) : (
              <View style={styles.defaultProfilePic}>
                <User size={30} color={Color.base.White} />
              </View>
            )}
            <View>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity style={styles.changeButton} onPress={pickImage}>
                  <Text style={styles.changeButtonText}>Change</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.changeButton, { borderWidth: 1, backgroundColor: "transparent", borderColor: Color.Gray.gray400 }]} onPress={removeProfilePicture}>
                  <Text style={styles.changeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
              {error && (
                <Animated.Text entering={FadeIn} style={{ color: Color.System.systemError }}>
                  {error}
                </Animated.Text>
              )}
            </View>


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
            disabled={!showArea}
          />


          <FieldItem
            icon={<Cake color={Color.Gray.gray50} />}
            label="Birthday"
            value={formatDate(user.dateOfBirth)}
            onPress={() => handleNavigation('dateOfBirth', 'Birthday')}
            disabled={!showDateOfBirth}
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
  disabled?: boolean;
}

const FieldItem: React.FC<FieldItemProps> = ({ icon, label, value, onPress, disabled }) => (
  <View style={styles.fieldContainer}>
    <Text style={[styles.fieldLabel, disabled && styles.disabledText]}>{label}</Text>
    <TouchableOpacity
      style={[styles.fieldValueContainer, disabled && styles.disabledField]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.fieldContent}>
        {React.cloneElement(icon as React.ReactElement, { color: disabled ? Color.Gray.gray300 : Color.Gray.gray50 })}
        <Text style={[styles.fieldValue, disabled && styles.disabledText]}>{value}</Text>
      </View>
      {!disabled && <ArrowRight2 size={20} color={Color.Gray.gray50} />}
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
    borderWidth: 1,
    borderColor: Color.Gray.gray400,
    borderRadius: 24,
    margin: 16,
  },
  profileContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    gap: 24,
  },
  profilePicture: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  defaultProfilePic: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Color.Gray.gray400,
    justifyContent: 'center',
    alignItems: 'center',
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
    borderWidth: 1,
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
  disabledField: {
    backgroundColor: Color.Gray.gray500,
    borderColor: Color.Gray.gray500,
  },
  disabledText: {
    color: Color.Gray.gray300,
  },
});

export default ProfileEdit;