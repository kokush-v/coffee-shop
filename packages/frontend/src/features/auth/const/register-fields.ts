import { AuthField } from "@/src/features/auth/types/auth-field";

export const registerFields: AuthField[] = [
  {
    placeholder: "Ваша електронна адреса",
    path: "email",
    type: "email",
    label: "Електронна адреса",
    autoComplete: "email",
  },
  {
    placeholder: "Ім'я",
    path: "username",
    label: "Як нам до вас звертатись?",
    autoComplete: "name",
  },
  {
    placeholder: "Ваш пароль",
    path: "password",
    type: "password",
    label: "Пароль",
    autoComplete: "new-password",
  },
  {
    placeholder: "Підтвердіть ваш пароль",
    path: "confirmPassword",
    type: "password",
    label: "Повторіть пароль",
    autoComplete: "new-password",
  },
];
