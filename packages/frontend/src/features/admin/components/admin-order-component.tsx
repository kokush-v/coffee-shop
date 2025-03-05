"use client";

import { motion } from "framer-motion";

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/src/components/ui/accordion";

import { OrdersItemProduct } from "@/src/features/orders/components/orders-item-product";
import { AdminOrderHeader } from "@/src/features/admin/components/admin-order-header";

import { Order } from "@/src/features/orders/types/orders";

import { useOrdersAPI } from "@/src/features/admin/api/use-orders-api";
import { useAppSelector } from "@/src/store";

interface AdminOrderProps {
  order: Order;
}

export const AdminOrderComponent = ({ order }: AdminOrderProps) => {
  const orderDateString = new Date(order.created_at).toLocaleString();

  const { tab } = useAppSelector((state) => state.admin);
  const { isFetching } = useOrdersAPI(undefined, tab);

  return (
    <motion.div key={order.id}>
      <AccordionItem value={order.id.toString()}>
        <AccordionTrigger disabled={isFetching}>
          <p className="flex items-baseline justify-between flex-1 pr-2">
            Замовлення #{order.id}
            <span className="text-xs text-zinc-400">{orderDateString}</span>
          </p>
        </AccordionTrigger>
        <AccordionContent className="space-y-2">
          <AdminOrderHeader order={order} />
          {order.products.map((product, index) => (
            <OrdersItemProduct key={index} product={product} />
          ))}
        </AccordionContent>
      </AccordionItem>
    </motion.div>
  );
};
