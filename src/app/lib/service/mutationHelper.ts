import LoginSchema from "@/app/validators/LoginSchema";
import { axiosClient } from "../axios";
import * as z from "zod";
import { UserBoostData, UserBoostRequestData } from "../types";
import { createBoostFormData } from "./formHelper";
import { AxiosRequestConfig } from "axios";

export function generateTap() {
  console.log("🚀 ~ generateTap");
  return axiosClient.post("/taps/generate").then((response) => {
    return response;
  });
}

export function registerDeviceNotification({
  pushToken,
}: {
  pushToken: string;
}) {
  console.log("🚀 ~ expo token");
  return axiosClient.post("/devices", { pushToken }).then((response) => {
    return response;
  });
}

export function generatePerkQr({ id }: { id: string }) {
  console.log("🚀 ~ generatePerkQr");
  return axiosClient.post(`/userBonus/${id}/generate`);
}

export function useBonus(id: string) {
  console.log("🚀 ~ use bonus ~ id:", { id });
  return axiosClient
    .post(`/userBonus/${id}/use`, { restaurantId: id })
    .then((response) => {
      return response;
    });
}

export function redeemBonus(encryptedData: string) {
  return axiosClient
    .post("/userBonus/redeem", { encryptedData })
    .then((response) => {
      return response;
    });
}

export function redeemTap(encryptedData: string) {
  return axiosClient
    .post("/taps/redeem", { encryptedData })
    .then((response) => {
      return response;
    });
}

export function getAcard({
  userId,
  cardId,
}: {
  userId: string;
  cardId: string;
}) {
  return axiosClient
    .post("/userCards/buy", { userId, cardId })
    .then((response) => {
      return response;
    });
}

export function purchasePerk({
  bonusId,
  restaurantId,
}: {
  bonusId: string;
  restaurantId: string;
}) {
  return axiosClient
    .post("/userBonus/buy", { bonusId, restaurantId })
    .then((response) => {
      return response;
    });
}

export async function updateUserInfo({
  userId,
  data,
}: {
  userId: string;
  data: UserBoostRequestData;
}) {
  const formData = createBoostFormData(data);

  const config: AxiosRequestConfig = {
    method: "put",
    maxBodyLength: Infinity,
    url: `/users/${userId}`,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData,
    maxContentLength: 10 * 1024 * 1024,
  };

  const response = await axiosClient.request(config);
  return response.data;
}

export async function forgotPassword({
  prefix,
  telNumber,
  telVerificationCode,
  password,
}: {
  prefix: string;
  telNumber: string;
  telVerificationCode: number;
  password: string;
}) {
  return axiosClient
    .post("/auth/forgotPassword", {
      prefix,
      telNumber,
      telVerificationCode,
      password,
    })
    .then((response) => {
      return response;
    });
}

export async function updatePassword({
  prefix,
  telNumber,
}: {
  prefix: string;
  telNumber: string;
}) {
  return axiosClient
    .post("/auth/forgotPassword/otp", { prefix, telNumber })
    .then((response) => {
      return response;
    });
}

export async function checkPasswordOtp({
  prefix,
  telNumber,
  telVerificationCode,
}: {
  prefix: string;
  telNumber: string;
  telVerificationCode: number;
}) {
  return axiosClient
    .post("/auth/forgotPassword/checkOTP", {
      prefix,
      telNumber,
      telVerificationCode,
    })
    .then((response) => {
      return response;
    });
}




export async function sendRegisterOtp({
  prefix,
  telNumber,
}: {
  prefix: string;
  telNumber: string;
}) {
  return axiosClient
    .post("/auth/registerOTP", { prefix, telNumber })
    .then((response) => {
      return response;
    });
}

export async function sendEmailOtp({ email }: { email: string }) {
  return axiosClient.post("/auth/email", { email }).then((response) => {
    return response;
  });
}

export async function verifyEmailOtp({
  email,
  emailVerificationCode,
}: {
  email: string;
  emailVerificationCode: number;
}) {
  return axiosClient
    .post("/auth/verifyEmail", { email, emailVerificationCode })
    .then((response) => {
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error);
      }
    });
}

export async function checkSignUpOtp({
  prefix,
  telNumber,
  telVerificationCode,
}: {
  prefix: string;
  telNumber: string;
  telVerificationCode: number;
}) {
  return axiosClient
    .post("/auth/checkOTP", { prefix, telNumber, telVerificationCode })
    .then((response) => {
      return response;
    });
}


export async function checkTelNumber({
  prefix,
  telNumber,
}: {
  prefix: string;
  telNumber: string;
}) {
  return axiosClient
    .post("/auth/checkTelNumber", { prefix, telNumber })
    .then((response) => {
        return response.data;
    });
}
