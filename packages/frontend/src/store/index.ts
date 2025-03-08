import { configureStore, Middleware } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import cartSlice, { CartState } from "@/src/features/cart/store/cart-slice";
import adminSlice, { AdminState } from "@/src/features/admin/store/admin-slice";

const localStorageMiddleware: Middleware =
  (store: { getState: () => { cart: CartState; admin: AdminState } }) => (next) => (action) => {
    const result = next(action);

    localStorage.setItem("cart", JSON.stringify(store.getState().cart));

    return result;
  };

export const store = configureStore({
  reducer: {
    cart: cartSlice,
    admin: adminSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
