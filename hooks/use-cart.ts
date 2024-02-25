import { create } from "zustand";
import {
  persist,
  createJSONStorage,
} from "zustand/middleware";
import { Product } from "@/app/types";
import toast from "react-hot-toast";

interface CartStore {
  items: Product[];
  addItem: (data: Product) => void;
  removeItem: (id: string) => void;
  onDecrease: (id: string) => void;
  removeAll: () => void;
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      addItem: (data: Product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) => item.id === data.id
        );

        if (!existingItem) {
          set({
            items: [
              ...currentItems,
              {
                ...data,
                quantity: 1,
                stock: data.stock - 1,
              },
            ],
          });
          toast.success("Item added to cart");
          return;
        }

        if (existingItem.stock === 0) {
          toast.error("Max stock reached.");
          return;
        }

        set({
          items: currentItems.map((item) =>
            item.id === data.id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                  stock: item.stock - 1,
                }
              : item
          ),
        });
      },
      onDecrease: (id: string) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) => item.id === id
        );

        if (!existingItem) {
          toast.success("Item is not on the cart.");
          return;
        }

        if (existingItem.quantity === 0) {
          set({
            items: [
              ...get().items.filter(
                (item) => item.id !== id
              ),
            ],
          });
          toast.success("Item removed from the cart.");
          return;
        }

        set({
          items: currentItems.map((item) =>
            item.id === id
              ? {
                  ...item,
                  quantity: item.quantity - 1,
                  stock: item.stock + 1,
                }
              : item
          ),
        });
      },
      removeItem: (id: string) => {
        set({
          items: [
            ...get().items.filter((item) => item.id !== id),
          ],
        });
        toast.success("Item removed from the cart.");
      },
      removeAll: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCart;
