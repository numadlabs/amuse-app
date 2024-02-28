import { RestaurantType } from ".";

// Define an interface for the API response
export interface GetRestaurantsResponseType {
  success: boolean;
  data: {
    restaurants: RestaurantType[];
  };
}
