"use client";

import { Button } from "@/src/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";
import { SupportChat } from "@/src/features/support/components/support-chat";
import { MessageCircle } from "lucide-react";
import { useState } from "react";

export const Chat = () => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open}>
      <PopoverTrigger onClick={() => setOpen(true)} asChild>
        <Button className="fixed bottom-4 right-4 rounded-full z-30">
          <MessageCircle />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="left" sideOffset={-55} className="mb-2 pt-2">
        <SupportChat onClose={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  );
};
