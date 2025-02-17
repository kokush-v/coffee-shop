import { CartItem } from "@/src/features/cart/types/cart";
import { Product } from "@/src/features/products/types/product";

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

type AddToCartPayload = Omit<CartItem, "customerNote">;

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    loadCartFromStorage: (state) => {
      state.items = JSON.parse(localStorage.getItem("cart") ?? "[]");
    },
    addToCart: (state, action: PayloadAction<AddToCartPayload>) => {
      if (state.items.find((item) => item.product.id == action.payload.product.id)) return;
      state.items = [
        ...state.items,
        {
          ...action.payload,
          customerNote: "",
        },
      ];
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
    editNoteForProduct: (state, action: PayloadAction<{ id: Product["id"]; note: string }>) => {
      state.items = state.items.map((item) =>
        item.product.id == action.payload.id ? { ...item, customerNote: action.payload.note } : item
      );
    },
  },
});

export const cartMethods = cartSlice.actions;

export default cartSlice.reducer;
