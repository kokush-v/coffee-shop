"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { AuthRegisterFields, AuthRegisterSchema } from "@/src/features/auth/types/auth-register-schema";

import { AuthInputField } from "@/src/features/auth/components/auth-input-field";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";

import { registerFields } from "@/src/features/auth/const/register-fields";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import AuthService from "@/src/features/auth/api/auth-service";

import { Loader } from "lucide-react";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const AuthRegisterForm = () => {
	const { control, handleSubmit, setError } = useForm<AuthRegisterFields>({
		resolver: zodResolver(AuthRegisterSchema),
	});

	const router = useRouter();

	const {
		login: { mutateAsync: login, isError: isLoginError, isPending: isPendingLogin, isSuccess },
		register: { mutateAsync: register, isError: isRegisterError, isPending: isPendingRegister },
	} = new AuthService();

	const isLoading = isPendingRegister || isPendingLogin || isSuccess;

	useEffect(() => {
		if (isRegisterError || isLoginError) {
			setError("root", {
				message: "Щось пішло не так",
			});
		}
	}, [isRegisterError, isLoginError, setError]);

	const client = useQueryClient();

	const onSubmit = async (form: AuthRegisterFields) => {
		toast.promise(Promise.all([await register(form), await login(form)]), {
			loading: "Заходимо...",
			success: async () => {
				await client.resetQueries({
					queryKey: ["user"],
				});

				router.push("/");

				router.refresh();

				return "Увійшли в аккаунт";
			},
		});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-2 flex-1 max-w-[310px] mx-2">
			{registerFields.map((field) => (
				<AuthInputField key={field.path} control={control} data={field} />
			))}
			<Button disabled={isLoading} className="w-full" type="submit">
				{isLoading ? <Loader className="animate-spin" /> : "Зареєструватись"}
			</Button>
			<Button variant="ghost" className="w-full text-zinc-500" type="button">
				<Link href="/auth/login">В мене вже є аккаунт</Link>
			</Button>
		</form>
	);
};
