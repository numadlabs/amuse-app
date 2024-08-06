import { create } from "zustand";

interface StepState {
  currentStep: number;
  setCurrentStep: (newStep: number) => void;
}

export const useStateStep = create<StepState>((set) => {
  return {
    currentStep: 1,
    setCurrentStep: (newStep) => set({ currentStep: newStep }),
  };
});
