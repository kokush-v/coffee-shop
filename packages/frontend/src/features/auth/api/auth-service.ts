import { useMutation } from "@tanstack/react-query";
import { api } from "@/src/config/api";

import { AuthLoginFields } from "@/src/features/auth/types/auth-login-schema";
import { AuthRegisterFields } from "@/src/features/auth/types/auth-register-schema";

import { AuthLoginResponse } from "@/src/features/auth/types/auth-response";

const routes = {
  login: "/login/",
  register: "/register/",
};

export const AuthService = () => {
  const login = useMutation({
    mutationKey: ["login"],
    onSuccess: (response: AuthLoginResponse) => {
      document.cookie = `access-token=${response.data.token}`;
    },
    mutationFn: async (form: AuthLoginFields) => api.post(routes.login, { ...form }),
  });

  const register = useMutation({
    mutationKey: ["register"],
    mutationFn: async (form: AuthRegisterFields) =>
      api.post(routes.register, { ...form }),
  });

  return { login, register };
};

export default AuthService;
