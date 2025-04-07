import { useEffect, useState } from "react";

import { Edit } from "lucide-react";

import { TextArea } from "@/src/components/ui/text-area";
import { Button } from "@/src/components/ui/button";

import { useAppDispatch, useAppSelector } from "@/src/store";
import { cartMethods } from "@/src/features/cart/store/cart-slice";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";

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
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="text-primary/70">
            <Edit />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-zinc-700 -mt-2 mb-6 font-semibold text-lg">
              Залишити побажання до замовлення
            </DialogTitle>
          </DialogHeader>
          <TextArea
            className="h-[160px]"
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
          <DialogFooter className="gap-2 mt-4">
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
