export const restaurantKeys = {
  all: ["restaurants"] as const,
  lists: () => [...restaurantKeys.all, "list"] as const,
  list: (filters: string) => [...restaurantKeys.lists(), { filters }] as const,
  details: () => [...restaurantKeys.all, "detail"] as const,
  detail: (id: string) => [...restaurantKeys.details(), id] as const,
  perks: (restaurantId: string) =>
    [...restaurantKeys.detail(restaurantId), "perks"] as const,
};

export const purchaseablePerkKeys = {
  all: ["purchaseablePerks"] as const,
  lists: () => [...restaurantKeys.all, "list"] as const,
  list: (filters: string) => [...restaurantKeys.lists(), { filters }] as const,
  details: () => [...restaurantKeys.all, "detail"] as const,
  detail: (id: string) => [...restaurantKeys.details(), id] as const,
  perks: (restaurantId: string) =>
    [...restaurantKeys.detail(restaurantId), "perks"] as const,
};

export const userKeys = {
  info: ["userInfo"] as const,
  perks: ["userPerks"] as const,
  cards: ["userCards"] as const,
  tier: ["userTiers"] as const,
  taps: ["userTaps"] as const,
  notifications: ["userNotifications"] as const,
};
