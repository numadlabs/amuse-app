import { create } from "zustand";
import * as Location from "expo-location";

interface LocationState {
  currentLocation: Location.LocationObject;
  isLoading: boolean;
  getLocation: () => Promise<void>;
}

const PRAGUE_LOCATION: Location.LocationObject = {
  coords: {
    latitude: 50.0755,
    longitude: 14.4378,
    altitude: null,
    accuracy: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null,
  },
  timestamp: Date.now(),
};

const useLocationStore = create<LocationState>((set) => ({
  currentLocation: PRAGUE_LOCATION,
  isLoading: false,

  getLocation: async () => {
    set({ isLoading: true });
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        set({ currentLocation: location, isLoading: false });
      } else {
        // Silently default to Prague if permission is denied
        set({ currentLocation: PRAGUE_LOCATION, isLoading: false });
      }
    } catch (error) {
      // Silently default to Prague on any error
      set({ currentLocation: PRAGUE_LOCATION, isLoading: false });
    }
  },
}));

export default useLocationStore;