"use client";

import { RotateCcw } from "lucide-react";

import { AnimatePresence } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import { Typography } from "@/src/components/ui/typography";
import { Accordion } from "@/src/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";

import { ActivityIndicator } from "@/src/components/ui/activity-indicator";
import { AdminOrderComponent } from "@/src/features/admin/components/admin-order-component";

import { OrdersResponse } from "@/src/features/orders/types/orders";
import { useOrdersAPI } from "@/src/features/admin/api/use-orders-api";

interface AdminProps {
  initialData: OrdersResponse;
}

export const Admin = ({ initialData }: AdminProps) => {
  const { data, fetchNextPage, hasNextPage } = useOrdersAPI(initialData);

  if (!data) {
    return <ActivityIndicator />;
  }

  return (
    <div>
      <Typography
        variant="h2"
        className="text-zinc-700 flex justify-between items-baseline max-sm:text-lg"
      >
        Замовлення користувачів{" "}
      </Typography>
      <Tabs defaultValue="pending" className="mt-2">
        <TabsList>
          <TabsTrigger value="pending">В обробці</TabsTrigger>
          <TabsTrigger value="ready">Готові</TabsTrigger>
          <TabsTrigger value="cancelled">Скасовані</TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="flex flex-col">
          <Accordion type="single" collapsible>
            <AnimatePresence>
              {data.pages.map(
                (page) =>
                  page?.results &&
                  page.results.map((order) => <AdminOrderComponent key={order.id} order={order} />)
              )}
            </AnimatePresence>
          </Accordion>
          <Button
            disabled={!hasNextPage}
            onClick={() => fetchNextPage()}
            variant="ghost"
            size="sm"
            className="text-xs mt-2 mx-auto"
          >
            <RotateCcw />
            {hasNextPage ? "Завантажити ще" : "Ви дійшли до кінця"}
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};
