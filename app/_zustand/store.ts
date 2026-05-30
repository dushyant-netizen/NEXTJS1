import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ProductInCart = {
  id: string;
  title: string;
  price: number;
  image: string;
  amount: number;
};

export type State = {
  products: ProductInCart[];
  savedItems: ProductInCart[]; // Added
  allQuantity: number;
  total: number;
};

export type Actions = {
  addToCart: (newProduct: ProductInCart) => void;
  removeFromCart: (id: string) => void;
  updateCartAmount: (id: string, amount: number) => void;
  calculateTotals: () => void;
  clearCart: () => void;
  saveForLater: (id: string) => void; // Added
  moveToCart: (id: string) => void;   // Added to move items back
};

export const useProductStore = create<State & Actions>()(
  persist(
    (set) => ({
      products: [],
      savedItems: [], // Added
      allQuantity: 0,
      total: 0,

      addToCart: (newProduct) => {
        set((state) => {
          const cartItem = state.products.find((item) => item.id === newProduct.id);
          if (cartItem) {
            return {
              products: state.products.map((product) => {
                if (product.id === cartItem.id) {
                  product.amount += newProduct.amount;
                }
                return product;
              }),
            };
          } else {
            return { products: [...state.products, newProduct] };
          }
        });
      },

      clearCart: () => {
        set((state) => {
          return {
            products: [],
            allQuantity: 0,
            total: 0,
          };
        });
      },

      removeFromCart: (id) => {
        set((state) => {
          return {
            products: state.products.filter((product) => product.id !== id),
            savedItems: state.savedItems.filter((product) => product.id !== id), // Also clear from saved if deleted
          };
        });
      },

      calculateTotals: () => {
        set((state) => {
          let totalAmount = 0;
          let total = 0;
          state.products.forEach((item) => {
            totalAmount += item.amount;
            total += item.amount * item.price;
          });
          return {
            allQuantity: totalAmount,
            total: total,
          };
        });
      },

      updateCartAmount: (id, amount) => {
        set((state) => {
          const cartItem = state.products.find((item) => item.id === id);
          if (cartItem) {
            return {
              products: state.products.map((product) => {
                if (product.id === cartItem.id) {
                  product.amount = amount;
                }
                return product;
              }),
            };
          } else {
            return { products: [...state.products] };
          }
        });
      },

      // Move from Cart -> Save for Later
      saveForLater: (id) => {
        set((state) => {
          const itemToSave = state.products.find((item) => item.id === id);
          if (!itemToSave) return {};

          const updatedProducts = state.products.filter((item) => item.id !== id);
          const alreadySaved = state.savedItems.some((item) => item.id === id);
          const updatedSaved = alreadySaved ? state.savedItems : [...state.savedItems, itemToSave];

          return {
            products: updatedProducts,
            savedItems: updatedSaved,
          };
        });
      },

      // Move from Save for Later -> Back to Cart
      moveToCart: (id) => {
        set((state) => {
          const itemToRestore = state.savedItems.find((item) => item.id === id);
          if (!itemToRestore) return {};

          const updatedSaved = state.savedItems.filter((item) => item.id !== id);
          const alreadyInCart = state.products.some((item) => item.id === id);
          const updatedProducts = alreadyInCart ? state.products : [...state.products, itemToRestore];

          return {
            products: updatedProducts,
            savedItems: updatedSaved,
          };
        });
      },
    }),
    {
      name: "products-storage",
      storage: createJSONStorage(() => sessionStorage), // Matches your configuration
    }
  )
);
