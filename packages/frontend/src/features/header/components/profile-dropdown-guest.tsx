import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Avatar } from "antd";
import { LogIn } from "lucide-react";
import Link from "next/link";

export const ProfileDropdownGuest = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar size={36} />
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
