import { AdminOrderNote } from "@/src/features/admin/components/admin-order-note";
import {
  OrderCancelButton,
  OrderReadyButton,
} from "@/src/features/admin/components/admin-order-actions";

import { Ellipsis } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

import { OrderStatus } from "@/src/features/admin/const/order-status";

import { Order } from "@/src/features/orders/types/orders";

export const AdminOrderHeader = ({ order }: { order: Order }) => {
  return (
    <div className="flex">
      <AdminOrderNote value={order.note} />
      <div className="ml-auto flex items-center gap-2">
        <p className="text-xs font-medium text-zinc-600">
          Стан замовлення:{" "}
          <span className="text-zinc-700 font-bold">{OrderStatus[order.status]}</span>
        </p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost">
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {order.status == "pending" && (
              <>
                <OrderReadyButton orderId={order.id} />
                <OrderCancelButton orderId={order.id} />
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
