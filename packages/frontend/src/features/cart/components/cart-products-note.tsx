import { useEffect, useState } from "react";

import { Modal } from "antd";
import { Edit } from "lucide-react";

import { Typography } from "@/src/components/ui/typography";
import { TextArea } from "@/src/components/ui/text-area";
import { Button } from "@/src/components/ui/button";

import { useAppDispatch, useAppSelector } from "@/src/store";
import { cartMethods } from "@/src/features/cart/store/cart-slice";

export const CartProductsNote = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  const dispatch = useAppDispatch();

  const orderNote = useAppSelector((state) => state.cart.orderNoteFromCustomer);

  const { editOrderNote } = cartMethods;

  useEffect(() => {
    if (orderNote && !open) {
      setText(orderNote);
    }
  }, [orderNote, open]);

  const submitCallback = (text: string) => {
    dispatch(editOrderNote(text));
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm" variant="outline">
        <Edit />
      </Button>
      <Modal
        onCancel={() => setOpen(false)}
        title={<Typography className="text-zinc-600">Залишити побажання до замовлення</Typography>}
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
        <Typography className="text-sm mb-2 text-zinc-800 font-medium">
          Додайте побажання до вашого замовлення.
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
