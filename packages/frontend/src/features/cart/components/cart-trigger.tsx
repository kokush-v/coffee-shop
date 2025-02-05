"use client";

import { Button, Popover } from "antd";

import { CartContent } from "@/src/features/cart/components/cart-content";

export const CartTrigger = () => {
  return (
    <div>
      <Popover
        content={CartContent}
        title={() => <h2 className="text-lg font-semibold">Кошик</h2>}
        placement="bottomRight"
        trigger="click"
      >
        <Button>Кошик</Button>
      </Popover>
    </div>
  );
};
