import { z } from "zod";

export const AuthLoginSchema = z.object({
  email: z.string().email("Некоректна електронна пошта"),
  password: z
    .string()
    .min(8, "Пароль має містити щонайменше 8 символів")
    .max(255, "Пароль занадто довгий"),
});

export type AuthLoginFields = z.infer<typeof AuthLoginSchema>;
