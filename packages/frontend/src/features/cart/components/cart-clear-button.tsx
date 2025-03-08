import { Trash2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";

import { cartMethods } from "@/src/features/cart/store/cart-slice";
import { useAppDispatch } from "@/src/store";

export const CartClearButton = () => {
  const dispatch = useAppDispatch();

  const { clear } = cartMethods;

  return (
    <Button variant="destructive" onClick={() => dispatch(clear())}>
      <Trash2 />
    </Button>
  );
};
