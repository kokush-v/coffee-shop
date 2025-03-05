import * as React from "react";

import { useMediaQuery } from "@/src/hooks/use-media-query";
import { Dialog, DialogContent, DialogTrigger } from "@/src/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "@/src/components/ui/drawer";

type Props = {
  open: boolean;
  setOpen: (state: boolean) => void;
  trigger: React.ReactNode;
  children: React.ReactNode;
};

export function ResponsiveDialog({ open, setOpen, trigger, children }: Props) {
  const isDesktop = useMediaQuery("(min-width: 520px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="pt-11">{children}</DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="px-2 flex flex-col min-h-[90%] pb-3">{children}</DrawerContent>
    </Drawer>
  );
}
