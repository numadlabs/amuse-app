import { create } from "zustand";


const data = [
  {
    name: "UAE",
    prefix: "971",
  },
  {
    name: "Mongolia",
    prefix: "976",
  },
  {
    name: "United States",
    prefix: "1",
  },
  {
    name: "United Kingdom",
    prefix: "44",
  },
  {
    name: "Canada",
    prefix: "1",
  },
  {
    name: "Australia",
    prefix: "61",
  },
  {
    name: "Germany",
    prefix: "49",
  },
  {
    name: "France",
    prefix: "33",
  },
  {
    name: "Japan",
    prefix: "81",
  },
];


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
