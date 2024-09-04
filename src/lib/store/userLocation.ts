import { create } from "zustand";
import * as Location from "expo-location";

interface LocationState {
  currentLocation: Location.LocationObject | null;
  isLoading: boolean;
  error: string | null;
  getLocation: () => Promise<void>;
}

const useLocationStore = create<LocationState>((set) => ({
  currentLocation: null,
  isLoading: false,
  error: null,

  getLocation: async () => {
    set({ isLoading: true, error: null });
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        set({ error: "Permission to access location was denied", isLoading: false });
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      set({ currentLocation: location, isLoading: false });
    } catch (error) {
      console.error("Error fetching location:", error);
      set({ error: "Failed to fetch location", isLoading: false });
    }
  },
}));

export default useLocationStore;