import axios from "axios";
import Constants from "expo-constants";
// Constants.manifest2.

const uri = Constants?.expoConfig?.hostUri
  ? `http://${Constants.expoConfig.hostUri
      .split(`:`)
      .shift()
      .concat(`:3001/api`)}`
  : `yourapi.com`;

export const baseUrl = uri;

export const axiosClient = axios.create({ baseURL: baseUrl });
