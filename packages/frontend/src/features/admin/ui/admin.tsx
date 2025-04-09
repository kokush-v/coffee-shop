"use client";

import { RotateCcw } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Typography } from "@/src/components/ui/typography";
import { Accordion } from "@/src/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";

import { ActivityIndicator } from "@/src/components/ui/activity-indicator";
import { AdminOrderComponent } from "@/src/features/admin/components/admin-order-component";

import { Order, OrderStatus } from "@/src/features/orders/types/orders";
import { PaginatedResponse } from "@/src/types/paginated-api-response";

import { useOrdersAPI } from "@/src/features/admin/api/use-orders-api";
import { usePrevious } from "@/src/hooks/use-previous-value";

import { cn } from "@/src/lib/utils";
import { useAppDispatch, useAppSelector } from "@/src/store";
import { adminMethods } from "@/src/features/admin/store/admin-slice";

interface AdminProps {
  initialData: PaginatedResponse<Order[]>;
}

const RenderAdminOrders = ({ initialData }: { initialData: PaginatedResponse<Order[]> }) => {
  const { tab } = useAppSelector((state) => state.admin);
  const { data, fetchNextPage, hasNextPage, isFetching } = useOrdersAPI(initialData, tab);

  const prevData = usePrevious(data);

  if (!data && !prevData) {
    return (
      <div className="flex-1 grid place-items-center">
        <ActivityIndicator />
      </div>
    );
  }

  if (data?.pages[0]?.count == 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <p className="text-primary/70 text-sm font-medium">Немає замовлень</p>
      </div>
    );
  }

  if (data || prevData) {
    return (
      <>
        <Accordion
          type="single"
          collapsible
          className={cn("duration-100", isFetching && "opacity-30 pointer-events-none")}
        >
          {(data || prevData)?.pages.map(
            (page) =>
              page?.results &&
              page.results.map((order) => <AdminOrderComponent key={order.id} order={order} />)
          )}
        </Accordion>
        {hasNextPage && (
          <Button
            disabled={!hasNextPage}
            onClick={() => fetchNextPage()}
            variant="ghost"
            size="sm"
            className="text-xs mt-2 mx-auto"
          >
            <RotateCcw />
            Завантажити ще
          </Button>
        )}
      </>
    );
  }
};

export const Admin = ({ initialData }: AdminProps) => {
  const dispatch = useAppDispatch();

  const { tab } = useAppSelector((state) => state.admin);
  const { setTab } = adminMethods;

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
        onValueChange={(value) => dispatch(setTab(value as OrderStatus))}
        defaultValue="pending"
        className="mt-2"
      >
        <TabsList>
          <TabsTrigger value="pending">В обробці</TabsTrigger>
          <TabsTrigger value="ready">Готові</TabsTrigger>
          <TabsTrigger value="canceled">Скасовані</TabsTrigger>
        </TabsList>
      </Tabs>
      <RenderAdminOrders initialData={initialData} />
    </div>
  );
};
