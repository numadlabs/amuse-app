import { create } from "zustand";
import * as Location from "expo-location";

interface LocationState {
  currentLocation: Location.LocationObject | null;
  permissionStatus: Location.PermissionStatus | null;
  isLocationPermissionDenied: boolean;
  getLocation: () => Promise<void>;
  setLocationPermissionDenied: (denied: boolean) => void;
}

const DEFAULT_LOCATION: Location.LocationObject = {
  coords: {
    latitude: 50.0755,  // Prague latitude
    longitude: 14.4378, // Prague longitude
    altitude: null,
    accuracy: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null,
  },
  timestamp: Date.now(),
};

const useLocationStore = create<LocationState>((set) => ({
  currentLocation: null,
  permissionStatus: null,
  isLocationPermissionDenied: false,

  getLocation: async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      set({ permissionStatus: status });

      if (status !== Location.PermissionStatus.GRANTED) {
        console.log("Permission to access location was denied");
        set({ 
          isLocationPermissionDenied: true,
          currentLocation: DEFAULT_LOCATION
        });
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      set({ 
        currentLocation: location, 
        isLocationPermissionDenied: false 
      });
    } catch (error) {
      console.error("Error fetching location:", error);
      set({ 
        isLocationPermissionDenied: true,
        currentLocation: DEFAULT_LOCATION
      });
    }
  },

  setLocationPermissionDenied: (denied: boolean) => {
    set({ 
      isLocationPermissionDenied: denied,
      currentLocation: denied ? DEFAULT_LOCATION : null
    });
  },
}));

export default useLocationStore;