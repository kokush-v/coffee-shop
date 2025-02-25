import { Check, X } from "lucide-react";
import { toast } from "sonner";

import { DropdownMenuItem } from "@/src/components/ui/dropdown-menu";

import { useOrdersAction } from "@/src/features/admin/api/use-orders-action";

import { AdminOrderResult, OrderStatusPayload } from "@/src/features/admin/types/admin-orders";

export const OrderReadyButton = ({ orderId }: { orderId: AdminOrderResult["id"] }) => {
  const { mutateAsync } = useOrdersAction({ orderId, status: OrderStatusPayload.READY });

  const onClick = () =>
    toast.promise(mutateAsync, {
      loading: "Змінюємо статус...",
      success: `Змінили статус #${orderId} замовлення на готове`,
      error: "Щось пішло не так.",
    });

  return (
    <DropdownMenuItem onClick={onClick}>
      <Check /> Замовлення готове
    </DropdownMenuItem>
  );
};

export const OrderCancelButton = ({ orderId }: { orderId: AdminOrderResult["id"] }) => {
  const { mutateAsync } = useOrdersAction({ orderId, status: OrderStatusPayload.CANCELLED });

  const onClick = () =>
    toast.promise(mutateAsync, {
      loading: "Змінюємо статус...",
      success: `Змінили статус #${orderId} замовлення на скасоване`,
      error: "Щось пішло не так.",
    });

  return (
    <DropdownMenuItem onClick={onClick} className="text-red-400 focus:text-red-400">
      <X /> Відмінити замовлення
    </DropdownMenuItem>
  );
};
