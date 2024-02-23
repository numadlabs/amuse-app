import LoginSchema from "@/app/validators/LoginSchema";
import { axiosClient } from "../axios";
import * as z from "zod";

export function login(data: z.infer<typeof LoginSchema>) {
  return axiosClient.post("/api/login", { ...data }).then((response) => {
    return response;
  });
}

export function generateTap(id: string) {
  return axiosClient
    .post("/taps/generate", { restaurantId: id })
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
