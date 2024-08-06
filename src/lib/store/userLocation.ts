import { create } from "zustand";
import * as Location from "expo-location";

interface LocationState {
  currentLocation: GeolocationCoordinates | null;
  getLocation: () => Promise<void>;
}

const useLocationStore = create<LocationState>((set) => ({
  currentLocation: null,

  getLocation: async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      //TODO type error zasah
      set({ currentLocation: location.coords });
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  },
}));

export default useLocationStore;
