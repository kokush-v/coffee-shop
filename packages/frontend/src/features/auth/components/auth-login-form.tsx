"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { AuthLoginFields, AuthLoginSchema } from "@/src/features/auth/types/auth-login-schema";

import { AuthInputField } from "@/src/features/auth/components/auth-input-field";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";

import { loginFields } from "@/src/features/auth/const/login-fields";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import AuthService from "@/src/features/auth/api/auth-service";

import { Loader } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const AuthLoginForm = () => {
	const {
		control,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<AuthLoginFields>({
		resolver: zodResolver(AuthLoginSchema),
	});

	const router = useRouter();

	const client = useQueryClient();

	const {
		login: { mutateAsync, isError, isPending, isSuccess },
	} = new AuthService();

	useEffect(() => {
		if (isError) {
			setError("root", {
				message: "Щось пішло не так",
			});
		}
	}, [isError, setError]);

	const onSubmit = async (form: AuthLoginFields) => {
		toast.promise(mutateAsync(form), {
			loading: "Заходимо...",
			success: () => {
				client.removeQueries({
					queryKey: ["user"],
				});

				router.push("/");

				router.refresh();

				return "Увійшли в аккаунт";
			},
		});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-2 flex-1 mx-2">
			{loginFields.map((field) => (
				<AuthInputField key={field.path} control={control} data={field} />
			))}
			<Button disabled={isPending || isSuccess} className="w-full" type="submit">
				{isPending || isSuccess ? <Loader className="animate-spin" /> : "Увійти"}
			</Button>
			{errors.root && <span className="text-xs text-red-400 font-medium">{errors.root.message}</span>}
			<Button variant="ghost" className="w-full text-zinc-500" type="button">
				<Link href="/auth/register">В мене немає аккаунту</Link>
			</Button>
		</form>
	);
};
