import { AccordionContent, AccordionItem, AccordionTrigger } from "@/src/components/ui/accordion";

import { OrdersItemProduct } from "@/src/features/orders/components/orders-item-product";

import { Order } from "@/src/features/orders/types/orders";
import { overallPrice } from "@/src/lib/utils";

import { motion } from "framer-motion";

export const OrdersItem = ({ order }: { order: Order }) => {
  const orderDateString = new Date(order.created_at).toLocaleString();
  const price: number = overallPrice(order.products);

  return (
    <motion.div
      key={order.id}
      exit={{
        opacity: 0,
        marginTop: -50,
      }}
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
          <p className="text-xs text-primary/70 font-medium">
            Вартість всього замовлення:{" "}
            <span className="font-semibold text-primary/90">{price} грн.</span>
          </p>
          {order.products.map((product, index) => (
            <OrdersItemProduct key={index} product={product} />
          ))}
        </AccordionContent>
      </AccordionItem>
    </motion.div>
  );
};
