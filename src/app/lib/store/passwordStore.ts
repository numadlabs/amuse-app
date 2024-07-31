import { create } from "zustand";

export interface PasswordStore {
  email: string;
  verificationCode: number;
  password: string;

  setEmail: (email: string) => void;
  setVerificationCode: (verificationCode: number) => void;
  setPassword: (password: string) => void;
  reset: () => void;
}

export const usePasswordStore = create<PasswordStore>((set) => ({
  email: "",
  verificationCode: 0,
  password: "",
  setEmail: (email: string) => set({ email }),
  setVerificationCode: (verificationCode) => set({ verificationCode }),
  setPassword: (password) => set({ password }),
  reset: () =>
    set({
      email: "",
      verificationCode: 0,
      password: "",
    }),
}));
