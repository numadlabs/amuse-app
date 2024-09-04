import { axiosClient } from "../axios";

export async function getRestaurants({
  page,
  limit,
  time,
  dayNoOfTheWeek,
}: {
  page: number;
  limit: number;
  time: string;
  dayNoOfTheWeek: number;
}) {
  return axiosClient
    .get(
      `/restaurants?page=${page}&limit=${limit}&time=${time}&dayNoOfTheWeek=${dayNoOfTheWeek}`
    )
    .then((response) => {
      if (response.data.success) {
        return response?.data;
      } else {
        throw new Error(response.data.error);
      }
    });
}

export async function getUserCard() {
  return axiosClient
    .get(`/users/cards`)
    .then((response) => {
      if (response.data.success) {
        return response?.data;
      } else {
        throw new Error(response.data.error);
      }
    });
}

export async function getUserNotification() {
  const response = await axiosClient.get("/notifications/user");
  if (response) {
    return response.data.data;
  }
}

export async function getUserPowerUps(id) {
  return axiosClient.get(`/userBonus/${id}/userCard`).then((response) => {
    if (response.data.success) {
      return response?.data.data;
    } else {
      throw new Error(response.data.error);
    }
  });
}

export async function getUserTransaction(id) {
  return axiosClient.get(`/transactions/${id}/user`).then((response) => {
    if (response.data.success) {
      return response?.data.data.transaction;
    } else {
      throw new Error(response.data.error);
    }
  });
}

export async function getPerksByRestaurant(id) {
  return axiosClient.get(`/userBonus/${id}/restaurant`).then((response) => {
    if (response.data.success) {
      return response?.data.data;
    } else {
      throw new Error(response.data.error);
    }
  });
}

export async function getPurchaseablePerks(id) {
  return axiosClient
    .get(`/bonus/${id}/restaurant?type=REDEEMABLE`)
    .then((response) => {
      if (response.data.success) {
        return response?.data.data;
      } else {
        throw new Error(response.data.error);
      }
    });
}

export async function getUserTaps() {
  return axiosClient.get(`/users/taps`).then((response) => {
    if (response.data.success) {
      return response?.data;
    } else {
      throw new Error(response.data.error);
    }
  });
}

export async function getUserById(userID: string) {
  return axiosClient.get(`/users/${userID}`).then((response) => {
    if (response.data.success) {
      return response?.data.data;
    } else {
      throw new Error(response.data.error);
    }
  });
}

export async function getTimeTable(id) {
  return axiosClient.get(`/timetables/${id}/restaurant`).then((response) => {
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.error);
    }
  });
}

export async function getRestaurantId(id, time, dayNoOfTheWeek) {
  return axiosClient
    .get(`/restaurants/${id}?dayNoOfTheWeek=${dayNoOfTheWeek}&time=${time}`)
    .then((response) => {
      if (response.data.success) {
        return response?.data?.data?.restaurant;
      } else {
        throw new Error(response.data.error);
      }
    });
}

export async function getUserTiers() {
  return axiosClient.get("/userTiers").then((response) => {
    if (response.data.success) {
      return response?.data.data;
    } else {
      throw new Error(response.data.error);
    }
  });
}
