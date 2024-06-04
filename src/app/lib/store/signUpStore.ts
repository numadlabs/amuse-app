import { create } from "zustand";
import data from 'prefix.json'


export interface SignUpStore {
  prefix: string;
  phoneNumber: string;
  password: string;
  nickname: string;
  setPrefix: (prefix: string) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  setPassword: (password: string) => void;
  setNickname: (nickname: string) => void;
}

export const useSignUpStore = create<SignUpStore>((set) => ({
  prefix: data[0].prefix,
  phoneNumber: "",
  password: "",
  nickname: "",
  setPrefix: (prefix) => set({ prefix }),
  setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
  setPassword: (password) => set({ password }),
  setNickname: (nickname) => set({ nickname }),
}));
