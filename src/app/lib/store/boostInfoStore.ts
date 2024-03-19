import { create } from "zustand";

interface BoostInfoState {
  email: string;
  area: string;
  birthdate: string | null;
  setEmail: (email: string) => void;
  setArea: (area: string) => void;
  setBirthdate: (birthdate: string) => void;
}

const useBoostInfoStore = create<BoostInfoState>((set) => ({
  email: "",
  area: "",
  birthdate: null,
  setEmail: (email) => set({ email }),
  setArea: (area) => set({ area }),
  setBirthdate: (birthdate) => set({ birthdate }),
}));

export default useBoostInfoStore;
