"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  AuthLoginFields,
  AuthLoginSchema,
} from "@/src/features/auth/types/auth-login-schema";

import { AuthInputField } from "@/src/features/auth/components/auth-input-field";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";

import { loginFields } from "@/src/features/auth/const/login-fields";

export const AuthLoginForm = () => {
  const { control, handleSubmit } = useForm<AuthLoginFields>({
    resolver: zodResolver(AuthLoginSchema),
  });

  const onSubmit = (form: AuthLoginFields) => {
    console.log(form);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 flex-1 mx-2">
      {loginFields.map((field) => (
        <AuthInputField key={field.path} control={control} data={field} />
      ))}
      <Button className="w-full" type="submit">
        Увійти
      </Button>
      <Button variant="ghost" className="w-full text-zinc-500" type="button">
        <Link href="/auth/register">В мене немає аккаунту</Link>
      </Button>
    </form>
  );
};
