import { OrderStatus } from "@/src/features/orders/types/orders";

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AdminState {
  tab: OrderStatus;
}

const initialState: AdminState = {
  tab: "pending",
};

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setTab: (state, action: PayloadAction<OrderStatus>) => {
      state.tab = action.payload;
    },
  },
});

export const adminMethods = adminSlice.actions;

export default adminSlice.reducer;
