"use client";

import Link from "next/link";
import { CreditCard, LogIn } from "lucide-react";
import { Button } from "@/src/components/ui/button";

import { cartMethods } from "@/src/features/cart/store/cart-slice";

import { useProfileData } from "@/src/features/user/api/use-profile-data";

import { api } from "@/src/config/api";
import { cn } from "@/src/lib/utils";
import { toast } from "sonner";

import { useAppDispatch, useAppSelector } from "@/src/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { Order } from "@/src/features/orders/types/orders";
import { PaginatedResponse } from "@/src/types/paginated-api-response";
import { Product } from "@/src/features/products/types/product";

interface OrderPayload {
  products: { product_id: Product["id"]; quantity: number }[];
  note: string;
}

interface Props {
  className?: string;
}

type QueryPayload = {
  pageParam: number;
  pages: PaginatedResponse<Order[]>[];
};

export const CartOrderButton = ({ className }: Props) => {
  const router = useRouter();

  const client = useQueryClient();

  const cart = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  const { data: currentUser } = useProfileData();

  const { clear, setSheetOpen } = cartMethods;

  const { mutate } = useMutation({
    mutationKey: ["create-order"],
    mutationFn: async (data: OrderPayload) => {
      const { data: response } = await api.post<Order>("/orders/", data);

      return response;
    },
    onSuccess: (data) => {
      client.setQueryData(["user-orders"], (prev: QueryPayload): QueryPayload => {
        return {
          ...prev,
          pages: prev.pages.map((page, index) =>
            index == 0 ? { ...page, count: page.count + 1, results: [data, ...page.results] } : page
          ),
        };
      });

      dispatch(setSheetOpen(false));

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
      <Link href="/auth" className="flex-1">
        <Button className="w-full">
          <LogIn />
          Увійти, щоб замовити
        </Button>
      </Link>
    );
  }

  return (
    <Button className={cn("select-none disabled:cursor-not-allowed", className)} onClick={checkout}>
      <CreditCard />
      Зробити замовлення
    </Button>
  );
};
