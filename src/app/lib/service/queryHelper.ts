import LoginSchema from "@/app/validators/LoginSchema";
import { axiosClient } from "../axios";
import * as z from "zod";

export function login(data: z.infer<typeof LoginSchema>) {
  return axiosClient.post("/api/login", { ...data }).then((response) => {
    return response;
  });
}
export async function getRestaurantById(id: string) {
  return axiosClient.get(`/restaurants/${id}`).then((response) => {
    console.log("🚀 ~ returnaxiosClient.get ~ response:", response.data);
    if (response.data.success) {
      return response?.data;
    } else {
      throw new Error(response.data.error);
    }
  });
}

export async function getRestaurants({
  page,
  limit,
  distance,
  latitude,
  longitude,
}: {
  page: number;
  limit: number;
  distance: number;
  latitude: number;
  longitude: number;
}) {
  return axiosClient
    .get(
      `/restaurants?page=${page}&limit=${limit}&distance=${distance}&latitude=${latitude}&longitude=${longitude}`
    )
    .then((response) => {
      if (response.data.success) {
        return response?.data;
      } else {
        throw new Error(response.data.error);
      }
    });
}

export async function getRestaurantCardById(id: string) {
  return axiosClient.get(`/cards/${id}/restaurants`).then((response) => {
    if (response.data.success) {
      return response?.data;
    } else {
      throw new Error(response.data.error);
    }
  });
}

export async function getUserCard({ latitude, longitude }) {
  return axiosClient
    .get(`/users/cards?latitude=${latitude}&longitude=${longitude}`)
    .then((response) => {
      if (response.data.success) {
        return response?.data;
      } else {
        throw new Error(response.data.error);
      }
    });
}

export async function getUserTaps() {
  return axiosClient
    .get(`/users/taps`)
    .then((response) => {
      if (response.data.success) {
        return response?.data;
      } else {
        throw new Error(response.data.error);
      }
    });
}


export async function getUserById(userID: string){
  return axiosClient
  .get(`/users/${userID}`)
  .then((response) => {
    if (response.data.success) {
      return response?.data.data.user
    } else {
      throw new Error(response.data.error)
    }
  })
}

export async function getRestaurantId(id: string){
  return axiosClient
  .get(`/restaurants/${id}`)
  .then((response) => {
    if (response.data.success) {
      return response?.data.data.restaurant
    } else {
      throw new Error(response.data.error)
    }
  })
}


export async function getPrefixAndCountry(){
  return axiosClient
  .get('https://restcountries.com/v2/all?fields=name,callingCodes')
  .then((response) => {
    if (response.status === 200) {
      return response.data
    }else{
      throw new Error(response.data.error)
    }
  })
}
