import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

import { LogOut, User, FolderCog } from "lucide-react";

import { useQueryClient } from "@tanstack/react-query";
import { useProfileData } from "@/src/features/user/api/use-profile-data";
import Link from "next/link";

import { api, BACKEND_URL } from "@/src/config/api";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

export const ProfileDropdownLoggedIn = () => {
	const { data } = useProfileData();

	const client = useQueryClient();

	const pathname = usePathname();
	const router = useRouter();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<div className="w-9 h-9 rounded-full bg-zinc-200 flex items-center justify-center font-semibold text-zinc-500 text-xs select-none">
					{data?.username.split("").splice(0, 2).join("").toUpperCase()}
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>Привіт, {data?.username}</DropdownMenuLabel>
				<DropdownMenuItem asChild>
					<Link href="/my">
						<User />
						Профіль
					</Link>
				</DropdownMenuItem>
				{data?.is_staff && (
					<DropdownMenuItem asChild>
						<Link target="_blank" href={`${BACKEND_URL}/admin`}>
							<FolderCog />
							Панель керування
						</Link>
					</DropdownMenuItem>
				)}
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() => {
						document.cookie = "access-token=;path=/";
						api.defaults.headers["Authorization"] = null;

						if (pathname.startsWith("/my")) {
							router.push("/");
						}

						toast.info("Ви вийшли з аккаунту", {
							description: "Ви не зможете зробити замовлення поки не увійдете знову.",
						});

						setTimeout(() => {
							client.resetQueries({
								queryKey: ["user"],
							});

							client.removeQueries({
								queryKey: ["user"],
							});
						}, 200);
					}}
					className="text-red-400 focus:text-red-400">
					<LogOut />
					Вийти
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
