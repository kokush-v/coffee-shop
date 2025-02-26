"use client";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";
import { Button } from "@/src/components/ui/button";
import { ShoppingCart } from "lucide-react";

import { useEffect, useState } from "react";

import { useAppDispatch } from "@/src/store";

import { CartContent } from "@/src/features/cart/ui/cart-content";

import { cartMethods } from "@/src/features/cart/store/cart-slice";
import { Typography } from "@/src/components/ui/typography";

import { CartFooter } from "@/src/features/cart/components/cart-footer";

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
      <SheetContent className="flex flex-col">
        <SheetTitle className="pr-4 -mt-3.5">
          <Typography variant="h2" className="text-lg font-semibold">
            Кошик
          </Typography>
        </SheetTitle>
        <CartContent />
        <SheetFooter>
          <CartFooter />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
