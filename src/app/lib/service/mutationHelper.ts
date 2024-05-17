import LoginSchema from "@/app/validators/LoginSchema";
import { axiosClient } from "../axios";
import * as z from "zod";
import { UserBoostData, UserBoostRequestData } from "../types";
import { createBoostFormData } from "./formHelper";
import { AxiosRequestConfig } from "axios";

export function login(data: z.infer<typeof LoginSchema>) {
  return axiosClient.post("/api/login", { ...data }).then((response) => {
    return response;
  });
}

export function generateTap(id: string) {
  console.log("🚀 ~ generateTap ~ id:", { restaurantId: id });
  return axiosClient
    .post("/taps/generate", { restaurantId: id })
    .then((response) => {
      return response;
    });
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
  };

  const response = await axiosClient.request(config);
  return response.data;
}
