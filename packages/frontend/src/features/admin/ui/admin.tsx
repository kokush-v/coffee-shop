"use client";

import { Typography } from "@/src/components/ui/typography";
import { Accordion } from "@/src/components/ui/accordion";

import { ActivityIndicator } from "@/src/components/ui/activity-indicator";
import { AdminOrderComponent } from "@/src/features/admin/components/admin-order-component";

import { AdminOrders } from "@/src/features/admin/types/admin-orders";
import { useOrdersAPI } from "@/src/features/admin/api/use-orders-api";

interface AdminProps {
  initialData: AdminOrders;
}

export const Admin = ({ initialData }: AdminProps) => {
  const { data } = useOrdersAPI(initialData);

  if (!data) {
    return <ActivityIndicator />;
  }

  return (
    <div>
      <Typography variant="h2" className="text-zinc-700 flex justify-between items-baseline">
        Замовлення користувачів{" "}
        <span className="text-sm font-semibold text-zinc-500">{data.count} замовлень</span>
      </Typography>
      <Accordion type="single" collapsible>
        {data.results.map((order) => (
          <AdminOrderComponent key={order.id} order={order} />
        ))}
      </Accordion>
    </div>
  );
};
