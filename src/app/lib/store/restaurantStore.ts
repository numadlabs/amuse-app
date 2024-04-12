// store/restaurantStore.js
import { create } from "zustand";
import { getRestaurants } from '../service/queryHelper';
import { RestaurantType } from '../types';

interface RestaurantState {
  restaurants: RestaurantType[];
  isLoading: boolean;
  isError: boolean;
  fetchRestaurants: (params: { page: number; limit: number; distance: number; latitude: number; longitude: number }) => Promise<void>;

}

export const useRestaurantStore = create<RestaurantState>((set, get) => ({
  restaurants: [],
  isLoading: false,
  isError: false,
  fetchRestaurants: async (params) => {
    set({ isLoading: true });
    try {
      const { data } = await getRestaurants(params);
      set({ restaurants: data.restaurants, isLoading: false, isError: false });
    } catch (error) {
      set({ isLoading: false, isError: true });
    }
  },
}));