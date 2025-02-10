import { z } from "zod";

export const AuthRegisterSchema = z
  .object({
    email: z.string().email("Некоректна електронна пошта"),
    password: z
      .string()
      .min(8, "Пароль повинен містити щонайменше 8 символів")
      .max(255, "Пароль занадто довгий"),
    confirmPassword: z
      .string()
      .min(8, "Пароль повинен містити щонайменше 8 символів")
      .max(255, "Пароль занадто довгий"),
    name: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Паролі не співпадають",
    path: ["confirmPassword"],
  });

export type AuthRegisterFields = z.infer<typeof AuthRegisterSchema>;
