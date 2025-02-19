"use client";

import { Typography } from "@/src/components/ui/typography";
import { Accordion } from "@/src/components/ui/accordion";

import { ActivityIndicator } from "@/src/components/ui/activity-indicator";
import { AdminOrderComponent } from "@/src/features/admin/components/admin-order-component";

import { AdminOrders } from "@/src/features/admin/types/admin-orders";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/src/config/api";

interface AdminProps {
  initialData: AdminOrders;
}

export const Admin = ({ initialData }: AdminProps) => {
  const { data } = useQuery<AdminOrders>({
    queryKey: ["orders"],
    queryFn: async () => (await api.get("/orders/")).data,
    initialData,
    staleTime: 1000 * 60 * 60 * 0.1,
  });

  // const client = useQueryClient();

  // const simulateCreate = () => {
  //   client.setQueryData(["orders"], (prev: AdminOrders) => {
  //     return {
  //       count: prev.results.length + 1,
  //       results: [{ ...prev.results[0], id: prev.results.length + 1 }, ...prev.results],
  //     };
  //   });
  // };

  if (!data) {
    return <ActivityIndicator />;
  }

  return (
    <div>
      {/* <Button onClick={simulateCreate} variant="ghost">
        simulate new item {JSON.stringify({ isLoading })}
      </Button> */}
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
