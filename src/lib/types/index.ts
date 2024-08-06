export type RestaurantType = {
  id: string | string[];
  name: string;
  description: string;
  category: string;
  location: string;
  latitude: number;
  categoryName: string;
  longitude: number;
  opensAt: string;
  restaurantId: string;
  closesAt: string;
  logo: string;
  cardId: string;
  benefits: string;
  artistInfo: string;
  expiryInfo: string;
  instruction: string;
  nftImageUrl: string | string[];
  isOpen: boolean;
  isOwned: boolean;
  visitCount: number;
};

export type UserBoostData = {
  email: string;
  area: string;
  birthdate: string;
};

export type UserBoostRequestData = {
  nickname: string;
  location: string;
  profilePicture?: {
    uri: string;
    type: string;
    name: string;
  };
  dateOfBirth: string;
};
