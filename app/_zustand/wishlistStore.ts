import { create } from "zustand";

// Defined explicitly to prevent compilation reference faults
export type ProductInWishlist = {
  id: string;
  title: string;
  price: number;
  image: string;
  slug: string;
  stockAvailabillity: number;
};

export type State = {
  wishlist: ProductInWishlist[];
  wishQuantity: number;
};

export type Actions = {
  addToWishlist: (product: ProductInWishlist) => void;
  removeFromWishlist: (id: string) => void;
  setWishlist: (wishlist: ProductInWishlist[]) => void;
};

export const useWishlistStore = create<State & Actions>((set) => ({
  wishlist: [],
  wishQuantity: 0,
  
  addToWishlist: (product) => {
    set((state) => {
      const exists = state.wishlist.some((item) => item.id === product.id);
      if (!exists) {
        const updatedList = [...state.wishlist, product];
        return { wishlist: updatedList, wishQuantity: updatedList.length };
      }
      return {}; // Returns empty object if nothing changes, preventing redundant rendering loops
    });
  },
  
  removeFromWishlist: (id) => {
    set((state) => {
      const exists = state.wishlist.some((item) => item.id === id);
      if (exists) {
        const updatedList = state.wishlist.filter((item) => item.id !== id);
        return { wishlist: updatedList, wishQuantity: updatedList.length };
      }
      return {};
    });
  },
  
  setWishlist: (wishlist: ProductInWishlist[]) => {
    set(() => ({
      wishlist: [...wishlist],
      wishQuantity: wishlist.length
    }));
  },
}));
