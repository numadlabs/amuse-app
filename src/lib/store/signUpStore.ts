import { create } from "zustand";

export interface SignUpStore {
  email: string;
  password: string;
  nickname: string;
  verificationCode: number;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setNickname: (nickname: string) => void;
  setVerificationCode: (verificationCode: number) => void;
  reset: () => void;
}

export const useSignUpStore = create<SignUpStore>((set) => ({
  email: "",
  password: "",
  nickname: "",
  verificationCode: 0,
  setEmail: (email: string) => set({ email }),
  setPassword: (password: string) => set({ password }),
  setNickname: (nickname: string) => set({ nickname }),
  setVerificationCode: (verificationCode: number) => set({ verificationCode }),
  reset: () =>
    set({
      email: "",
      password: "",
      nickname: "",
      verificationCode: 0,
    }),
}));
