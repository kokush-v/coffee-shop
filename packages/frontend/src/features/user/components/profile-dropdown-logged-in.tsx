import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

import { Avatar } from "antd";
import { LogOut } from "lucide-react";

import { useQueryClient } from "@tanstack/react-query";
import { useProfileData } from "@/src/features/user/api/use-profile-data";

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
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            document.cookie = "access-token=";

            setTimeout(() => {
              client.resetQueries({
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
