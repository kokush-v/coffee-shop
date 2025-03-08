export type AuthField = {
  path: "email" | "password" | "confirmPassword" | "username";
  placeholder: string;
  type?: string;
  label: string;
  autoComplete: string;
};
