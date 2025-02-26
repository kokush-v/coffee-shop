import { CartItem } from "@/src/features/cart/types/cart";

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CartState {
  items: CartItem[];
  orderNoteFromCustomer: string;
}

const initialState: CartState = {
  items: [],
  orderNoteFromCustomer: "",
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    loadCartFromStorage: (state) => {
      const cartDataFromStorage = JSON.parse(
        localStorage.getItem("cart") ?? JSON.stringify(initialState)
      );

      if (cartDataFromStorage.items) {
        state.items = cartDataFromStorage.items;
        state.orderNoteFromCustomer = cartDataFromStorage.orderNoteFromCustomer;
      }
    },
    addToCart: (state, action: PayloadAction<CartItem>) => {
      if (state.items.find((item) => item.product.id == action.payload.product.id)) return;
      state.items = [...state.items, action.payload];
    },
    increaseQuantity: (state, action: PayloadAction<number>) => {
      const id = action.payload;

      state.items = state.items.map((item) =>
        item.product.id == id ? { ...item, quantity: item.quantity + 1 } : item
      );
    },
    decreaseQuantity: (state, action: PayloadAction<number>) => {
      const id = action.payload;

      const product = state.items.find((it) => it.product.id == id);

      if (!product) return;

      if (product.quantity <= 1) {
        state.items = state.items.filter((item) => item.product.id !== action.payload);
      } else {
        state.items = state.items.map((item) =>
          item.product.id == id ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
    },
    editOrderNote: (state, action: PayloadAction<string>) => {
      state.orderNoteFromCustomer = action.payload;
    },
    clear: (state) => {
      state.items = [];
      state.orderNoteFromCustomer = "";
    },
  },
});

export const cartMethods = cartSlice.actions;

export default cartSlice.reducer;
