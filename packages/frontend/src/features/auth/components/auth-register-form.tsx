"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  AuthRegisterFields,
  AuthRegisterSchema,
} from "@/src/features/auth/types/auth-register-schema";

import { AuthInputField } from "@/src/features/auth/components/auth-input-field";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";

import { registerFields } from "@/src/features/auth/const/register-fields";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import AuthService from "@/src/features/auth/api/auth-service";

export const AuthRegisterForm = () => {
  const { control, handleSubmit, setError } = useForm<AuthRegisterFields>({
    resolver: zodResolver(AuthRegisterSchema),
  });

  const router = useRouter();

  const { mutateAsync: register, isError: isRegisterError } = AuthService().register;
  const { mutateAsync: login, isError: isLoginError } = AuthService().login;

  useEffect(() => {
    if (isRegisterError || isLoginError) {
      setError("root", {
        message: "Щось пішло не так",
      });
    }
  }, [isRegisterError, isLoginError, setError]);

  const onSubmit = async (form: AuthRegisterFields) => {
    await register(form);
    await login(form);

    router.push("/");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-2 flex-1 max-w-[310px] mx-2"
    >
      {registerFields.map((field) => (
        <AuthInputField key={field.path} control={control} data={field} />
      ))}
      <Button className="w-full" type="submit">
        Зареєструватись
      </Button>
      <Button variant="ghost" className="w-full text-zinc-500" type="button">
        <Link href="/auth/login">В мене вже є аккаунт</Link>
      </Button>
    </form>
  );
};
