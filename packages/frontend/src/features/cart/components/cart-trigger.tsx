"use client";

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/src/components/ui/sheet";
import { Button } from "@/src/components/ui/button";
import { ShoppingCart } from "lucide-react";

import { useEffect, useState } from "react";

import { useAppDispatch } from "@/src/store";

import { CartContent } from "@/src/features/cart/components/cart-content";
import { PopoverTitle } from "@/src/features/cart/components/cart-title";

import { cartMethods } from "@/src/features/cart/store/cart-slice";

export const CartTrigger = () => {
  const dispatch = useAppDispatch();

  const { loadCartFromStorage } = cartMethods;

  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(loadCartFromStorage());
  }, [dispatch, loadCartFromStorage]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <ShoppingCart />
          Кошик
        </Button>
      </SheetTrigger>
      <SheetContent withoutClose className="flex flex-col">
        <SheetTitle>
          <PopoverTitle />
        </SheetTitle>
        <CartContent />
      </SheetContent>
    </Sheet>
  );
};
