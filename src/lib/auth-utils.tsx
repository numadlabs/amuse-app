import { SERVER_SETTING } from "@/constants/serverSettings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { QueryCache } from "@tanstack/react-query";
import { router } from "expo-router";
import { deleteUserId } from "./service/asyncStorageHelper";
import * as SecureStore from "expo-secure-store";

const queryCache = new QueryCache();

/**
 * Logs out the user by deleting the access and refresh tokens from secure storage and navigating to the login screen.
 *
 * @remarks
 * This function is called when the user's access token has expired and a refresh token is available.
 * It deletes the tokens from secure storage, clears the axios client's authorization header, and redirects the user to the login screen.
 *
 * @returns {Promise<void>} - A promise that resolves when the logout process is complete.
 */
export async function logoutHandler(axiosClient) {
  // Update HTTP Headers
  axiosClient.defaults.headers.common["Authorization"] = "";
  await SecureStore.deleteItemAsync(SERVER_SETTING.TOKEN_KEY);
  await SecureStore.deleteItemAsync(SERVER_SETTING.REFRESH_TOKEN_KEY);
  queryCache.clear();
  //TODO key object dotroos duudah
  await AsyncStorage.removeItem("hasSeenWelcomeMessage");
  queryCache.clear();
  await deleteUserId();

  router.replace("/Login");
}
