export type AuthField = {
  path: "email" | "password" | "confirmPassword" | "name";
  placeholder: string;
  type?: string;
  label: string;
  autoComplete: string;
};
