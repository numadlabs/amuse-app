import { create } from "zustand";
import * as Location from "expo-location";

interface LocationState {
  currentLocation: Location.LocationObject | null;
  permissionStatus: Location.PermissionStatus | null;
  getLocation: () => Promise<void>;
}

const useLocationStore = create<LocationState>((set) => ({
  currentLocation: null,
  permissionStatus: null,

  getLocation: async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      set({ permissionStatus: status });

      if (status !== Location.PermissionStatus.GRANTED) {
        console.log("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      set({ currentLocation: location });
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  },
}));

export default useLocationStore;