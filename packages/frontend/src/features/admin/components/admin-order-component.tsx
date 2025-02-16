"use client";

import { motion } from "framer-motion";

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/src/components/ui/accordion";

import { OrdersItemProduct } from "@/src/features/user/components/orders-item-product";
import { AdminOrderHeader } from "@/src/features/admin/components/admin-order-header";

import { AdminOrderResult } from "@/src/features/admin/types/admin-orders";

interface AdminOrderProps {
  order: AdminOrderResult;
}

export const AdminOrderComponent = ({ order }: AdminOrderProps) => {
  const orderDateString = new Date(order.created_at).toLocaleString();

  return (
    <motion.div
      key={order.id}
      initial={{
        opacity: 0,
        marginTop: -50,
      }}
      animate={{
        opacity: 1,
        marginTop: 0,
      }}
    >
      <AccordionItem value={order.id.toString()}>
        <AccordionTrigger>
          <p className="flex items-baseline justify-between flex-1 pr-2">
            Замовлення #{order.id} <span className="text-xs text-zinc-400">{orderDateString}</span>
          </p>
        </AccordionTrigger>
        <AccordionContent className="space-y-2">
          <AdminOrderHeader order={order} />
          {order.products.map((product, index) => (
            <OrdersItemProduct
              key={index}
              item={{
                product: product.product,
                quantity: product.quantity,
                customerNote: "",
              }}
            />
          ))}
        </AccordionContent>
      </AccordionItem>
    </motion.div>
  );
};
