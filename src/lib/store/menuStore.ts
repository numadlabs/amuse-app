import { create } from "zustand";

interface MenuItem {
  id: string;
  name: string;
  image: string | null;
  price: string;
  description: string;
  quantity?: number;
}

export interface MenuStore {
  selectedItems: MenuItem[];
  addItem: (item: MenuItem) => void;
  removeItem: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  clearItems: () => void;
  getItemById: (itemId: string) => MenuItem | undefined;
  getTotalQuantity: () => number;
  getTotalPrice: () => number;
}

export const useMenuStore = create<MenuStore>((set, get) => ({
  selectedItems: [],

  addItem: (item: MenuItem) => set((state) => {
    const existingItem = state.selectedItems.find((i) => i.id === item.id);

    if (existingItem) {
      // If item exists, update its quantity
      return {
        selectedItems: state.selectedItems.map((i) =>
          i.id === item.id
            ? { ...i, quantity: (i.quantity || 0) + (item.quantity || 1) }
            : i
        ),
      };
    }

    // New item, add with quantity 1
    return {
      selectedItems: [...state.selectedItems, { ...item, quantity: item.quantity || 1 }],
    };
  }),

  removeItem: (itemId: string) => set((state) => ({
    selectedItems: state.selectedItems.filter((item) => item.id !== itemId)
  })),

  updateItemQuantity: (itemId: string, quantity: number) => set((state) => ({
    selectedItems: state.selectedItems.map((item) =>
      item.id === itemId
        ? { ...item, quantity: Math.max(0, quantity) }
        : item
    ).filter((item) => item.quantity > 0) // Remove items with quantity 0
  })),

  clearItems: () => set({ selectedItems: [] }),

  getItemById: (itemId: string) => {
    return get().selectedItems.find((item) => item.id === itemId);
  },

  getTotalQuantity: () => {
    return get().selectedItems.reduce(
      (total, item) => total + (item.quantity || 0),
      0
    );
  },

  getTotalPrice: () => {
    return get().selectedItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace('$', ''));
      return total + price * (item.quantity || 1);
    }, 0);
  }
}));