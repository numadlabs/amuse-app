export const ROLES = {
    ADMIN: "ADMIN",
    USER: "USER"
} as const;
export type ROLES = (typeof ROLES)[keyof typeof ROLES];
export const TIER = {
    BRONZE: "BRONZE",
    SILVER: "SILVER",
    GOLD: "GOLD"
} as const;
export type TIER = (typeof TIER)[keyof typeof TIER];
