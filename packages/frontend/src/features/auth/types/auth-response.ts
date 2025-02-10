export interface AuthLoginResponse {
  data: {
    token: string;
    user: {
      id: number;
      email: string;
      username: string;
    };
  };
}
