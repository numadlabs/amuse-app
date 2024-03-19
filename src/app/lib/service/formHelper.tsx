// import { FormData, Platform } from 'react-native';

import { UserBoostRequestData } from "../types";

export const createBoostFormData = (data: UserBoostRequestData) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    formData.append(key, data[key as keyof UserBoostRequestData]);
  });

  return formData;
};
