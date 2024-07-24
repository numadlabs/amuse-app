import { create } from "zustand";
import data from 'prefix.json'

export interface PasswordStore {
  prefix: string;
  phoneNumber: string;
  verificationCode: number;
  password: string;

  setPrefix: (prefix: string) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  setVerificationCode: (verificationCode: number) => void;
  setPassword: (password: string) => void;
  reset: () => void;
}

export const usePasswordStore = create<PasswordStore>((set) => ({
  prefix: data[0].prefix,
  phoneNumber: "",
  verificationCode: 0,
  password: "",
  setPrefix: (prefix) => set({ prefix }),
  setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
  setVerificationCode: (verificationCode) => set({ verificationCode }),
  setPassword: (password) => set({ password }),
  reset: () => set({
    prefix: data[0].prefix,
    phoneNumber: "",
    verificationCode: 0,
    password: "",
  })
}));
