import { AdminOrderNote } from "@/src/features/admin/components/admin-order-note";

import { Check, Ellipsis, X } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

import { OrderStatus } from "@/src/features/admin/const/order-status";

import { AdminOrderResult } from "@/src/features/admin/types/admin-orders";

export const AdminOrderHeader = ({ order }: { order: AdminOrderResult }) => {
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
                <DropdownMenuItem>
                  <Check /> Замовлення готове
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-400 focus:text-red-400">
                  <X /> Відмінити замовлення
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
