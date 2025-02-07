import { Typography } from "@/src/components/ui/typography";
import { Button } from "@/src/components/ui/button";

import { CartItem } from "@/src/features/cart/types/cart";

import { Edit, Minus, Plus, Trash2Icon, Weight } from "lucide-react";

import { weight } from "@/src/lib/utils";

import { cartMethods } from "@/src/features/cart/store/cart-slice";
import { useAppDispatch } from "@/src/store";

const CartProductActions = ({ item }: { item: CartItem }) => {
  const dispatch = useAppDispatch();

  const { deleteItem, decreaseQuantity, increaseQuantity } = cartMethods;

  const shouldDelete = item.quantity <= 1;

  return (
    <>
      <Button
        className="w-10"
        size="sm"
        variant={shouldDelete ? "destructive" : "outline"}
        onClick={() =>
          shouldDelete
            ? dispatch(deleteItem(item.product.id))
            : dispatch(decreaseQuantity(item.product.id))
        }
      >
        {shouldDelete ? (
          <Trash2Icon size={14} className="flex-1 w-full" />
        ) : (
          <Minus size={14} className="flex-1 w-full" />
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
        <Plus size={14} />
      </Button>
      <CartCustomerNote />
    </>
  );
};

const CartCustomerNote = () => {
  return (
    <Button disabled size="sm" variant="outline">
      <Edit />
    </Button>
  );
};

export const CartProduct = ({ item }: { item: CartItem }) => {
  const price = item.product.price * item.quantity;

  return (
    <div className="flex items-center gap-4">
      <div className="h-24 w-24 bg-zinc-100 rounded-lg" />
      <div className="flex flex-col gap-0.5">
        <Typography variant="h4">{item.product.title}</Typography>
        <Typography className="text-xs text-zinc-500 font-semibold flex items-center text-nowrap gap-1">
          <Weight size={14} /> {weight(item.product.weight)}
        </Typography>
        <div className="flex items-center gap-2 mt-1">
          <CartProductActions item={item} />
          <Typography className="text-sm text-zinc-700 font-medium ml-auto">
            {price} грн.
          </Typography>
        </div>
      </div>
    </div>
  );
};
