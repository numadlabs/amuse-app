import { create } from "zustand";
import data from "prefix.json";

export interface SignUpStore {
  prefix: string;
  phoneNumber: string;
  password: string;
  nickname: string;
  verificationCode: number;
  setPrefix: (prefix: string) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  setPassword: (password: string) => void;
  setNickname: (nickname: string) => void;
  setVerificationCode: (verificationCode: number) => void;
  reset: () => void;
}

export const useSignUpStore = create<SignUpStore>((set) => ({
  prefix: data[0].prefix,
  phoneNumber: "",
  password: "",
  nickname: "",
  verificationCode: 0,
  setPrefix: (prefix: string) => set({ prefix }),
  setPhoneNumber: (phoneNumber: string) => set({ phoneNumber }),
  setPassword: (password: string) => set({ password }),
  setNickname: (nickname: string) => set({ nickname }),
  setVerificationCode: (verificationCode: number) => set({ verificationCode }),
  reset: () =>
    set({
      prefix: data[0].prefix,
      phoneNumber: "",
      password: "",
      nickname: "",
      verificationCode: 0,
    }),
}));
