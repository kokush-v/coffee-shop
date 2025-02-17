"use client";

import { useEffect } from "react";

import { Popover } from "antd";

import { useAppDispatch, useAppSelector } from "@/src/store";

import { Button } from "@/src/components/ui/button";
import { Typography } from "@/src/components/ui/typography";

import { CartContent } from "@/src/features/cart/components/cart-content";
import { cartMethods } from "@/src/features/cart/store/cart-slice";
import { overallPrice } from "@/src/lib/utils";

const PopoverTitle = () => {
  const items = useAppSelector((state) => state.cart.items);

  const price: number = overallPrice(items);

  return (
    <div className="flex flex-row justify-between items-center">
      <Typography variant="h2" className="text-lg font-semibold">
        Кошик
      </Typography>
      <Typography variant="p" className="font-semibold text-zinc-700">
        Вартість: {price} грн.
      </Typography>
    </div>
  );
};

export const CartTrigger = () => {
  const dispatch = useAppDispatch();

  const { loadCartFromStorage } = cartMethods;

  useEffect(() => {
    dispatch(loadCartFromStorage());
  }, [dispatch, loadCartFromStorage]);

  return (
    <div>
      <Popover
        content={CartContent}
        title={() => <PopoverTitle />}
        placement="bottomRight"
        trigger="click"
      >
        <Button variant="outline">Кошик</Button>
      </Popover>
    </div>
  );
};
