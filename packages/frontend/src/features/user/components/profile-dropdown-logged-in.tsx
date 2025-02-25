import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

import { Avatar } from "antd";
import { LogOut, User } from "lucide-react";

import { useQueryClient } from "@tanstack/react-query";
import { useProfileData } from "@/src/features/user/api/use-profile-data";
import Link from "next/link";

import { api } from "@/src/config/api";

export const ProfileDropdownLoggedIn = () => {
  const { data } = useProfileData();

  const client = useQueryClient();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar size={36} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Привіт, {data?.username}</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href="/my">
            <User />
            Профіль
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            document.cookie = "access-token=";
            api.defaults.headers["Authorization"] = null;

            setTimeout(() => {
              client.resetQueries({
                queryKey: ["user"],
              });

              client.removeQueries({
                queryKey: ["user"],
              });
            }, 200);
          }}
          className="text-red-400 focus:text-red-400"
        >
          <LogOut />
          Вийти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
