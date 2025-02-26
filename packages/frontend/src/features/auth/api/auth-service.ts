import { useMutation } from "@tanstack/react-query";
import { api } from "@/src/config/api";

import { AuthLoginFields } from "@/src/features/auth/types/auth-login-schema";
import { AuthRegisterFields } from "@/src/features/auth/types/auth-register-schema";

import { AuthLoginResponse } from "@/src/features/auth/types/auth-response";

class AuthService {
  private routes = {
    login: "/login/",
    register: "/register/",
  };
  public login = useMutation({
    mutationKey: ["login"],
    onSuccess: (response: AuthLoginResponse) => {
      document.cookie = `access-token=${response.data.token}; path=/`;
    },
    mutationFn: async (form: AuthLoginFields) => api.post(this.routes.login, { ...form }),
  });

  public register = useMutation({
    mutationKey: ["register"],
    mutationFn: async (form: AuthRegisterFields) => api.post(this.routes.register, { ...form }),
  });
}

export default AuthService;
