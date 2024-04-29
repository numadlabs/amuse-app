import { create } from "zustand";


export interface PasswordStore {
  prefix: string;
  phoneNumber: string;
  password: string;
  setPrefix:(prefix: string) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  setPassword: (password: string) => void;
}

export const usePasswordStore = create<PasswordStore>((set) => ({
  prefix: "",
  phoneNumber: "",
  password: "",
  setPrefix: (prefix) => set({prefix}),
  setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
  setPassword: (password) => set({ password }),
}));