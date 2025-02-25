"use client";

import { Button } from "@/src/components/ui/button";
import { api } from "@/src/config/api";
import { cartMethods } from "@/src/features/cart/store/cart-slice";
import { Product } from "@/src/features/products/types/product";
import { useProfileData } from "@/src/features/user/api/use-profile-data";
import { cn } from "@/src/lib/utils";

import { useAppDispatch, useAppSelector } from "@/src/store";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface OrderPayload {
  products: { product_id: Product["id"]; quantity: number }[];
  note: string;
}

interface Props {
  className?: string;
}

export const CartOrderButton = ({ className }: Props) => {
  const router = useRouter();

  const cart = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  const { data: currentUser } = useProfileData();

  const { clear } = cartMethods;

  const { mutate } = useMutation({
    mutationKey: ["create-order"],
    mutationFn: async (data: OrderPayload) => await api.post("/orders/", data),
    onSuccess: () => {
      toast.success("Ваше замовлення було створено.", {
        action: {
          label: "Мої замовлення",
          onClick: () => router.push("/my/orders"),
        },
      });
      dispatch(clear());
    },
  });

  const checkout = () => {
    const products = cart.items.map((item) => ({
      product_id: item.product.id,
      quantity: item.quantity,
    }));

    mutate({
      products,
      note: cart.orderNoteFromCustomer,
    });
  };

  if (!currentUser) {
    return (
      <Button className="flex-1" asChild>
        <Link href="/auth">Увійти, щоб замовити</Link>
      </Button>
    );
  }

  return (
    <Button className={cn("select-none disabled:cursor-not-allowed", className)} onClick={checkout}>
      Зробити замовлення
    </Button>
  );
};
