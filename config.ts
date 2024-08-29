import { SERVER_SETTING } from '@/constants/serverSettings';
import * as Updates from 'expo-updates';

interface ConfigType {
  apiUrl: string;
  enableHiddenFeatures: boolean;
}

let Config: ConfigType = {
  apiUrl: SERVER_SETTING.API_URL, 
  enableHiddenFeatures: true, 
};

if (Updates.channel === 'production') {
  Config = {
    apiUrl: SERVER_SETTING.API_URL_PROD,
    enableHiddenFeatures: false,
  };
}

export default Config;