import { SERVER_SETTING } from "@/constants/serverSettings";

// Import AsyncStorage from expo
import AsyncStorage from "@react-native-async-storage/async-storage";

// A function to save the userId to AsyncStorage
export const saveUserId = async (userId: string) => {
  try {
    await AsyncStorage.setItem(SERVER_SETTING.USER_ID, userId);
  } catch (error) {
    // Handle error
    console.error(error);
  }
};

// A function to load the userId from AsyncStorage
export const loadUserId = async () => {
  try {
    const userId = await AsyncStorage.getItem(SERVER_SETTING.USER_ID);
    return userId;
  } catch (error) {
    // Handle error
    console.error(error);
    return null;
  }
};

// A function to load the userId from AsyncStorage
export const deleteUserId = async () => {
  try {
    await AsyncStorage.removeItem(SERVER_SETTING.USER_ID);
  } catch (error) {
    // Handle error
    console.error(error);
    return null;
  }
};
