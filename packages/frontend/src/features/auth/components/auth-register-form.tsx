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

export const AuthRegisterForm = () => {
  const { control, handleSubmit } = useForm<AuthRegisterFields>({
    resolver: zodResolver(AuthRegisterSchema),
  });

  const onSubmit = (form: AuthRegisterFields) => {
    console.log(form);
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
