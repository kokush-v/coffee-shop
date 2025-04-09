"use client";

import { Accordion } from "@/src/components/ui/accordion";
import { Typography } from "@/src/components/ui/typography";
import { ActivityIndicator } from "@/src/components/ui/activity-indicator";

import { OrdersItem } from "@/src/features/orders/components/orders-item";

import { useUserOrdersAPI } from "@/src/features/orders/api/use-user-orders-api";
import { Button } from "@/src/components/ui/button";
import { RotateCcw } from "lucide-react";

export const Orders = () => {
  const { data, hasNextPage, fetchNextPage } = useUserOrdersAPI();

  if (!data) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <ActivityIndicator />
      </div>
    );
  }

  return (
    <div>
      <Typography variant="h2" className="text-zinc-700">
        Мої замовлення
      </Typography>
      <main className="space-y-2 flex flex-col">
        <Accordion type="single" collapsible>
          {data.pages.map((data) =>
            data?.results.map((order, index) => <OrdersItem key={index} order={order} />)
          )}
        </Accordion>
        {hasNextPage && (
          <Button
            disabled={!hasNextPage}
            onClick={() => fetchNextPage()}
            variant="ghost"
            size="sm"
            className="text-xs mt-2 mx-auto mb-3"
          >
            <RotateCcw />
            Завантажити ще
          </Button>
        )}
      </main>
    </div>
  );
};
