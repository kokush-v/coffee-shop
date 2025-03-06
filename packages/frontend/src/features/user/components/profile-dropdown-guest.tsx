import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

import Link from "next/link";

import { LogIn } from "lucide-react";

export const ProfileDropdownGuest = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="w-9 h-9 rounded-full bg-zinc-200 flex items-center justify-center font-semibold text-zinc-500"></div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild className="text-zinc-900">
          <Link href="/auth/login">
            <LogIn />
            Увійти
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
