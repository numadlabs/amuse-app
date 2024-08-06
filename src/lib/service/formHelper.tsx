// import { FormData, Platform } from 'react-native';

import { Platform } from "react-native";
import { UserBoostRequestData } from "../types";

export const createBoostFormData = (data: UserBoostRequestData) => {
  const formData = new FormData();
  
  Object.keys(data).forEach(key => {
    if (key === 'profilePicture' && data[key]) {
      const file = data[key];
      formData.append('profilePicture', {
        uri: Platform.OS === 'android' ? file.uri : file.uri.replace('file://', ''),
        type: file.type,
        name: file.name,
      } as any);
    } else {
      formData.append(key, data[key] as string);
    }
  });


  return formData;
};


