import { useContext, useEffect, useState } from "react";

import { Modal } from "antd";
import { Edit } from "lucide-react";

import { Typography } from "@/src/components/ui/typography";
import { TextArea } from "@/src/components/ui/text-area";
import { Button } from "@/src/components/ui/button";

import { CartProductContext } from "@/src/features/cart/context/cart-product-context";

import { useAppDispatch } from "@/src/store";
import { cartMethods } from "@/src/features/cart/store/cart-slice";

export const CartProductNote = () => {
  const item = useContext(CartProductContext);

  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (item?.customerNote && !open) {
      setText(item.customerNote);
    }
  }, [item, open]);

  const submitCallback = (text: string) => {
    if (!item) return;

    dispatch(
      cartMethods.editNoteForProduct({
        id: item.product.id,
        note: text,
      })
    );
    setOpen(false);
  };

  if (!item) return;

  return (
    <>
      <Button disabled={!item} onClick={() => setOpen(true)} size="sm" variant="outline">
        <Edit />
      </Button>
      <Modal
        onCancel={() => setOpen(false)}
        title={
          <Typography className="text-zinc-600 line-clamp-1">
            Примітка для <span className="text-black">{item.product.title}</span>
          </Typography>
        }
        footer={() => (
          <section className="space-x-2">
            <Button
              onClick={() => {
                setText("");
                submitCallback("");
              }}
              key="cancel"
              variant="ghost"
              className="text-red-400 hover:text-red-400"
            >
              Видалити
            </Button>
            <Button onClick={() => submitCallback(text)} key="submit" variant="outline">
              Додати
            </Button>
          </section>
        )}
        open={open}
        centered
      >
        <Typography className="text-sm mb-2 text-zinc-600 font-medium">
          Додайте примітку для того, хто буде збирати ваше замовлення.
        </Typography>
        <TextArea
          className="h-[160px]"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
      </Modal>
    </>
  );
};
