import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User as UserIcon } from "iconsax-react-native";
import Color from "@/constants/Color";
import { BODY_1_REGULAR, BODY_2_BOLD, BODY_2_MEDIUM, BUTTON_48 } from "@/constants/typography";
import Header from '@/components/layout/Header';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserById } from "@/lib/service/queryHelper";
import { useAuth } from "@/context/AuthContext";
import { updateUserInfo } from "@/lib/service/mutationHelper";
import Button from "@/components/ui/Button";
import { router } from "expo-router";
import { userKeys } from "@/lib/service/keysHelper";
import * as ImagePicker from "expo-image-picker";
import { SERVER_SETTING } from "@/constants/serverSettings";
import Animated from 'react-native-reanimated';
import OtpInputEmail from '@/components/atom/OtpInputEmail';

interface User {
  nickname?: string;
  email?: string;
  location?: string;
  profilePicture?: string | null;
  dateOfBirth?: string;
}

interface UserResponse {
  user: User;
}

const ProfileEdit: React.FC = () => {
  const { authState } = useAuth();
  const { data: userResponse } = useQuery<UserResponse, Error>({
    queryKey: userKeys.info,
    queryFn: () => getUserById(authState.userId),
  });

  const user = userResponse?.user || {} as User;

  const [loading, setLoading] = useState(false);
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [profilePicture, setProfilePicture] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [showNickname, setShowNickname] = useState(false);
  const [showDateOfBirth, setShowDateOfBirth] = useState(false);
  const [showArea, setShowArea] = useState(false);
  const [showProfilePicture, setShowProfilePicture] = useState(false);
  const [dataChanged, setDataChanged] = useState(false);

  useEffect(() => {
    if (user) {
      setNickname(user.nickname || "");
      setEmail(user.email || "");
      setLocation(user.location || "");
      setDateOfBirth(user.dateOfBirth || "");
      if (user.profilePicture) {
        setProfilePicture({ uri: `${SERVER_SETTING.PROFILE_PIC_LINK}${user.profilePicture}` } as ImagePicker.ImagePickerAsset);
      }
      
      // Set toggle states based on whether the fields have values
      setShowNickname(!!user.nickname);
      setShowDateOfBirth(!!user.dateOfBirth);
      setShowArea(!!user.location);
      setShowProfilePicture(!!user.profilePicture);
    }
  }, [user]);

  useEffect(() => {
    const hasChanged = 
      (showNickname && user.nickname !== nickname) ||
      (showProfilePicture && user.profilePicture !== profilePicture?.uri) ||
      (showArea && user.location !== location) ||
      (showDateOfBirth && user.dateOfBirth !== dateOfBirth) ||
      (!showNickname && user.nickname) ||
      (!showProfilePicture && user.profilePicture) ||
      (!showArea && user.location) ||
      (!showDateOfBirth && user.dateOfBirth);
    
    setDataChanged(hasChanged);
  }, [user, nickname, location, dateOfBirth, profilePicture, showNickname, showProfilePicture, showArea, showDateOfBirth]);

  const queryClient = useQueryClient();

  const handleNavigation = (field: keyof User, screenName: string) => {
    router.push({
      pathname: "profileSection/UpdateScreen",
      params: {
        field, 
        value: user[field],
        screenName: screenName
      },
    });
  }

  const triggerUpdateUser = async () => {
    setLoading(true);
    const userData: Partial<User> & { profilePicture?: { uri: string; type: string; name: string } | null } = {};

    // Always send values for all fields, empty string if untoggled
    userData.nickname = showNickname ? nickname : "";
    userData.location = showArea ? location : "";
    userData.dateOfBirth = showDateOfBirth ? dateOfBirth : "";

    if (showProfilePicture && profilePicture) {
      userData.profilePicture = {
        uri: profilePicture.uri,
        type: "image/jpeg",
        name: "profile_picture.jpg",
      };
    } else {
      userData.profilePicture = null;
    }

    try {
      await updateUserInfo({ userId: authState.userId, data: userData });
      setLoading(false);
      setDataChanged(false);
      queryClient.invalidateQueries({ queryKey: userKeys.info });
      router.back();
    } catch (error) {
      console.error(error);
      setLoading(false);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
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

  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Account" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Profile Picture Section */}
          <View style={styles.item}>
            <Text style={styles.label}>Profile picture</Text>
            <Switch
              trackColor={{ false: Color.Gray.gray300, true: Color.System.systemSuccess }}
              thumbColor={showProfilePicture ? Color.base.White : Color.Gray.gray100}
              value={showProfilePicture}
              onValueChange={setShowProfilePicture}
            />
          </View>
          {showProfilePicture && (
            <Animated.View style={{ flexDirection: 'row', padding: 16, alignItems: 'center', gap: 24, alignContent: 'center' }}>
              {profilePicture ? (
                <Image
                  source={{ uri: profilePicture.uri }}
                  style={styles.profilePicture}
                />
              ) : (
                <View style={{ width: 72, aspectRatio: 1, justifyContent: 'center', backgroundColor: Color.Gray.gray400, alignItems: 'center', borderRadius: 48 }}>
                  <UserIcon size={30} color={Color.base.White} />
                </View>
              )}
              <TouchableOpacity style={styles.changeButton} onPress={pickImage}>
                <Text style={styles.changeButtonText}>Change</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Email Section */}
         
            <Text style={styles.label}>Email</Text>
            <TouchableOpacity style={styles.item} onPress={() => handleNavigation('email', 'Email')}>
              <View style={styles.valueContainer}>
                <Text style={styles.value}>{email || "Not set"}</Text>
                <Text style={styles.arrow}>{'>'}</Text>
              </View>
            </TouchableOpacity>
         

          {/* Nickname Section */}
          {/* <View style={styles.item}>
            <Text style={styles.label}>Nickname</Text>
            <Switch
              trackColor={{ false: Color.Gray.gray300, true: Color.System.systemSuccess }}
              thumbColor={showNickname ? Color.base.White : Color.Gray.gray100}
              value={showNickname}
              onValueChange={setShowNickname}
            />
          </View>
          {showNickname && ( */}
           <Text style={styles.label}>Nickname</Text>
            <TouchableOpacity style={styles.item} onPress={() => handleNavigation('nickname', 'Nickname')}>
              <View style={styles.valueContainer}>
                <Text style={styles.value}>{nickname || "Not set"}</Text>
                <Text style={styles.arrow}>{'>'}</Text>
              </View>
            </TouchableOpacity>
        

          {/* Date of Birth Section */}
          <View style={styles.item}>
            <Text style={styles.label}>Date of birth</Text>
            <Switch
              trackColor={{ false: Color.Gray.gray300, true: Color.System.systemSuccess }}
              thumbColor={showDateOfBirth ? Color.base.White : Color.Gray.gray100}
              value={showDateOfBirth}
              onValueChange={setShowDateOfBirth}
            />
          </View>
          {showDateOfBirth && (
            <TouchableOpacity style={styles.item} onPress={() => handleNavigation('dateOfBirth', 'Date of birth')}>
              <View style={styles.valueContainer}>
                <Text style={styles.value}>{formatDateForDisplay(dateOfBirth)}</Text>
                <Text style={styles.arrow}>{'>'}</Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Area Section */}
          <View style={styles.item}>
            <Text style={styles.label}>Area</Text>
            <Switch
              trackColor={{ false: Color.Gray.gray300, true: Color.System.systemSuccess }}
              thumbColor={showArea ? Color.base.White : Color.Gray.gray100}
              value={showArea}
              onValueChange={setShowArea}
            />
          </View>
          {showArea && (
            <TouchableOpacity style={styles.item} onPress={() => handleNavigation('location', 'Area')}>
              <View style={styles.valueContainer}>
                <Text style={styles.value}>{location || "Not set"}</Text>
                <Text style={styles.arrow}>{'>'}</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button
          variant={dataChanged ? "primary" : "disabled"}
          textStyle={dataChanged ? "primary" : "disabled"}
          size="default"
          onPress={triggerUpdateUser}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={{ ...BUTTON_48 }}>Save changes</Text>
          )}
        </Button>
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.Gray.gray600,
  },
  scrollView: {
    flex: 1,
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
  arrow: {
    color: Color.Gray.gray200,
    fontSize: 20,
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