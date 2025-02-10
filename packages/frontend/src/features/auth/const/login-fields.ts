import { AuthField } from "@/src/features/auth/types/auth-field";

export const loginFields: AuthField[] = [
  {
    placeholder: "Ваша електронна адреса",
    path: "email",
    type: "email",
    label: "Електронна адреса",
    autoComplete: "email",
  },
  {
    placeholder: "Ваш пароль",
    path: "password",
    type: "password",
    label: "Пароль",
    autoComplete: "current-password",
  },
];
