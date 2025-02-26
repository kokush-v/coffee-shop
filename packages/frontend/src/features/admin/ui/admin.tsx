"use client";

import { RotateCcw } from "lucide-react";

import { AnimatePresence } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import { Typography } from "@/src/components/ui/typography";
import { Accordion } from "@/src/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";

import { ActivityIndicator } from "@/src/components/ui/activity-indicator";
import { AdminOrderComponent } from "@/src/features/admin/components/admin-order-component";

import { Order, OrderStatus } from "@/src/features/orders/types/orders";
import { PaginatedResponse } from "@/src/types/paginated-api-response";

import { useOrdersAPI } from "@/src/features/admin/api/use-orders-api";
import { useState } from "react";

interface AdminProps {
  initialData: PaginatedResponse<Order[]>;
}

export const Admin = ({ initialData }: AdminProps) => {
  const [tab, setTab] = useState<OrderStatus>("pending");
  const { data, fetchNextPage, hasNextPage } = useOrdersAPI(initialData, tab);

  return (
    <div className="flex flex-col flex-1">
      <Typography
        variant="h2"
        className="text-zinc-700 flex justify-between items-baseline max-sm:text-lg"
      >
        Замовлення користувачів{" "}
      </Typography>
      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as OrderStatus)}
        defaultValue="pending"
        className="mt-2"
      >
        <TabsList>
          <TabsTrigger value="pending">В обробці</TabsTrigger>
          <TabsTrigger value="ready">Готові</TabsTrigger>
          <TabsTrigger value="canceled">Скасовані</TabsTrigger>
        </TabsList>
      </Tabs>
      {data ? (
        <>
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
        </>
      ) : (
        <div className="flex-1 grid place-items-center">
          <ActivityIndicator />
        </div>
      )}
    </div>
  );
};
