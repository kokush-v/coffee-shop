import { Minus, Plus, Trash2Icon, Weight } from "lucide-react";
import { Typography } from "@/src/components/ui/typography";
import { Button } from "@/src/components/ui/button";

import { CartItem } from "@/src/features/cart/types/cart";

import { useAppDispatch } from "@/src/store";
import { cartMethods } from "@/src/features/cart/store/cart-slice";

import { CartProductContext } from "@/src/features/cart/context/cart-product-context";
import Image from "next/image";

const iconSize = 14;

const CartProductActions = ({ item }: { item: CartItem }) => {
  const dispatch = useAppDispatch();

  const { decreaseQuantity, increaseQuantity } = cartMethods;

  const shouldDelete = item.quantity <= 1;

  return (
    <>
      <Button
        className="w-10"
        size="sm"
        variant={shouldDelete ? "destructive" : "outline"}
        onClick={() => dispatch(decreaseQuantity(item.product.id))}
      >
        {shouldDelete ? (
          <Trash2Icon size={iconSize} className="flex-1 w-full" />
        ) : (
          <Minus size={iconSize} className="flex-1 w-full" />
        )}
      </Button>
      <Typography className="text-sm font-medium text-zinc-700 w-4 text-center">
        {item.quantity}
      </Typography>
      <Button
        className="w-10"
        size="sm"
        variant="outline"
        onClick={() => dispatch(increaseQuantity(item.product.id))}
      >
        <Plus size={iconSize} />
      </Button>
    </>
  );
};

export const CartProduct = ({ item }: { item: CartItem }) => {
  const price = item.product.price * item.quantity;

  return (
    <CartProductContext.Provider value={item}>
      <div className="flex items-center gap-4">
        <Image
          src={item.product.image_src}
          alt={item.product.title}
          width={128}
          height={128}
          className="rounded-lg shrink-0 w-24 h-24 object-cover"
        />
        <div className="flex flex-col gap-0.5">
          <Typography variant="h4">{item.product.title}</Typography>
          <Typography className="text-xs text-zinc-500 font-semibold flex items-center gap-1">
            <Weight size={iconSize} /> {item.product.product_weight} г.
          </Typography>
          <div className="flex items-center gap-2 mt-1">
            <CartProductActions item={item} />
            <Typography className="text-sm text-zinc-600 font-medium ml-auto">
              {price} грн.
            </Typography>
          </div>
        </div>
      </div>
    </CartProductContext.Provider>
  );
};
