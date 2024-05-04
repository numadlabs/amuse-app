import { create } from "zustand";

interface Notification {
  id: string;
  name: string;
  amount: number;
}

interface NotificationState {
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
}

const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  setNotifications: (notifications) => set({ notifications }),
}));

export default useNotificationStore;
