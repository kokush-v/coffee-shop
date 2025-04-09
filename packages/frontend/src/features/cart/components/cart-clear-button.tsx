import { Trash2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";

import { cartMethods } from "@/src/features/cart/store/cart-slice";
import { useAppDispatch } from "@/src/store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { useState } from "react";

export const CartClearButton = () => {
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);

  const { clear, setSheetOpen } = cartMethods;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Видалити всі товари</DialogTitle>
          <DialogDescription>
            Ви впевнені, що хочете видалити всі товари з кошику? Ця дія є незворотньою.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Відмінити
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              dispatch(setSheetOpen(false));
              setOpen(false);
              dispatch(clear());
            }}
          >
            Видалити
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
