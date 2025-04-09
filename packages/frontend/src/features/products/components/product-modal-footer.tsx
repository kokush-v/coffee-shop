import { Button } from "@/src/components/ui/button";

import { useAppDispatch, useAppSelector } from "@/src/store";
import { cartMethods } from "@/src/features/cart/store/cart-slice";
import { useContext } from "react";
import { ProductContext } from "@/src/features/products/context/product-context";

export const ProductModalFooter = ({ setOpen }: { setOpen: (state: boolean) => void }) => {
  const { addToCart, setSheetOpen } = cartMethods;
  const dispatch = useAppDispatch();

  const product = useContext(ProductContext);

  const cartItem = useAppSelector((state) =>
    state.cart.items.find((item) => item.product.id === product?.id)
  );

  if (!product) return null;

  return (
    <>
      <Button
        variant="outline"
        key="submit"
        onClick={() => {
          setOpen(false);
          if (cartItem) return dispatch(setSheetOpen(true));

          dispatch(
            addToCart({
              product,
              quantity: 1,
            })
          );
        }}
      >
        {!!cartItem ? "Перейти у кошик" : `Додати в кошик за ${product.price}₴`}
      </Button>
    </>
  );
};
