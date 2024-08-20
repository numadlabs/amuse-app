import { create } from "zustand";

export interface UpdateEmailStore {
  email: string;
  verificationCode: number;
  setEmail: (email: string) => void;
  setVerificationCode: (verificationCode: number) => void;
  reset: () => void;
}

export const useUpdateEmailStore = create<UpdateEmailStore>((set) => ({
  email: "",
  verificationCode: 0,
  setEmail: (email: string) => set({ email }),
  setVerificationCode: (verificationCode: number) => set({ verificationCode }),
  reset: () =>
    set({
      email: "",
      verificationCode: 0,
    }),
}));
